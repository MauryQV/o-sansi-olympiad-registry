import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';

// Configurar axios con la URL y timeout por defecto
const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT
});


export const getAreas = async () => {
    const response = await api.get(`${API_BASE_URL}/ver-areas`);
    return response.data;

};



export const crearArea = async ({ nombre, descripcion, costo }) => {
    const response = await api.post(`${API_BASE_URL}/crear-area`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const eliminarArea = async (id) => {
    const response = await api.delete(`${API_BASE_URL}/eliminar-area/${id}`);
    return response.data;
}

export const actualizarArea = async (id, { nombre, descripcion, costo }) => {
    const response = await api.patch(`${API_BASE_URL}/actualizar-area/${id}`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const getAreaById = async (id) => {
    const response = await api.get(`${API_BASE_URL}/ver-area/${id}`);
    return response.data;
}
