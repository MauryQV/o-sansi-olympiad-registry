import prisma from '../config/prismaClient.js';

/*export const crearNotificacion = async ({ usuarioId, tipo, mensaje }) => {
    return await prisma.notificacion.create({
        data: {
            usuarioId,
            tipo,
            mensaje
        }
    });
};
*/

// notificacionService.js

export const crearNotificacion = async ({ usuarioId, tipo, mensaje }) => {
    try {
        const notificacion = await prisma.notificacion.create({
            data: {
                usuarioId,
                tipo,
                mensaje,
                leido: false
            }
        });
        return notificacion;
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};

export const obtenerNotificacionesUsuario = async (usuarioId) => {
    console.log('Obteniendo notificaciones para el usuario:', usuarioId);
    try {
        const notificaciones = await prisma.notificacion.findMany({
            where: { usuarioId },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limitar a las últimas 50 notificaciones
        });
        return notificaciones;
    } catch (error) {
        console.error('Error al obtener notificaciones :v', error);
        throw error;
    }
};

export const marcarNotificacionComoLeida = async (notificacionId, usuarioId) => {
    try {
        const notificacion = await prisma.notificacion.update({
            where: {
                id: notificacionId,
                usuarioId // Asegurar que la notificación pertenece al usuario
            },
            data: { leido: true }
        });
        return notificacion;
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        throw error;
    }
};

export const marcarTodasComoLeidas = async (usuarioId) => {
    try {
        await prisma.notificacion.updateMany({
            where: {
                usuarioId,
                leido: false
            },
            data: { leido: true }
        });
        return { mensaje: 'Todas las notificaciones marcadas como leídas' };
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        throw error;
    }
};

export const eliminarNotificacion = async (notificacionId, usuarioId) => {
    try {
        await prisma.notificacion.delete({
            where: {
                id: notificacionId,
                usuarioId
            }
        });
        return { mensaje: 'Notificación eliminada correctamente' };
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        throw error;
    }
};

