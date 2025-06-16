import axios from 'axios';

const API_URL = 'http://localhost:7777/api';

/**
 * Obtiene el listado de postulantes con sus datos y estados de inscripción
 * @param {Object} filtros - Filtros para el reporte (estado, area)
 * @returns {Promise} - Promise con los datos del reporte
 */
export const obtenerReportePostulantes = async (filtros = {}) => {
  try {
    //console.log("=== SERVICIO REPORTES ===");
    //console.log("Filtros recibidos en servicio:", filtros);
    //console.log("Filtros stringify:", JSON.stringify(filtros));

    // Limpiar filtros vacíos
    const filtrosLimpios = {};
    Object.keys(filtros).forEach(key => {
      if (filtros[key] && filtros[key].trim() !== '') {
        filtrosLimpios[key] = filtros[key];
      }
    });

    //console.log("Filtros limpios a enviar:", filtrosLimpios);

    const { data } = await axios.get(`${API_URL}/reportes/postulantes`, {
      params: filtrosLimpios,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (error) {
    // console.error('Error al obtener reporte de postulantes:', error);
    throw error;
  }
};

export default {
  obtenerReportePostulantes
}; 