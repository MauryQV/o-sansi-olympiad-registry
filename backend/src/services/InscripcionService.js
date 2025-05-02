import prisma from '../config/prismaClient.js';
import { io, connectedUsers } from '../index.js';
import { crearNotificacion } from './notificacionService.js';

//import { DateTime } from 'luxon'; //deseable

export const crearInscripcion = async ({ competidorId, convocatoriaId, areaId, tutorIds }) => {
    if (!Array.isArray(tutorIds) || tutorIds.length < 1 || tutorIds.length > 3) {
        throw new Error('Debes seleccionar entre 1 y 3 tutores.');
    }

    const existe = await prisma.inscripcion_area.findFirst({
        where: {
            competidor_id: competidorId,
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (existe) {
        throw new Error('Ya estás inscrito en esta área y convocatoria.');
    }

    const convocatoria = await prisma.convocatoria.findUnique({
        where: { id: convocatoriaId },
        include: { estado_convocatoria: true }
    });

    const ahora = new Date();

    if (
        !convocatoria ||
        convocatoria.estado_convocatoria.nombre.toLowerCase() !== 'activa' ||
        ahora < convocatoria.fecha_inicio ||
        ahora > convocatoria.fecha_fin
    ) {
        throw new Error('La convocatoria no está activa o fuera de fechas válidas.');
    }


    const tutores = await prisma.tutor.findMany({
        where: { id: { in: tutorIds } }
    });

    if (tutores.length !== tutorIds.length) {
        throw new Error('Uno o más tutores seleccionados no existen.');
    }


    const inscripcion = await prisma.inscripcion.create({
        data: {}
    });


    await prisma.inscripcion_area.create({
        data: {
            area_id: areaId,
            convocatoria_id: convocatoriaId,
            competidor_id: competidorId
        }
    });


    const vinculos = await Promise.all(
        tutorIds.map((tutorId) =>
            prisma.inscripcion_tutor.create({
                data: {
                    inscripcion_id: inscripcion.id,
                    tutor_id: tutorId,
                    competidor_id: competidorId
                }
            })
        )
    );


    for (const tutorId of tutorIds) {
        const tutor = await prisma.tutor.findUnique({
            where: { id: tutorId },
            include: { usuario: true }
        });

        const usuarioId = tutor.usuario_id; // este es el que Prisma necesita

        const noti = await crearNotificacion({
            usuarioId,
            tipo: 'solicitud',
            mensaje: 'Tienes una nueva solicitud de inscripción para validar.'
        });

        const tutorSocketId = connectedUsers.get(usuarioId); // Map de sockets
        if (tutorSocketId) {
            io.to(tutorSocketId).emit('notificacion:nueva', noti);
        }
    }

    return {
        mensaje: 'Inscripción realizada correctamente.',
        inscripcion,
        tutores_asignados: vinculos
    };
};


export const validarInscripcion = async ({ tutorId, inscripcionId, acepta }) => {
    const inscripcionTutor = await prisma.inscripcion_tutor.findFirst({
        where: { inscripcion_id: inscripcionId, tutor_id: tutorId }
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
            aprobado: acepta,
            fecha_aprobacion: new Date()
        }
    });

    // Si rechazó, no seguimos más
    if (!acepta) {
        return { mensaje: 'Solicitud rechazada.' };
    }

    // Verificamos si TODOS los tutores ya aprobaron
    const otros = await prisma.inscripcion_tutor.findMany({
        where: { inscripcion_id: inscripcionId }
    });

    const todosAprobados = otros.every(t => t.aprobado === true);

    if (todosAprobados) {
        await prisma.inscripcion.update({
            where: { id: inscripcionId },
            data: { estado_inscripcion: 'aprobada' }
        });

        // Notificar al competidor
        const competidorId = inscripcionTutor.competidor_id;

        const competidor = await prisma.competidor.findUnique({
            where: { id: competidorId },
            include: { usuario: true }
        });

        const noti = await crearNotificacion({
            usuarioId: competidor.usuario.id,
            tipo: 'estado',
            mensaje: 'Tu inscripción fue aprobada por todos los tutores.'
        });

        const socketId = connectedUsers.get(competidor.usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }
    }

    return { mensaje: 'Respuesta registrada correctamente.' };
};

export const obtenerSolicitudesPendientes = async (tutorUsuarioId) => {
    const tutor = await prisma.tutor.findUnique({
        where: { usuario_id: tutorUsuarioId }
    });

    if (!tutor) {
        throw new Error('No se encontró el tutor.');
    }

    const solicitudes = await prisma.inscripcion_tutor.findMany({
        where: {
            tutor_id: tutor.id,
            aprobado: false
        },
        include: {
            inscripcion: true,
            competidor: {
                include: {
                    usuario: true,
                    colegio: true,
                    provincia: {
                        include: {
                            departamento: true
                        }
                    }
                }
            }
        }
    });

    return solicitudes.map((s) => ({
        id: s.id,
        competidor: {
            nombre: s.competidor.usuario.nombre,
            apellido: s.competidor.usuario.apellido,
            colegio: s.competidor.colegio.nombre_colegio,
            provincia: s.competidor.provincia.nombre_provincia,
            departamento: s.competidor.provincia.departamento.nombre_departamento
        },
        fecha_inscripcion: s.inscripcion.fecha_inscripcion,
        estado: s.inscripcion.estado_inscripcion
    }));
};
