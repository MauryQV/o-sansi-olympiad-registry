import axios from "axios";

const API_URL = "http://localhost:7777/api/";

const obtenerCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}ver-categorias`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error;
    }
}

const crearCategoria = async (categoria) => {
    try {
        const response = await axios.post(`${API_URL}crear-categorias`, categoria);
        return response.data;
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        throw error;
    }
}

const actualizarCategoria = async (id, categoria) => {
    try {
        const response = await axios.patch(`${API_URL}actualizar-categorias/${id}`, categoria);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        throw error;
    }
}

const eliminarCategoria = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}eliminar-categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        throw error;
    }
}