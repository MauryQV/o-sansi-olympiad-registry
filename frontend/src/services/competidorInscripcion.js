import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';
import apiAuth from '../api/api'; //instancia con token de autenticacion

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

export const registrarInscripcion = async ({ area_id, categoria_id, tutor_ids }) => {
    try {
        console.log('Datos de inscripción:', { area_id, categoria_id, tutor_ids });
        const response = await apiAuth.post('/inscripcion-tutor', {
            area_id,
            categoria_id,
            tutor_ids
        });

        return response.data;
    } catch (error) {
        console.error('Error al registrar la inscripción:', error);
        throw error;
    }
};


export const obtenerMisInscripciones = async () => {
    try {
        console.log('Consultando mis inscripciones...');
        const response = await apiAuth.get('/competidor/mis-inscripciones');
        console.log('Respuesta recibida:', response.data);
        return response.data.inscripciones;
    } catch (error) {
        console.error('Error al obtener mis inscripciones:', error);


export const obtenerGrados = async (id) => {
    try {
        const response = await api.get(`/ver-grados-categoria/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener grados:', error);
        throw error;
    }
};
