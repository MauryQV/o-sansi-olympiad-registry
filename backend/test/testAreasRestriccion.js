/**
 * Prueba de concepto para la restricción de máximo 2 áreas por participante
 * Este es un ejemplo de implementación que se puede aplicar en la base de datos
 */

// Datos simulados
const competidores = [
  { id: 'comp-1', nombre: 'Competidor 1' },
  { id: 'comp-2', nombre: 'Competidor 2' },
  { id: 'comp-3', nombre: 'Competidor 3' }
];

const areas = [
  { id: 1, nombre: 'Matemática' },
  { id: 2, nombre: 'Física' },
  { id: 3, nombre: 'Química' },
  { id: 4, nombre: 'Informática' }
];

const convocatorias = [
  { id: 1, nombre: 'Olimpiada 2025' }
];

// Sistema de almacenamiento simulado
const inscripciones = [];

// Función para inscribir a un competidor en un área
function inscribirEnArea(competidorId, areaId, convocatoriaId) {
  console.log(`📝 Intentando inscribir al competidor ${competidorId} en el área ${areaId}`);
  
  // Verificar si ya está inscrito en esta área
  const yaInscrito = inscripciones.some(
    insc => insc.competidorId === competidorId && 
            insc.areaId === areaId && 
            insc.convocatoriaId === convocatoriaId
  );
  
  if (yaInscrito) {
    console.log('⚠️ El competidor ya está inscrito en esta área');
    return false;
  }
  
  // Verificar cuántas áreas tiene asignadas el competidor en esta convocatoria
  const areasAsignadas = inscripciones.filter(
    insc => insc.competidorId === competidorId && 
            insc.convocatoriaId === convocatoriaId
  ).length;
  
  console.log(`ℹ️ El competidor está inscrito en ${areasAsignadas} áreas`);
  
  // Aplicar la restricción de máximo 2 áreas por participante
  if (areasAsignadas >= 2) {
    console.error('❌ ERROR: No se puede inscribir en más de 2 áreas por convocatoria');
    return false;
  }
  
  // Buscar nombres para el log
  const competidor = competidores.find(c => c.id === competidorId);
  const area = areas.find(a => a.id === areaId);
  
  // Registrar la inscripción
  inscripciones.push({
    id: Date.now(),
    competidorId,
    areaId,
    convocatoriaId,
    fecha: new Date()
  });
  
  console.log(`✅ ${competidor.nombre} inscrito con éxito en el área ${area.nombre}`);
  return true;
}

// Función para obtener las áreas de un competidor
function obtenerAreasCompetidor(competidorId, convocatoriaId) {
  const areasDelCompetidor = inscripciones
    .filter(insc => insc.competidorId === competidorId && insc.convocatoriaId === convocatoriaId)
    .map(insc => {
      const area = areas.find(a => a.id === insc.areaId);
      return area;
    });
  
  return areasDelCompetidor;
}

// Función principal para ejecutar las pruebas
function ejecutarPruebas() {
  console.log('🚀 PRUEBA DE CONCEPTO: Restricción de máximo 2 áreas por participante');
  console.log('====================================================================\n');
  
  const competidor = competidores[0];
  const convocatoria = convocatorias[0];
  
  console.log(`Competidor: ${competidor.nombre} (${competidor.id})`);
  console.log(`Convocatoria: ${convocatoria.nombre} (${convocatoria.id})`);
  console.log('-------------------------------------------------------------------\n');
  
  console.log('📝 PRUEBA 1: Inscribir en primera área (debe funcionar)');
  inscribirEnArea(competidor.id, areas[0].id, convocatoria.id);
  
  console.log('\n📝 PRUEBA 2: Inscribir en segunda área (debe funcionar)');
  inscribirEnArea(competidor.id, areas[1].id, convocatoria.id);
  
  console.log('\n📝 PRUEBA 3: Intentar inscribir en tercera área (debe fallar)');
  const resultado = inscribirEnArea(competidor.id, areas[2].id, convocatoria.id);
  
  console.log('\n📝 PRUEBA 4: Intentar inscribir otra vez en primera área (debe indicar que ya está inscrito)');
  inscribirEnArea(competidor.id, areas[0].id, convocatoria.id);
  
  // Mostrar el resumen de inscripciones
  const areasInscritas = obtenerAreasCompetidor(competidor.id, convocatoria.id);
  
  console.log('\n📋 Resumen de inscripciones:');
  console.log(`- Competidor: ${competidor.nombre}`);
  console.log(`- Convocatoria: ${convocatoria.nombre}`);
  console.log(`- Total áreas inscritas: ${areasInscritas.length}`);
  
  areasInscritas.forEach((area, index) => {
    console.log(`  ${index + 1}. ${area.nombre}`);
  });
  
  if (!resultado) {
    console.log('\n✅ LA PRUEBA FUE EXITOSA: La restricción de máximo 2 áreas funciona correctamente');
  } else {
    console.error('\n❌ ERROR: La restricción de máximo 2 áreas no funcionó');
  }
}

// Ejecutar las pruebas
ejecutarPruebas(); 