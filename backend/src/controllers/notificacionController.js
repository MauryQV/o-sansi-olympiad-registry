import {
    obtenerNotificacionesUsuario,
    marcarNotificacionComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
} from '../services/notificacionService.js';

export const getNotificaciones = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        console.log('Obteniendo notificaciones para el usuario (controller):', usuarioId);
        const notificaciones = await obtenerNotificacionesUsuario(usuarioId);
        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones XDDD:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const marcarLeida = async (req, res) => {
    try {
        const notificacionId = parseInt(req.params.id);
        const usuarioId = req.user.id;

        await marcarNotificacionComoLeida(notificacionId, usuarioId);
        res.json({ mensaje: 'Notificación marcada como leída' });
    } catch (error) {
        // console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const marcarTodasLeidas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        await marcarTodasComoLeidas(usuarioId);
        res.json({ mensaje: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar todas como leídas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminar = async (req, res) => {
    try {
        const notificacionId = parseInt(req.params.id);
        const usuarioId = req.user.id;

        await eliminarNotificacion(notificacionId, usuarioId);
        res.json({ mensaje: 'Notificación eliminada correctamente' });
    } catch (error) {
        // console.error('Error al eliminar notificación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
