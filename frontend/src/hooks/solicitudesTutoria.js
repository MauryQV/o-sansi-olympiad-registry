import { useState, useEffect } from 'react';
import { obtenerSolicitudesPendientes, obtenerMotivosRechazo } from '../services/solicitudTutor';

export const useSolicitudesTutoria = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [motivosRechazo, setMotivosRechazo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [solicitudesData, motivosData] = await Promise.all([
                obtenerSolicitudesPendientes(),
                obtenerMotivosRechazo()
            ]);

            const adaptadas = solicitudesData.map((s) => ({
                id: s.solicitud_id,
                nombre: s.nombre_completo,
                area: `${s.area_nombre} - ${s.categoria_nombre}`,
                grado: `${s.grado} de ${s.nivel}`,
                relacion: s.rol,
                estado: s.estado.charAt(0).toUpperCase() + s.estado.slice(1)
            }));

            setSolicitudes(adaptadas);
            setMotivosRechazo(motivosData);
        } catch (err) {
            console.error('Error cargando datos:', err);
            setError(err.message || 'Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return { solicitudes, setSolicitudes, motivosRechazo, loading, error };
};
