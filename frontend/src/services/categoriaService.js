import axios from '../api/axiosInstance';

// Servicio para gestionar categorías
const categoriaService = {
  // Obtener todas las categorías
  obtenerCategorias: async () => {
    try {
      const response = await axios.get('/ver-categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  // Crear una nueva categoría
  crearCategoria: async (categoriaData) => {
    try {
      const response = await axios.post('/crear-categorias', categoriaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }
};

export default categoriaService; 