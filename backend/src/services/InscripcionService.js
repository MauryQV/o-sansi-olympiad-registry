import prisma from '../config/prismaClient.js';
import { io, connectedUsers } from '../index.js';
import { crearNotificacion } from './notificacionService.js';

//import { DateTime } from 'luxon'; //deseable

export const crearInscripcion = async ({
    competidor_id,
    area_id,
    categoria_id,
    tutor_ids
}) => {
    // validacion de la existencia de los tutores
    const tutores = await validarTutores(tutor_ids);

    // convocatoria asociada al area
    const convocatoria = await obtenerConvocatoriaActivaParaArea(area_id);

    // validar que no se haya inscrito antes
    await validarInscripcionDuplicada(competidor_id, convocatoria.id, area_id);

    // creamos la inscripcion
    const inscripcion = await prisma.inscripcion.create({
        data: {
            competidor_id,
            convocatoria_id: convocatoria.id,
            area_id,
            categoria_id
        }
    });

    //relaciones
    const vinculos = await Promise.all(
        tutor_ids.map((tutor_id) =>
            prisma.inscripcion_tutor.create({
                data: {
                    inscripcion_id: inscripcion.id,
                    tutor_id,
                    competidorId: competidor_id
                }
            })
        )
    );

    // notificacion a los tutores
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
const validarTutores = async (tutor_ids) => {
    if (!Array.isArray(tutor_ids) || tutor_ids.length < 1 || tutor_ids.length > 3) {
        throw new Error('Debes seleccionar entre 1 y 3 tutores.');
    }

    const tutores = await prisma.tutor.findMany({
        where: { id: { in: tutor_ids } }
    });

    if (tutores.length !== tutor_ids.length) {
        throw new Error('Uno o más tutores seleccionados no existen.');
    }

    return tutores;
};




const obtenerConvocatoriaActivaParaArea = async (area_id) => {
    const ahora = new Date();

    const areaConvocatoria = await prisma.area_convocatoria.findFirst({
        where: {
            area_id,
            convocatoria: {
                id_estado_convocatoria: 2, // solo con el id, en inscripciones
                fecha_inicio: { lte: ahora },
                fecha_fin: { gte: ahora }
            }
        },
        include: {
            convocatoria: true
        }
    });

    if (!areaConvocatoria) {
        throw new Error('No hay convocatorias disponibles para esta área.');
    }

    return areaConvocatoria.convocatoria;
};



const validarInscripcionDuplicada = async (competidor_id, convocatoria_id, area_id) => {
    const existe = await prisma.inscripcion.findFirst({
        where: {
            competidor_id: competidor_id,
            convocatoria_id: convocatoria_id,
            area_id: area_id
        }
    });

    if (existe) {
        throw new Error('Ya tienes una inscripción en esta área.');
    }
};




export const aceptarInscripcion = async ({ inscripcion_id, tutorId }) => {
    // console.log('inscripcion_id', inscripcion_id);
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
            data: { estado_inscripcion: 'Aceptada' }
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


export const rechazarInscripcion = async ({
    inscripcion_id,
    tutorId,
    motivo_rechazo_id,
    descripcion_rechazo,
}) => {
    // Verificar que la inscripción existe y pertenece al tutor
    const inscripcionTutor = await prisma.inscripcion_tutor.findFirst({
        where: { inscripcion_id, tutor_id: tutorId },
        include: { inscripcion: true },
    });

    if (!inscripcionTutor) {
        throw new Error('No se encontró esta inscripción para este tutor.');
    }

    if (inscripcionTutor.aprobado !== false && inscripcionTutor.fecha_aprobacion) {
        throw new Error('Esta solicitud ya fue respondida.');
    }

    if (!motivo_rechazo_id) {
        throw new Error('Debes proporcionar un motivo de rechazo.');
    }

    // Actualizar la inscripción del tutor con el motivo de rechazo y la descripción si aplica
    await prisma.inscripcion_tutor.update({
        where: { id: inscripcionTutor.id },
        data: {
            aprobado: false,
            fecha_aprobacion: new Date(),
            motivo_rechazo_id,
            descripcion_rechazo: motivo_rechazo_id === 7 ? descripcion_rechazo : null,
        },
    });

    // Verificar si todos los tutores han respondido
    const otros = await prisma.inscripcion_tutor.findMany({
        where: { inscripcion_id },
    });

    const todosRespondidos = otros.every((t) => t.aprobado !== null && t.fecha_aprobacion !== null);
    const todosRechazados = otros.every((t) => t.aprobado === false);

    if (todosRespondidos && todosRechazados) {
        // Actualizar el estado de la inscripción a 'rechazado'
        await prisma.inscripcion.update({
            where: { id: inscripcion_id },
            data: { estado_inscripcion: 'Rechazada' },
        });

        // Notificar al competidor
        const { usuario } = await prisma.competidor.findUnique({
            where: { id: inscripcionTutor.inscripcion.competidor_id },
            include: { usuario: true },
        });

        const noti = await crearNotificacion({
            usuarioId: usuario.id,
            tipo: 'estado',
            mensaje: 'Inscripción rechazada. Revisa el motivo asignado.',
        });

        const socketId = connectedUsers.get(usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }
    }

    return { mensaje: 'Solicitud rechazada con motivo.' };
};




export const obtenerMotivosRechazo = async () => {
    try {
        const motivos = await prisma.motivo_rechazo.findMany();
        return motivos;
    } catch (error) {
        console.error('Error al obtener motivos de rechazo:', error);
        throw new Error('Error al obtener motivos de rechazo.');
    }
};
