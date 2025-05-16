import apiAuth from '../api/api'

export const obtenerSolicitudesPendientes = async () => {
    const response = await apiAuth.get('/solicitudes');
    if (response.status !== 200) {
        throw new Error('Error al obtener solicitudes pendientes');
    }
    return response.data;

};
