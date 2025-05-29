import apiAuth from '../api/api'

//servicio para obtener solicitudes pendientes  
export const obtenerSolicitudesPendientes = async () => {
    const response = await apiAuth.get('/solicitudes');
    if (response.status !== 200) {
        throw new Error('Error al obtener solicitudes pendientes');
    }
    return response.data;

};

//servicio para obtener motivos de rechazo
export const obtenerMotivosRechazo = async () => {
    const response = await apiAuth.get('/inscripcion-tutor/motivos-rechazo');
    if (response.status !== 200) {
        throw new Error('Error al obtener motivos de rechazo');
    }
    return response.data;
}


//servicio para aceptar solicitud de tutor
export const aceptarSolicitudTutor = async (solicitudId) => {
    const response = await apiAuth.patch(`/inscripcion-tutor/aceptar/${solicitudId}`);
    if (response.status !== 200) {
        throw new Error('Error al aceptar solicitud de tutor');
    }
    return response.data;
}

//servicio para rechazar solicitud de tutor
export const rechazarSolicitudTutor = async (solicitudId, motivoRechazoId) => {
    const response = await apiAuth.patch(
        `/inscripcion-tutor/rechazar/${solicitudId}`,
        { motivo_rechazo_id: motivoRechazoId }
    );

    if (response.status !== 200) {
        throw new Error('Error al rechazar solicitud de tutor');
    }

    return response.data;
};