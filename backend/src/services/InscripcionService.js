import prisma from '../config/prismaClient.js';
import { io, connectedUsers } from '../index.js';
import { crearNotificacion } from './notificacionService.js';

//import { DateTime } from 'luxon'; //deseable

export const crearInscripcion = async ({ competidorId, convocatoriaId, areaId, tutorIds }) => {
    if (!Array.isArray(tutorIds) || tutorIds.length < 1 || tutorIds.length > 3) {
        throw new Error('error al seleccionar tutores');
    }

    const existe = await prisma.inscripcion_area.findFirst({
        where: {
            competidor_id: competidorId,
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (existe) {
        throw new Error('no se permite inscribirse en la misma area');
    }

    const convocatoria = await prisma.convocatoria.findUnique({
        where: { id: convocatoriaId },
        include: { estado_convocatoria: true }
    });

    const ahora = new Date();

    if (
        !convocatoria || //subir el commit de inscripcion mas rato
        convocatoria.estado_convocatoria.nombre.toLowerCase() !== 'en inscripcion' ||
        ahora < convocatoria.fecha_inicio ||
        ahora > convocatoria.fecha_fin
    ) {
        throw new Error('La convocatoria no esta activa o fuera de fechas validas.');
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

        const usuarioId = tutor.usuario_id; // id del usuario asociado al tutor

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

        // notificacion al competidor
        const competidorId = inscripcionTutor.competidor_id;

        const competidor = await prisma.competidor.findUnique({
            where: { id: competidorId },
            include: { usuario: true }
        });
        //socketId del competidor
        const noti = await crearNotificacion({
            usuarioId: competidor.usuario.id,
            tipo: 'estado',
            mensaje: 'Inscripción aprobada.',
        });

        const socketId = connectedUsers.get(competidor.usuario.id);
        if (socketId) {
            io.to(socketId).emit('notificacion:nueva', noti);
        }
    }

    return { mensaje: 'Respuesta registrada correctamente.' };
};

