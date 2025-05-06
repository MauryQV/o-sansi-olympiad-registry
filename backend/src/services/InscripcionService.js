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

    // Parte simplificada para notificaciones - esto es lo que modificamos:
    for (const tutor of tutores) {
        // Obtener el ID de usuario del tutor para la notificación
        const tutorUsuarioId = tutor.usuario_id;

        console.log(`Enviando notificación al tutor con usuario_id: ${tutorUsuarioId}`);

        // Enviar directamente la notificación vía socket
        const socketId = connectedUsers.get(tutorUsuarioId);
        if (socketId) {
            console.log(`Socket ID encontrado: ${socketId}, enviando notificación...`);
            io.to(socketId).emit('notificacion:nueva', {
                mensaje: 'Tienes una nueva solicitud de inscripción'
            });
        } else {
            console.log(`No se encontró socket conectado para el usuario ${tutorUsuarioId}`);
        }
    }

    return {
        mensaje: 'inscripcion realizada correctamente.',
        inscripcion,
        tutores_asignados: vinculos
    };
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
