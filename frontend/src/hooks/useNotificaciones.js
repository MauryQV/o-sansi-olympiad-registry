import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { useSocket } from '../context/socketContext';
import axios from 'axios';

export const useNotifications = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { usuario: usuarioAuth } = useAuth();
    const { socket } = useSocket();

    // Función para obtener notificaciones desde la API
    const cargarNotificaciones = useCallback(async () => {
        if (!usuarioAuth) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Cargando notificaciones para usuario:', usuarioAuth);

            const response = await axios.get('http://localhost:7777/api/notificaciones', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Respuesta del servidor:', response.data);

            if (response.status !== 200) {
                throw new Error('Error al cargar notificaciones');
            }

            const data = response.data;

            // Convertir las notificaciones de la BD al formato que usa el componente
            const notificacionesFormateadas = data.map(notif => ({
                id: notif.id,
                mensaje: notif.mensaje,
                fecha: new Date(notif.createdAt).toLocaleString(),
                leido: notif.leido,
                tipo: notif.tipo,
                // Si es una notificación de rechazo, extraer el motivo del mensaje
                motivo: notif.tipo === 'rechazo' && notif.mensaje.includes('Motivo:')
                    ? notif.mensaje.split('Motivo: ')[1]
                    : null
            }));

            console.log('Notificaciones formateadas:', notificacionesFormateadas);
            setNotificaciones(notificacionesFormateadas);
            setError(null);
        } catch (err) {
            console.error('Error al cargar notificaciones:', err);
            setError(err.message);
            // En caso de error, establecer array vacío
            setNotificaciones([]);
        } finally {
            setLoading(false);
        }
    }, [usuarioAuth]);

    // Cargar notificaciones al montar el componente
    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    // Escuchar nuevas notificaciones por socket
    useEffect(() => {
        if (!socket || !usuarioAuth) return;

        const handleNuevaNotificacion = (data) => {
            console.log('Nueva notificación recibida por socket:', data);

            const nuevaNotificacion = {
                id: data.id || Date.now(), // Usar el ID de la BD si está disponible
                mensaje: data.mensaje || "Nueva notificación",
                fecha: new Date().toLocaleString(),
                leido: false,
                tipo: data.tipo || 'general',
                motivo: data.motivo || null
            };

            setNotificaciones(prev => {
                console.log('Agregando nueva notificación:', nuevaNotificacion);
                return [nuevaNotificacion, ...prev];
            });
        };

        // Limpiar listeners existentes
        socket.off("notificacion:nueva");
        socket.off("notificacion:resultadoSolicitud");
        socket.off("notificacion:competidor");

        // Configurar listeners
        socket.on("notificacion:nueva", handleNuevaNotificacion);
        socket.on("notificacion:resultadoSolicitud", handleNuevaNotificacion);
        socket.on("notificacion:competidor", handleNuevaNotificacion);

        return () => {
            socket.off("notificacion:nueva");
            socket.off("notificacion:resultadoSolicitud");
            socket.off("notificacion:competidor");
        };
    }, [socket, usuarioAuth]);

    // Marcar notificación como leída
    const marcarComoLeida = async (id) => {
        try {
            const response = await axios.patch(
                `http://localhost:7777/api/notificaciones/${id}/leida`,
                {}, // Body vacío para PATCH
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setNotificaciones(prev =>
                    prev.map(notif =>
                        notif.id === id ? { ...notif, leido: true } : notif
                    )
                );
                console.log('Notificación marcada como leída:', id);
            }
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    // Eliminar notificación
    const eliminarNotificacion = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:7777/api/notificaciones/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setNotificaciones(prev => prev.filter(notif => notif.id !== id));
                console.log('Notificación eliminada:', id);
            }
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    // Marcar todas como leídas
    const marcarTodasComoLeidas = async () => {
        try {
            const response = await axios.patch(
                'http://localhost:7777/api/notificaciones/todas/leidas',
                {}, // Body vacío para PATCH
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setNotificaciones(prev =>
                    prev.map(notif => ({ ...notif, leido: true }))
                );
                console.log('Todas las notificaciones marcadas como leídas');
            }
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    // Obtener contador de no leídas
    const contadorNoLeidas = notificaciones.filter(n => !n.leido).length;

    // Debug en tiempo real
    useEffect(() => {
        console.log('Estado actual del hook:');
        console.log('- Notificaciones:', notificaciones);
        console.log('- Loading:', loading);
        console.log('- Error:', error);
        console.log('- Contador no leídas:', contadorNoLeidas);
    }, [notificaciones, loading, error, contadorNoLeidas]);

    return {
        notificaciones,
        loading,
        error,
        contadorNoLeidas,
        cargarNotificaciones,
        marcarComoLeida,
        eliminarNotificacion,
        marcarTodasComoLeidas
    };
};