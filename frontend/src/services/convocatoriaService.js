import axios from 'axios';

const API_BASE_URL = 'http://localhost:7777/api';

export const obtenerConvocatorias = async () => {
    const response = await axios.get(`${API_BASE_URL}/convocatorias`);
    return response.data;
};

export const crearConvocatoria = async (convocatoria) => {
    const response = await axios.post(`${API_BASE_URL}/crear-convocatoria`, convocatoria);
    return response.data;
};

export const visualizarConvocatoria = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/visualizar-convocatoria/${id}`);
    return response.data;
};

export const actualizarConvocatoria = async (id, data) => {
    const response = await axios.patch(`${API_BASE_URL}/actualizar-convocatoria/${id}`, data);
    return response.data;
};

export const eliminarConvocatoria = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/eliminar-convocatoria/${id}`);
    return response.data;
};

export const obtenerConvocatoriaPorId = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/convocatoria/${id}`);
    //console.log(' modulo de service, datos enviados del backend:', response.data);
    return response.data;
};