/**
 * Script para verificar la restricción de máximo 2 áreas por participante
 * Este script puede ser utilizado tanto en el frontend como en el backend
 * para garantizar la coherencia de la restricción.
 */

// Constante que define el máximo número de áreas por participante
const MAX_AREAS_POR_PARTICIPANTE = 2;

/**
 * Verifica si un participante puede inscribirse en un área adicional
 * @param {number} areasAsignadas - Número de áreas ya asignadas al participante
 * @returns {boolean} - true si puede inscribirse, false si ya alcanzó el límite
 */
function puedeInscribirseEnAreaAdicional(areasAsignadas) {
  return areasAsignadas < MAX_AREAS_POR_PARTICIPANTE;
}

/**
 * Verifica si un participante puede inscribirse en un área específica
 * @param {string} competidorId - ID del competidor
 * @param {number} areaId - ID del área
 * @param {number} convocatoriaId - ID de la convocatoria
 * @param {Array} inscripcionesExistentes - Array de inscripciones existentes
 * @returns {Object} - { permitido: boolean, mensaje: string }
 */
function verificarInscripcionArea(competidorId, areaId, convocatoriaId, inscripcionesExistentes) {
  // Verificar si ya está inscrito en esta área
  const yaInscrito = inscripcionesExistentes.some(
    insc => insc.competidorId === competidorId && 
            insc.areaId === areaId && 
            insc.convocatoriaId === convocatoriaId
  );
  
  if (yaInscrito) {
    return {
      permitido: false,
      mensaje: 'El participante ya está inscrito en esta área para esta convocatoria'
    };
  }
  
  // Contar áreas asignadas
  const areasAsignadas = inscripcionesExistentes.filter(
    insc => insc.competidorId === competidorId && insc.convocatoriaId === convocatoriaId
  ).length;
  
  // Verificar restricción de máximo 2 áreas
  if (areasAsignadas >= MAX_AREAS_POR_PARTICIPANTE) {
    return {
      permitido: false,
      mensaje: `No se puede inscribir en más de ${MAX_AREAS_POR_PARTICIPANTE} áreas por participante`
    };
  }
  
  return {
    permitido: true,
    mensaje: 'Inscripción permitida'
  };
}

/**
 * Obtener áreas disponibles para inscripción según la restricción
 * @param {Array} todasLasAreas - Lista de todas las áreas disponibles
 * @param {Array} areasInscritas - Lista de áreas en las que ya está inscrito
 * @returns {Array} - Lista de áreas disponibles para inscripción
 */
function obtenerAreasDisponibles(todasLasAreas, areasInscritas) {
  // Si ya alcanzó el límite, solo mostrar las áreas en las que ya está inscrito
  if (areasInscritas.length >= MAX_AREAS_POR_PARTICIPANTE) {
    return todasLasAreas.filter(area => 
      areasInscritas.some(inscrita => inscrita.areaId === area.id)
    );
  }
  
  // Si no ha alcanzado el límite, mostrar todas las áreas
  return todasLasAreas;
}

// Exportar funciones para uso en otros módulos
export {
  MAX_AREAS_POR_PARTICIPANTE,
  puedeInscribirseEnAreaAdicional,
  verificarInscripcionArea,
  obtenerAreasDisponibles
}; 