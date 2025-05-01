/**
 * Valida los campos del formulario de categoría
 * @param {Object} datos - Los datos a validar
 * @param {string} datos.nombre - Nombre de la categoría
 * @param {string} datos.descripcion - Descripción de la categoría
 * @param {string} datos.areaSeleccionadaInterna - Área seleccionada
 * @param {Array} datos.gradosPrimaria - Grados de primaria seleccionados
 * @param {Array} datos.gradosSecundaria - Grados de secundaria seleccionados
 * @returns {Object} - Resultado de la validación {esValido, errores}
 */
export const validarCampos = ({
    nombre,
    descripcion,
    areaSeleccionadaInterna,
    gradosPrimaria,
    gradosSecundaria
}) => {
    const errores = {};

    if (!nombre.trim()) {
        errores.nombre = 'El nombre es obligatorio.';
    } else if (nombre.length > 30) {
        errores.nombre = 'Máximo 30 caracteres.';
    }

    if (!descripcion.trim()) {
        errores.descripcion = 'La descripción es obligatoria.';
    } else if (descripcion.length > 100) {
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