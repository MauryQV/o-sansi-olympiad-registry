/**
 * Valida los campos del formulario de categoría
 * @param {Object} datos - Los datos a validar
 * @param {string} datos.nombre - Nombre de la categoría que se intenta guardar/actualizar
 * @param {string} datos.descripcion - Descripción de la categoría
 * @param {string} datos.areaSeleccionadaInterna - ID del Área seleccionada en el formulario
 * @param {Array} datos.gradosPrimaria - Grados de primaria seleccionados
 * @param {Array} datos.gradosSecundaria - Grados de secundaria seleccionados
 * @param {Array} [datos.categoriasExistentes=[]] - Lista de TODAS las categorías (de la tabla Categorias)
 * @param {Array} [datos.relacionesCategoriasAreas=[]] - Lista de TODAS las relaciones (de la tabla Categorias_area)
 * @param {Object} [datos.categoriaAEditar=null] - La categoría que se está editando (con su .id y .nombre_categoria originales)
 * @returns {Object} - Resultado de la validación {esValido, errores}
 */
export const validarCampos = ({
    nombre,
    descripcion,
    areaSeleccionadaInterna, // Este es el ID del área seleccionada en el FORMULARIO
    gradosPrimaria,
    gradosSecundaria,
    categoriasExistentes = [],
    relacionesCategoriasAreas = [], 
    categoriaAEditar = null
}) => {
    const errores = {};
    const nombreTrimmed = nombre.trim();
    const idAreaForm = parseInt(areaSeleccionadaInterna, 10); // ID del área del formulario

    if (!nombreTrimmed) {
        errores.nombre = 'El nombre es obligatorio.';
    } else if (nombreTrimmed.length > 30) {
        errores.nombre = 'Máximo 30 caracteres.';
    } else if (idAreaForm && categoriasExistentes.length > 0 && relacionesCategoriasAreas.length > 0) {
        const nombreNormalizadoForm = nombreTrimmed.toLowerCase(); 
        const idsCategoriasEnAreaSeleccionada = relacionesCategoriasAreas
            .filter(rel => rel.area_id === idAreaForm)
            .map(rel => rel.categoria_id);

        const esDuplicado = idsCategoriasEnAreaSeleccionada.some(idCategoriaEnArea => {
            const categoriaOriginal = categoriasExistentes.find(cat => cat.id === idCategoriaEnArea);
            
            if (categoriaOriginal) {
                const nombreCategoriaExistenteNormalizado = categoriaOriginal.nombre_categoria.trim().toLowerCase();
                
                if (categoriaAEditar && categoriaAEditar.id === categoriaOriginal.id) {
                    return false; 
                }
                
                return nombreCategoriaExistenteNormalizado === nombreNormalizadoForm;
            }
            return false;
        });

        if (esDuplicado) {
            errores.nombre = "Ya existe una categoría con ese nombre en el área seleccionada.";
        }
    }

    if (!descripcion.trim()) {
        errores.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.trim().length > 100) {
        errores.descripcion = 'Máximo 100 caracteres.';
    }

    if (!areaSeleccionadaInterna) { 
        errores.area = 'Debe seleccionar un área.';
    }

    if (gradosPrimaria.length === 0 && gradosSecundaria.length === 0) {
        errores.grados = 'Debe seleccionar al menos un grado.';
    }

    return {
        esValido: Object.keys(errores).length === 0,
        errores
    };
};

export const eliminarCategoria = async (categoriaId) => {
    const response = await fetch(`${API_URL}eliminar-categoria/${categoriaId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar la categoría');
    return await response.json();
};