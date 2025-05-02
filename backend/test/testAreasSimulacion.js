import prisma from '../src/config/prismaClient.js';

/**
 * Script para simular y probar la restricción de máximo 2 áreas por participante
 * Este script no modifica el esquema de la base de datos, sino que simula el comportamiento
 * que tendría la restricción de máximo 2 áreas por participante
 */

// Función para simular la inscripción de un participante en un área
async function simularInscripcion(competidorId, areas, convocatoriaId) {
  console.log('Iniciando simulación de inscripción con restricción de máximo 2 áreas por participante');
  console.log('-------------------------------------------------------------------');
  
  // Validar que el competidor exista
  const competidor = await prisma.competidor.findUnique({
    where: { id: competidorId }
  });
  
  if (!competidor) {
    console.error('❌ ERROR: No se encontró el competidor con ID:', competidorId);
    return;
  }
  
  console.log('✅ Competidor encontrado:', competidor.id);
  
  // Validar que la convocatoria exista
  const convocatoria = await prisma.convocatoria.findUnique({
    where: { id: convocatoriaId }
  });
  
  if (!convocatoria) {
    console.error('❌ ERROR: No se encontró la convocatoria con ID:', convocatoriaId);
    return;
  }
  
  console.log('✅ Convocatoria encontrada:', convocatoria.nombre_convocatoria);
  
  // Verificar que las áreas existan y estén asignadas a la convocatoria
  const areasValidas = [];
  for (const areaId of areas) {
    const area = await prisma.area.findUnique({
      where: { id: areaId }
    });
    
    if (!area) {
      console.error('❌ ERROR: No se encontró el área con ID:', areaId);
      continue;
    }
    
    const asignacion = await prisma.area_convocatoria.findFirst({
      where: {
        area_id: areaId,
        convocatoria_id: convocatoriaId
      }
    });
    
    if (!asignacion) {
      console.error('❌ ERROR: El área', area.nombre_area, 'no está asignada a la convocatoria');
      continue;
    }
    
    areasValidas.push({ id: areaId, nombre: area.nombre_area });
  }
  
  if (areasValidas.length === 0) {
    console.error('❌ ERROR: No hay áreas válidas para inscribir al participante');
    return;
  }
  
  console.log('✅ Áreas válidas para inscripción:', areasValidas.length);
  
  // SIMULACIÓN DE LA RESTRICCIÓN DE MÁXIMO 2 ÁREAS
  console.log('\n🧪 PRUEBA: Simular inscripción con restricción de máximo 2 áreas\n');
  
  // Estructura para simular inscripciones del competidor en áreas
  const inscripcionesSimuladas = [];
  
  for (let i = 0; i < areasValidas.length; i++) {
    const area = areasValidas[i];
    
    console.log(`📝 Intentando inscribir al competidor en área: ${area.nombre} (${area.id})`);
    
    // Verificar si ya está inscrito en esta área (simulación)
    const yaInscrito = inscripcionesSimuladas.some(insc => insc.areaId === area.id);
    if (yaInscrito) {
      console.log('⚠️ El competidor ya está inscrito en esta área');
      continue;
    }
    
    // Verificar si ya llegó al límite de 2 áreas
    if (inscripcionesSimuladas.length >= 2) {
      console.error('❌ ERROR: El competidor ya está inscrito en 2 áreas (máximo permitido)');
      console.error('   No se puede inscribir en', area.nombre);
      continue;
    }
    
    // Simular inscripción exitosa
    inscripcionesSimuladas.push({
      id: Date.now() + i,
      competidorId: competidorId,
      areaId: area.id,
      areaNombre: area.nombre,
      fecha: new Date()
    });
    
    console.log('✅ Inscripción simulada con éxito en el área', area.nombre);
  }
  
  console.log('\n📋 Resumen de inscripciones simuladas:');
  console.log(`- Competidor: ${competidor.id}`);
  console.log(`- Convocatoria: ${convocatoria.nombre_convocatoria}`);
  console.log(`- Total de áreas disponibles: ${areasValidas.length}`);
  console.log(`- Total de inscripciones realizadas: ${inscripcionesSimuladas.length}`);
  
  inscripcionesSimuladas.forEach((insc, index) => {
    console.log(`  ${index + 1}. Área: ${insc.areaNombre} (${insc.areaId})`);
  });
  
  if (areasValidas.length > 2) {
    console.log('\n✅ RESTRICCIÓN VERIFICADA: No se permitió inscribir en más de 2 áreas');
  }
}

// Función principal para ejecutar la simulación
async function main() {
  try {
    // Buscar un competidor existente
    const competidor = await prisma.competidor.findFirst();
    if (!competidor) {
      console.error('❌ ERROR: No se encontró ningún competidor en la base de datos');
      return;
    }
    
    // Buscar una convocatoria existente
    const convocatoria = await prisma.convocatoria.findFirst();
    if (!convocatoria) {
      console.error('❌ ERROR: No se encontró ninguna convocatoria en la base de datos');
      return;
    }
    
    // Buscar áreas existentes
    const areas = await prisma.area.findMany({
      take: 3
    });
    
    if (areas.length === 0) {
      console.error('❌ ERROR: No se encontraron áreas en la base de datos');
      return;
    }
    
    // Obtener los IDs de las áreas
    const areaIds = areas.map(area => area.id);
    
    // Simular inscripción con restricción
    await simularInscripcion(competidor.id, areaIds, convocatoria.id);
    
  } catch (error) {
    console.error('❌ Error en la simulación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la simulación
main(); 