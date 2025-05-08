import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';

// Configurar axios con la URL y timeout por defecto
const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT
});

//obtener el numero de convocatorias

export const obtenerNumerodeConvocatoriasActivas = async () => {
    try {
        const response = await api.get('/convocatoria-numeros');
        return response.data;
    } catch (error) {
        console.error('Error al obtener convocatorias:', error);
        throw error;
    }
}

export const obtenerUnaConvocatoriaActiva = async (id) => {
    try {
        const response = await api.get(`/convocatoria-una-activa`);
        return response.data;
    } catch (error) {
        console.error('error al obtener una convocatoria activa:', error);
        throw error;
    }
}


export const obtenerCategoriasArea = async (id) => {
    try {
        const response = await api.get(`/ver-categorias-area/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías del área:', error);
        throw error;
    }
}

export const obtenerAreas = async () => {
    try {
        const response = await api.get('/ver-areas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        throw error;
    }
}

export const obtenerTutores = async (id_area, nombre) => {
    try {
        const response = await api.get('/tutor-areas', {
            params: {
                id_area, // Parámetro opcional para filtrar por área
                nombre,  // Parámetro opcional para buscar por nombre
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener tutores:', error);
        throw error;
    }
};
