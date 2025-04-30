import axios from "axios";

const API_URL = "http://localhost:7777/api/";

/**
 * Obtiene todas las categorías
 * @returns {Promise<Array>} - Lista de categorías
 */
export const obtenerCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}ver-categorias`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error;
    }
};

/**
 * Convierte el formato del componente al formato esperado por el API
 * @param {Object} categoriaComponente - Formato usado en el componente React
 * @returns {Object} - Formato esperado por el API
 */
const adaptarCategoriaParaAPI = (categoriaComponente) => {
    // Determinar el grado mínimo y máximo de los seleccionados
    const todosGrados = [...categoriaComponente.gradosPrimaria, ...categoriaComponente.gradosSecundaria];
    const gradoMinId = todosGrados.length > 0 ? Math.min(...todosGrados) : null;
    const gradoMaxId = todosGrados.length > 0 ? Math.max(...todosGrados) : null;

    // Buscar el area_id basado en el nombre del área
    // Esto asume que tienes una forma de mapear el nombre del área al ID
    // Si no tienes esta información, necesitarás obtenerla antes o ajustar este enfoque

    return {
        nombre_categoria: categoriaComponente.nombre,
        descripcion_cat: categoriaComponente.descripcion,
        grado_min_id: gradoMinId,
        grado_max_id: gradoMaxId,
        area_id: parseInt(categoriaComponente.areaId) // Asumiendo que ahora el componente envía el ID del área
    };
};

/**
 * Convierte el formato del API al formato usado por el componente
 * @param {Object} categoriaAPI - Formato devuelto por el API
 * @param {Array} gradosDisponibles - Lista de todos los grados disponibles
 * @returns {Object} - Formato usado por el componente React
 */
export const adaptarCategoriaDesdeAPI = (categoriaAPI, gradosDisponibles) => {
    // Crear arrays para grados de primaria y secundaria
    const gradosPrimaria = [];
    const gradosSecundaria = [];

    // Si hay grados disponibles, filtrar los que están entre min y max
    if (gradosDisponibles && gradosDisponibles.length > 0) {
        gradosDisponibles.forEach(grado => {
            if (grado.id >= categoriaAPI.grado_min_id && grado.id <= categoriaAPI.grado_max_id) {
                if (grado.nivel.nombre_nivel === 'Primaria') {
                    gradosPrimaria.push(grado.id);
                } else if (grado.nivel.nombre_nivel === 'Secundaria') {
                    gradosSecundaria.push(grado.id);
                }
            }
        });
    }

    return {
        id: categoriaAPI.id,
        nombre: categoriaAPI.nombre_categoria,
        descripcion: categoriaAPI.descripcion_cat,
        area: categoriaAPI.area?.nombre || '',
        areaId: categoriaAPI.area_id.toString(),
        gradosPrimaria,
        gradosSecundaria
    };
};

/**
 * Crea una nueva categoría
 * @param {Object} categoria - Datos de la categoría a crear
 * @returns {Promise<Object>} - Categoría creada
 */
export const crearCategoria = async (categoria) => {
    try {
        const categoriaFormateada = adaptarCategoriaParaAPI(categoria);
        const response = await axios.post(`${API_URL}crear-categorias`, categoriaFormateada);
        return response.data;
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        throw error;
    }
};

/**
 * Actualiza una categoría existente
 * @param {number} id - ID de la categoría a actualizar
 * @param {Object} categoria - Nuevos datos de la categoría
 * @returns {Promise<Object>} - Categoría actualizada
 */
export const actualizarCategoria = async (id, categoria) => {
    try {
        const categoriaFormateada = adaptarCategoriaParaAPI(categoria);
        const response = await axios.patch(
            `${API_URL}actualizar-categorias/${id}`,
            categoriaFormateada
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        throw error;
    }
};

/**
 * Elimina una categoría
 * @param {number} id - ID de la categoría a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const eliminarCategoria = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}eliminar-categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        throw error;
    }
};

export default {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    adaptarCategoriaDesdeAPI
};