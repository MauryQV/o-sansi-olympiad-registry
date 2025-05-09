import { io, connectedUsers } from '../index.js';

/**
 * Servicio para manejar las operaciones de socket
 */
export const socketService = {
    /**
     * Envía un mensaje a un usuario específico
     * @param {string} userId - ID del usuario destinatario
     * @param {string} event - Nombre del evento
     * @param {any} data - Datos a enviar
     * @returns {boolean} - true si se envió correctamente, false si el usuario no está conectado
     */
    enviarMensajeAUsuario: (userId, event, data) => {
        const socketId = connectedUsers.get(userId);
        if (socketId) {
            io.to(socketId).emit(event, data);
            return true;
        }
        return false;
    },

    /**
     * Envía un mensaje a todos los usuarios conectados
     * @param {string} event - Nombre del evento
     * @param {any} data - Datos a enviar
     */
    enviarMensajeATodos: (event, data) => {
        io.emit(event, data);
    },

    /**
     * Obtiene la lista de usuarios conectados
     * @returns {Array} - Array con los IDs de los usuarios conectados
     */
    obtenerUsuariosConectados: () => {
        return Array.from(connectedUsers.keys());
    }
};