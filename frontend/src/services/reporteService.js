import axios from 'axios';

const API_URL = 'http://localhost:7777/api';

/**
 * Obtiene el listado de postulantes con sus datos y estados de inscripción
 * @param {Object} filtros - Filtros para el reporte (estado, area)
 * @returns {Promise} - Promise con los datos del reporte
 */
export const obtenerReportePostulantes = async (filtros = {}) => {
  try {
    const { data } = await axios.get(`${API_URL}/reportes/postulantes`, { 
      params: filtros,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error al obtener reporte de postulantes:', error);
    throw error;
  }
};

export default {
  obtenerReportePostulantes
}; 