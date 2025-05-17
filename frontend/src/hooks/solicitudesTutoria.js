import { useState, useEffect } from 'react';
import { obtenerSolicitudesPendientes } from '../services/solicitudTutor';

export const useSolicitudesTutoria = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarSolicitudes = async () => {
        try {
            setLoading(true);
            const data = await obtenerSolicitudesPendientes();

            // Adaptamos estructura para el frontend
            const adaptadas = data.map((s) => ({
                id: s.solicitud_id,
                nombre: s.nombre_completo,
                area: `${s.area_nombre} - ${s.categoria_nombre}`,
                grado: `${s.grado} de ${s.nivel}`,
                relacion: s.rol,
                estado: s.estado.charAt(0).toUpperCase() + s.estado.slice(1)
            }));

            setSolicitudes(adaptadas);
        } catch (err) {
            console.error('Error cargando solicitudes:', err);
            setError(err.message || 'Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    return { solicitudes, setSolicitudes, loading, error };
};
