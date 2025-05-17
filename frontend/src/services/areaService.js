import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';

// Configurar axios con la URL y timeout por defecto
const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT
});

export const getAreas = async () => {
    const response = await api.get(`/ver-areas`); // Usar la baseURL configurada en `api`
    return response.data;
};

export const crearArea = async ({ nombre, descripcion, costo }) => {
    const response = await api.post(`/crear-area`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const eliminarArea = async (id) => {
    const response = await api.delete(`/eliminar-area/${id}`);
    return response.data;
};

export const actualizarArea = async (id, { nombre, descripcion, costo }) => {
    const response = await api.patch(`/actualizar-area/${id}`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const getAreaById = async (id) => {
    const response = await api.get(`/ver-area/${id}`);
    return response.data;
};