import prisma from '../config/prismaClient.js';

export const crearNotificacion = async ({ usuarioId, tipo, mensaje }) => {
    return await prisma.notificacion.create({
        data: {
            usuarioId,
            tipo,
            mensaje
        }
    });
};
