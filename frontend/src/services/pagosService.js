// src/services/pagosService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7777/api/pagos';

// Función para obtener el token de autenticación
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No se encontró el token de autenticación');
    }
    return token;
};

// Configuración de headers común
const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
});

/**
 * Obtiene todos los pagos pendientes
 * @returns {Promise<Array>} Array de pagos pendientes
 */
export const obtenerPagosPendientes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pendientes`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener pagos pendientes');
    }
};

/**
 * Obtiene todos los pagos realizados
 * @returns {Promise<Array>} Array de pagos realizados
 */
export const obtenerPagosRealizados = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/realizados`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener pagos realizados');
    }
};

/**
 * Obtiene todos los pagos (pendientes y realizados)
 * @returns {Promise<Array>} Array de todos los pagos
 */
export const obtenerTodosLosPagos = async () => {
    try {
        const [pagosPendientes, pagosRealizados] = await Promise.all([
            obtenerPagosPendientes(),
            obtenerPagosRealizados()
        ]);
        return [...pagosPendientes, ...pagosRealizados];
    } catch (error) {
        throw new Error(error.message || 'Error al obtener todos los pagos');
    }
};

/**
 * Valida un pago específico
 * @param {number|string} pagoId - ID del pago a validar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const validarPago = async (pagoId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/validar-pago/${pagoId}`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al validar el pago');
    }
};

/**
 * Obtiene un pago específico por su ID
 * @param {number|string} pagoId - ID del pago
 * @returns {Promise<Object>} Datos del pago
 */
export const obtenerPagoPorId = async (pagoId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${pagoId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el pago');
    }
};

/**
 * Crea un nuevo pago
 * @param {Object} datosPago - Datos del pago a crear
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const crearPago = async (datosPago) => {
    try {
        const response = await axios.post(`${API_BASE_URL}`, datosPago, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al crear el pago');
    }
};

/**
 * Actualiza un pago existente
 * @param {number|string} pagoId - ID del pago a actualizar
 * @param {Object} datosActualizacion - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const actualizarPago = async (pagoId, datosActualizacion) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${pagoId}`, datosActualizacion, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el pago');
    }
};

/**
 * Elimina un pago
 * @param {number|string} pagoId - ID del pago a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const eliminarPago = async (pagoId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${pagoId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar el pago');
    }
};