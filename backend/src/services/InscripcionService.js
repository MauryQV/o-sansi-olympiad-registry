import prisma from '../config/prismaClient.js';
import { io, connectedUsers } from '../index.js';
import { crearNotificacion } from './notificacionService.js';

//import { DateTime } from 'luxon'; //deseable

export const crearInscripcion = async ({
    competidorId,
    areaId,
    categoriaId,
    tutorIds
}) => {
    //validar tutores
    const tutores = await validarTutores(tutorIds);

    // buscar convocatoria activa asociada al área
    const convocatoria = await obtenerConvocatoriaActivaParaArea(areaId);

    // validar que no haya inscripcion previa en esa area/convocatoria
    await validarInscripcionDuplicada(competidorId, convocatoria.id, areaId);

    // crear inscripción
    const inscripcion = await prisma.inscripcion.create({
        data: {
            competidor_id: competidorId,
            convocatoria_id: convocatoria.id,
            area_id: areaId,
            categoria_id: categoriaId
        }
    });

    // 5. Relacionar tutores
    const vinculos = await Promise.all(
        tutorIds.map((tutorId) =>
            prisma.inscripcion_tutor.create({
                data: {
                    inscripcion_id: inscripcion.id,
                    tutor_id: tutorId,
                    competidorId
                }
            })
        )
    );

    // notificaciones a tutores
    for (const tutor of tutores) {
        const socketId = connectedUsers.get(tutor.usuario_id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', {
                mensaje: 'Tienes una nueva solicitud de inscripción'
            });
        }
    }

    return {
        mensaje: 'Inscripción realizada correctamente.',
        inscripcion,
        tutores_asignados: vinculos
    };
};

//Validar que existen los tutores y que son 1 a 3
const validarTutores = async (tutorIds) => {
    if (!Array.isArray(tutorIds) || tutorIds.length < 1 || tutorIds.length > 3) {
        throw new Error('Debes seleccionar entre 1 y 3 tutores.');
    }

    const tutores = await prisma.tutor.findMany({
        where: { id: { in: tutorIds } }
    });

    if (tutores.length !== tutorIds.length) {
        throw new Error('Uno o más tutores seleccionados no existen.');
    }

    return tutores;
};



const obtenerConvocatoriaActivaParaArea = async (areaId) => {
    const ahora = new Date();

    const areaConvocatoria = await prisma.area_convocatoria.findFirst({
        where: {
            area_id: areaId,
            convocatoria: {
                estado_convocatoria: {
                    nombre: { equals: 'en inscripciones', mode: 'insensitive' }
                },
                fecha_inicio: { lte: ahora },
                fecha_fin: { gte: ahora }
            }
        },
        include: { convocatoria: true }
    });

    if (!areaConvocatoria) {
        throw new Error('No hay convocatoria activa para esta área.');
    }

    return areaConvocatoria.convocatoria;
};


const validarInscripcionDuplicada = async (competidorId, convocatoriaId, areaId) => {
    const existe = await prisma.inscripcion.findFirst({
        where: {
            competidor_id: competidorId,
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (existe) {
        throw new Error('Ya tienes una inscripción en esta área.');
    }
};




export const aceptarInscripcion = async ({ inscripcion_id, tutorId }) => {
    const inscripcionTutor = await prisma.inscripcion_tutor.findFirst({
        where: { inscripcion_id, tutor_id: tutorId },
        include: { inscripcion: true }
    });

    if (!inscripcionTutor) {
        throw new Error('No se encontró esta inscripción para este tutor.');
    }

    if (inscripcionTutor.aprobado !== false && inscripcionTutor.fecha_aprobacion) {
        throw new Error('Esta solicitud ya fue respondida.');
    }

    await prisma.inscripcion_tutor.update({
        where: { id: inscripcionTutor.id },
        data: {
            aprobado: true,
            fecha_aprobacion: new Date(),
            motivo_rechazo_id: null
        }
    });

    const otros = await prisma.inscripcion_tutor.findMany({ where: { inscripcion_id } });
    const todosAprobados = otros.every(t => t.aprobado === true);

    if (todosAprobados) {
        await prisma.inscripcion.update({
            where: { id: inscripcion_id },
            data: { estado_inscripcion: 'aprobada' }
        });

        const { usuario } = await prisma.competidor.findUnique({
            where: { id: inscripcionTutor.inscripcion.competidor_id },
            include: { usuario: true }
        });

        const noti = await crearNotificacion({
            usuarioId: usuario.id,
            tipo: 'estado',
            mensaje: 'Inscripción aprobada.'
        });

        const socketId = connectedUsers.get(usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }
    }

    return { mensaje: 'Solicitud aceptada correctamente.' };
};


export const rechazarInscripcion = async ({ inscripcion_id, tutorId, motivo_rechazo_id }) => {
    const inscripcionTutor = await prisma.inscripcion_tutor.findFirst({
        where: { inscripcion_id, tutor_id: tutorId },
        include: { inscripcion: true }
    });

    if (!inscripcionTutor) {
        throw new Error('No se encontro esta inscripción para este tutor.');
    }

    if (inscripcionTutor.aprobado !== false && inscripcionTutor.fecha_aprobacion) {
        throw new Error('Esta solicitud ya fue respondida.');
    }

    if (!motivo_rechazo_id) {
        throw new Error('Debes proporcionar un motivo de rechazo.');
    }

    await prisma.inscripcion_tutor.update({
        where: { id: inscripcionTutor.id },
        data: {
            aprobado: false,
            fecha_aprobacion: new Date(),
            motivo_rechazo_id: motivo_rechazo_id
        }
    });

    const { usuario } = await prisma.competidor.findUnique({
        where: { id: inscripcionTutor.inscripcion.competidor_id },
        include: { usuario: true }
    });

    const noti = await crearNotificacion({
        usuarioId: usuario.id,
        tipo: 'estado',
        mensaje: 'Inscripción rechazada. Revisa el motivo asignado.'
    });

    const socketId = connectedUsers.get(usuario.id);
    if (socketId) {
        io.to(socketId).emit('notificacion:nueva', noti);
    }

    return { mensaje: 'Solicitud rechazada con motivo.' };
};
