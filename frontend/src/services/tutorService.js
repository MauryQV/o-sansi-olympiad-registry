import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777/api';

/**
 * Registra un nuevo tutor
 * @param {Object} tutorData - Datos del tutor
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const registrarTutor = async (tutorData) => {
    try {
        const response = await axios.post(`${API_URL}/tutores/registro`, tutorData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al registrar el tutor');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Obtiene todos los tutores (requiere autenticación)
 * @param {string} token - Token de autenticación
 * @returns {Promise} - Promesa con la lista de tutores
 */
export const obtenerTutores = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/tutores`, {
            headers: { Authorization: token }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al obtener los tutores');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Obtiene un tutor por ID (requiere autenticación)
 * @param {string} id - ID del tutor
 * @param {string} token - Token de autenticación
 * @returns {Promise} - Promesa con los datos del tutor
 */
export const obtenerTutorPorId = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/tutores/${id}`, {
            headers: { Authorization: token }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al obtener el tutor');
        }
        throw new Error('Error de conexión con el servidor');
    }
}; 