import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777/api';

/**
 * Obtiene todos los tutores disponibles para inscripción
 * @returns {Promise} - Promesa con la lista de tutores
 */
export const obtenerTutoresDisponibles = async () => {
    try {
        const response = await axios.get(`${API_URL}/tutores/disponibles`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al obtener los tutores disponibles');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Busca tutores por nombre (autocompletado)
 * @param {string} nombre - Nombre o parte del nombre del tutor
 * @param {string} area - Área opcional para filtrar tutores
 * @returns {Promise} - Promesa con la lista de tutores filtrados
 */
export const buscarTutores = async (nombre, area = null) => {
    try {
        let url = `${API_URL}/tutores/buscar?nombre=${encodeURIComponent(nombre)}`;
        if (area) {
            url += `&area=${encodeURIComponent(area)}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al buscar tutores');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Realiza la inscripción de un competidor con sus tutores
 * @param {Object} datosInscripcion - Datos de la inscripción
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const registrarInscripcion = async (datosInscripcion) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/inscripciones/registrar`, 
            datosInscripcion,
            { headers: { Authorization: token } }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al registrar la inscripción');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Obtiene las áreas, categorías y grados disponibles para inscripción
 * @param {number} convocatoriaId - ID de la convocatoria
 * @returns {Promise} - Promesa con la información académica
 */
export const obtenerInfoAcademica = async (convocatoriaId) => {
    try {
        const response = await axios.get(`${API_URL}/inscripciones/info-academica?convocatoriaId=${convocatoriaId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al obtener información académica');
        }
        throw new Error('Error de conexión con el servidor');
    }
};

/**
 * Verifica si el periodo de inscripción está activo
 * @param {number} convocatoriaId - ID de la convocatoria
 * @returns {Promise} - Promesa con el estado del periodo de inscripción
 */
export const verificarPeriodoInscripcion = async (convocatoriaId) => {
    try {
        const response = await axios.get(`${API_URL}/inscripciones/periodo-activo?convocatoriaId=${convocatoriaId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al verificar periodo de inscripción');
        }
        throw new Error('Error de conexión con el servidor');
    }
}; 