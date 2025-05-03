import prisma from '../config/prismaClient.js';
import { io, connectedUsers } from '../index.js';
import { crearNotificacion } from './notificacionService.js';

//import { DateTime } from 'luxon'; //deseable

export const crearInscripcion = async ({
    competidorId,
    convocatoriaId,
    areaId,
    tutorIds
}) => {
    if (!Array.isArray(tutorIds) || tutorIds.length < 1 || tutorIds.length > 3) {
        throw new Error('Debes seleccionar entre 1 y 3 tutores.');
    }

    // Validar que no exista ya una inscripción en esa convocatoria y área
    const existe = await prisma.inscripcion.findFirst({
        where: {
            competidor_id: competidorId,
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (existe) {
        throw new Error('Ya tienes una inscripción en esta área y convocatoria.');
    }

    const convocatoria = await prisma.convocatoria.findUnique({
        where: { id: convocatoriaId },
        include: { estado_convocatoria: true }
    });

    const ahora = new Date();

    if (
        !convocatoria ||
        convocatoria.estado_convocatoria.nombre.toLowerCase() !== 'en inscripciones' ||
        ahora < convocatoria.fecha_inicio ||
        ahora > convocatoria.fecha_fin
    ) {
        throw new Error('La convocatoria no está activa o está fuera de fechas válidas.');
    }

    // validacion de tutores
    const tutores = await prisma.tutor.findMany({
        where: { id: { in: tutorIds } }
    });

    if (tutores.length !== tutorIds.length) {
        throw new Error('Uno o más tutores seleccionados no existen.');
    }

    // crear una inscripción
    const inscripcion = await prisma.inscripcion.create({
        data: {
            competidor_id: competidorId,
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    // crear los vínculos entre la inscripción y los tutores
    const vinculos = await Promise.all(
        tutorIds.map((tutorId) =>
            prisma.inscripcion_tutor.create({
                data: {
                    inscripcion_id: inscripcion.id,
                    tutor_id: tutorId,
                    competidorId: competidorId
                }
            })
        )
    );

    // apartado de notificaciones
    for (const tutor of tutores) {
        const noti = await crearNotificacion({
            usuarioId: tutor.usuario_id,
            tipo: 'solicitud',
            mensaje: 'Tienes una nueva solicitud de inscripción para validar.'
        });

        const tutorSocketId = connectedUsers.get(tutor.usuario_id);
        if (tutorSocketId) {
            io.to(tutorSocketId).emit('notificacion:nueva', noti);
        }
    }

    return {
        mensaje: 'inscripcion realizada correctamente.',
        inscripcion,
        tutores_asignados: vinculos
    };
};



export const validarInscripcion = async ({ tutorId, inscripcionId, acepta }) => {
    const inscripcionTutor = await prisma.inscripcion_tutor.findFirst({
        where: { inscripcion_id: inscripcionId, tutor_id: tutorId },
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
            aprobado: acepta,
            fecha_aprobacion: new Date()
        }
    });

    if (!acepta) {
        return { mensaje: 'Solicitud rechazada.' };
    }

    const otros = await prisma.inscripcion_tutor.findMany({
        where: { inscripcion_id: inscripcionId }
    });

    const todosAprobados = otros.every(t => t.aprobado === true);

    if (todosAprobados) {
        await prisma.inscripcion.update({
            where: { id: inscripcionId },
            data: { estado_inscripcion: 'aprobada' }
        });

        const competidorId = inscripcionTutor.inscripcion.competidor_id;

        const competidor = await prisma.competidor.findUnique({
            where: { id: competidorId },
            include: { usuario: true }
        });

        const noti = await crearNotificacion({
            usuarioId: competidor.usuario.id,
            tipo: 'estado',
            mensaje: 'Inscripción aprobada.'
        });

        const socketId = connectedUsers.get(competidor.usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }
    }

    return { mensaje: 'Respuesta registrada correctamente.' };
};
