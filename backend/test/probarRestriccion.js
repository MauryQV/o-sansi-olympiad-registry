import { 
  MAX_AREAS_POR_PARTICIPANTE,
  puedeInscribirseEnAreaAdicional,
  verificarInscripcionArea,
  obtenerAreasDisponibles
} from '../scripts/areaRestriction.js';

/**
 * Script para probar el funcionamiento del validador de restricción de áreas
 */

// Datos simulados para las pruebas
const competidor = { id: 'comp-1', nombre: 'Competidor 1' };
const convocatoria = { id: 1, nombre: 'Olimpiada 2025' };
const areas = [
  { id: 1, nombre: 'Matemática' },
  { id: 2, nombre: 'Física' },
  { id: 3, nombre: 'Química' },
  { id: 4, nombre: 'Informática' }
];

// Simulación de inscripciones
const inscripciones = [
  { id: 1, competidorId: 'comp-1', areaId: 1, convocatoriaId: 1 }
];

// Función para ejecutar todas las pruebas
function ejecutarPruebas() {
  console.log('🚀 Pruebas de validación de restricción de áreas');
  console.log(`Límite máximo de áreas por participante: ${MAX_AREAS_POR_PARTICIPANTE}`);
  console.log('-------------------------------------------------------------------\n');
  
  // Prueba 1: Verificar si puede inscribirse con 0 áreas
  console.log('PRUEBA 1: Verificar si puede inscribirse con 0 áreas');
  const resultado1 = puedeInscribirseEnAreaAdicional(0);
  console.log(`Resultado: ${resultado1 ? '✅ Permitido' : '❌ No permitido'}`);
  console.log('Esperado: ✅ Permitido\n');
  
  // Prueba 2: Verificar si puede inscribirse con 1 área
  console.log('PRUEBA 2: Verificar si puede inscribirse con 1 área');
  const resultado2 = puedeInscribirseEnAreaAdicional(1);
  console.log(`Resultado: ${resultado2 ? '✅ Permitido' : '❌ No permitido'}`);
  console.log('Esperado: ✅ Permitido\n');
  
  // Prueba 3: Verificar si puede inscribirse cuando ya tiene 2 áreas
  console.log('PRUEBA 3: Verificar si puede inscribirse cuando ya tiene 2 áreas');
  const resultado3 = puedeInscribirseEnAreaAdicional(2);
  console.log(`Resultado: ${resultado3 ? '✅ Permitido' : '❌ No permitido'}`);
  console.log('Esperado: ❌ No permitido - Ya tiene 2 áreas asignadas\n');
  
  // Prueba 4: Verificar inscripción en área ya inscrita
  console.log('PRUEBA 4: Verificar inscripción en área ya inscrita');
  const verificacion1 = verificarInscripcionArea(
    competidor.id, 
    areas[0].id, 
    convocatoria.id, 
    inscripciones
  );
  console.log(`Resultado: ${verificacion1.permitido ? '✅ Permitido' : '❌ No permitido'}`);
  console.log(`Mensaje: ${verificacion1.mensaje}`);
  console.log('Esperado: ❌ No permitido - Ya inscrito\n');
  
  // Prueba 5: Verificar inscripción en nueva área con espacio disponible
  console.log('PRUEBA 5: Verificar inscripción en nueva área con espacio disponible');
  const verificacion2 = verificarInscripcionArea(
    competidor.id, 
    areas[1].id, 
    convocatoria.id, 
    inscripciones
  );
  console.log(`Resultado: ${verificacion2.permitido ? '✅ Permitido' : '❌ No permitido'}`);
  console.log(`Mensaje: ${verificacion2.mensaje}`);
  console.log('Esperado: ✅ Permitido\n');
  
  // Añadir una inscripción más para llegar al límite
  inscripciones.push({ id: 2, competidorId: 'comp-1', areaId: 2, convocatoriaId: 1 });
  
  // Prueba 6: Verificar inscripción con el límite alcanzado
  console.log('PRUEBA 6: Verificar inscripción con el límite alcanzado');
  const verificacion3 = verificarInscripcionArea(
    competidor.id, 
    areas[2].id, 
    convocatoria.id, 
    inscripciones
  );
  console.log(`Resultado: ${verificacion3.permitido ? '✅ Permitido' : '❌ No permitido'}`);
  console.log(`Mensaje: ${verificacion3.mensaje}`);
  console.log(`Esperado: ❌ No permitido - Límite de ${MAX_AREAS_POR_PARTICIPANTE} áreas alcanzado\n`);
  
  // Prueba 7: Obtener áreas disponibles cuando no se ha alcanzado el límite
  console.log('PRUEBA 7: Obtener áreas disponibles cuando no se ha alcanzado el límite');
  // Simular solo una inscripción
  const unaInscripcion = inscripciones.slice(0, 1);
  const areasInscritas = unaInscripcion.map(insc => ({ areaId: insc.areaId }));
  const disponibles1 = obtenerAreasDisponibles(areas, areasInscritas);
  console.log(`Resultado: ${disponibles1.length} áreas disponibles`);
  console.log('Esperado: 4 áreas disponibles\n');
  
  // Prueba 8: Obtener áreas disponibles cuando se ha alcanzado el límite
  console.log('PRUEBA 8: Obtener áreas disponibles cuando se ha alcanzado el límite');
  const dosInscripciones = inscripciones.slice(0, 2);
  const areasInscritas2 = dosInscripciones.map(insc => ({ areaId: insc.areaId }));
  const disponibles2 = obtenerAreasDisponibles(areas, areasInscritas2);
  console.log(`Resultado: ${disponibles2.length} áreas disponibles`);
  console.log('Esperado: 2 áreas disponibles (solo las que ya están inscritas)\n');
  
  // Resumen
  console.log('📋 RESUMEN DE PRUEBAS');
  const pruebasExitosas = [
    resultado1 === true,
    resultado2 === true,
    resultado3 === false,
    verificacion1.permitido === false,
    verificacion2.permitido === true,
    verificacion3.permitido === false,
    disponibles1.length === 4,
    disponibles2.length === 2
  ];
  
  const totalPruebas = pruebasExitosas.length;
  const pruebasPasadas = pruebasExitosas.filter(result => result).length;
  
  console.log(`Total de pruebas: ${totalPruebas}`);
  console.log(`Pruebas exitosas: ${pruebasPasadas}`);
  
  if (pruebasPasadas === totalPruebas) {
    console.log('\n✅ TODAS LAS PRUEBAS PASARON CON ÉXITO');
    console.log('La restricción de máximo 2 áreas por participante funciona correctamente');
  } else {
    console.log('\n❌ ALGUNAS PRUEBAS FALLARON');
    console.log(`${totalPruebas - pruebasPasadas} de ${totalPruebas} pruebas fallaron`);
  }
}

// Ejecutar las pruebas
ejecutarPruebas(); 