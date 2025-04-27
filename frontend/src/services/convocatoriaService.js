import axios from '../api/axiosInstance';

// Servicio para gestionar convocatorias
const convocatoriaService = {
  // Obtener todas las convocatorias
  obtenerConvocatorias: async () => {
    try {
      const response = await axios.get('/convocatorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener convocatorias:', error);
      throw error;
    }
  },

  // Obtener una convocatoria por su ID
  obtenerConvocatoriaPorId: async (id) => {
    try {
      const response = await axios.get(`/convocatoria/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener convocatoria con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener convocatorias por estado
  obtenerConvocatoriasPorEstado: async (estado) => {
    try {
      const response = await axios.get(`/convocatoria/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener convocatorias con estado ${estado}:`, error);
      throw error;
    }
  },

  // Crear una nueva convocatoria
  crearConvocatoria: async (convocatoriaData) => {
    try {
      const response = await axios.post('/crear-convocatoria', convocatoriaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear convocatoria:', error);
      throw error;
    }
  },

  // Actualizar una convocatoria existente
  actualizarConvocatoria: async (id, convocatoriaData) => {
    try {
      const response = await axios.patch(`/actualizar-convocatoria/${id}`, convocatoriaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar convocatoria con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener convocatoria con sus áreas
  obtenerConvocatoriaConAreas: async (id) => {
    try {
      const response = await axios.get(`/convocatoria/areas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener convocatoria con áreas, ID ${id}:`, error);
      throw error;
    }
  },

  // Asignar categoría a convocatoria
  asignarCategoria: async (convocatoriaId, categoriaId) => {
    try {
      const response = await axios.post('/asignar-categoria', {
        convocatoriaId,
        categoriaId
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar categoría a convocatoria:', error);
      throw error;
    }
  }
};

export default convocatoriaService; 