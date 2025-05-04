import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';

// Configurar axios con la URL y timeout por defecto
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT
});

/**
 * Obtiene todos los tutores disponibles para inscripción
 * @returns {Promise} - Promesa con la lista de tutores
 */
export const obtenerTutoresDisponibles = async () => {
    try {
        console.log("Obteniendo tutores disponibles desde:", `${API_URL}/tutores/disponibles`);
        const response = await api.get('/tutores/disponibles');
        console.log("Respuesta tutores:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo tutores:", error);
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
        if (nombre.length < 3) {
            return [];
        }
        
        console.log(`Buscando tutores con nombre "${nombre}" y área "${area || 'cualquiera'}"`);
        
        let url = `/tutores/buscar?nombre=${encodeURIComponent(nombre)}`;
        if (area && area !== '') {
            url += `&area=${encodeURIComponent(area)}`;
        }
        
        console.log("URL de búsqueda:", `${API_URL}${url}`);
        
        const response = await api.get(url);
        console.log("Tutores encontrados:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error en buscarTutores:", error);
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al buscar tutores');
        }
        throw new Error('Error de conexión con el servidor');
    }
};


/**
 Realiza la inscripción de un competidor con sus tutores
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
        console.log("Obteniendo info académica desde:", `${API_URL}/inscripciones/info-academica?convocatoriaId=${convocatoriaId}`);
        const response = await api.get(`/inscripciones/info-academica?convocatoriaId=${convocatoriaId}`);
        console.log("Respuesta info académica:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo info académica:", error);
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
        const response = await api.get(`/inscripciones/periodo-activo?convocatoriaId=${convocatoriaId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Error al verificar periodo de inscripción');
        }
        throw new Error('Error de conexión con el servidor');
    }
}; 