import axios from '../api/axiosInstance';

// Servicio para gestionar áreas
const areaService = {
  // Obtener todas las áreas
  obtenerAreas: async () => {
    try {
      const response = await axios.get('/ver-areas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      throw error;
    }
  },

  // Obtener un área por su ID
  obtenerAreaPorId: async (id) => {
    try {
      const response = await axios.get(`/ver-area/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener área con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva área
  crearArea: async (areaData) => {
    try {
      const response = await axios.post('/crear-area', {
        nombre_area: areaData.nombre,
        descripcion_area: areaData.descripcion,
        costo: areaData.costo
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear área:', error);
      throw error;
    }
  },

  // Actualizar un área existente
  actualizarArea: async (id, areaData) => {
    try {
      const response = await axios.patch(`/actualizar-area/${id}`, areaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar área con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un área
  eliminarArea: async (id) => {
    try {
      const response = await axios.delete(`/eliminar-area/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar área con ID ${id}:`, error);
      throw error;
    }
  }
};

export default areaService;
