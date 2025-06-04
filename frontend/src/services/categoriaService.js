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
    const gradosPrimaria = (categoriaComponente.gradosPrimaria || []).map(Number);
    const gradosSecundaria = (categoriaComponente.gradosSecundaria || []).map(Number);
    const todosGrados = [...gradosPrimaria, ...gradosSecundaria];
    const gradoMinId = todosGrados.length > 0 ? Math.min(...todosGrados) : null;
    const gradoMaxId = todosGrados.length > 0 ? Math.max(...todosGrados) : null;
    const areaId = categoriaComponente.areaId || categoriaComponente.area;

    return {
        nombre_categoria: categoriaComponente.nombre || '',
        descripcion_cat: categoriaComponente.descripcion || '',
        grado_min_id: gradoMinId,
        grado_max_id: gradoMaxId,
        area_id: areaId ? Number(areaId) : null
    };
};

/**
 * Convierte el formato del API al formato usado por el componente
 * @param {Object} categoriaAPI - Formato devuelto por el API
 * @param {Array} gradosDisponibles - Lista de todos los grados disponibles
 * @returns {Object} - Formato usado por el componente React
 */
export const adaptarCategoriaDesdeAPI = (categoriaAPI, gradosDisponibles) => {
    const gradosPrimaria = [];
    const gradosSecundaria = [];

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
        if (!categoria.nombre || !categoria.descripcion) {
            console.error("❌ Complete todos los campos requeridos");
            return;
        }
        if (!categoria.areaId || isNaN(Number(categoria.areaId))) {
            console.error("❌ Seleccione un área válida");
            return;
        }
        const gradosTodos = [...(categoria.gradosPrimaria || []), ...(categoria.gradosSecundaria || [])];
        if (!gradosTodos.length) {
            console.error("❌ Debe seleccionar al menos un grado");
            return;
        }

        const categoriaFormateada = adaptarCategoriaParaAPI(categoria);
        console.log('Payload a enviar:', categoriaFormateada);
        const response = await axios.post(`${API_URL}crear-categoria`, categoriaFormateada);
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
 * Elimina una categoría y sus relaciones en la tabla Categorias_area.
 * Se espera que el backend maneje la eliminación en ambas tablas.
 * @param {number} categoriaId - ID de la categoría a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const eliminarCategoriaYRelaciones = async (categoriaId) => {
    const response = await fetch(`${API_URL}eliminar-categoria-completa/${categoriaId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || 'Error al eliminar la categoría y sus relaciones.';
        throw new Error(errorMessage);
    }
    return await response.json();
};



export const eliminarCategoria = async (categoriaId) => {
    const response = await fetch(`${API_URL}eliminar-categoria/${categoriaId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar la categoría (solo tabla categorías)');
    return await response.json();
};

export default {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    eliminarCategoriaYRelaciones,
    adaptarCategoriaDesdeAPI
};