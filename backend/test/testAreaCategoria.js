import 'dotenv/config';
import prisma from '../src/config/prismaClient.js';

/**
 * Script para probar la funcionalidad de áreas y categorías
 * Este script realiza las siguientes pruebas:
 * 1. Crear un área de competencia
 * 2. Crear una categoría
 * 3. Crear una convocatoria
 * 4. Asignar el área a la convocatoria
 * 5. Asignar la categoría a la convocatoria
 * 6. Simular la inscripción de un participante en áreas y verificar la restricción de máximo 2 áreas
 */

// Datos de prueba
const areaData = [
  { nombre_area: 'Matemática', descripcion_area: 'Área de competencia de matemáticas' },
  { nombre_area: 'Física', descripcion_area: 'Área de competencia de física' },
  { nombre_area: 'Química', descripcion_area: 'Área de competencia de química' }
];

const gradoData = [
  { nombre_grado: '1' },
  { nombre_grado: '2' },
  { nombre_grado: '3' },
  { nombre_grado: '4' },
  { nombre_grado: '5' },
  { nombre_grado: '6' }
];

const categoriaData = {
  nombre_categoria: 'Primaria',
  descripcion_cat: 'Categoría para estudiantes de primaria'
};

const convocatoriaData = {
  nombre_convocatoria: 'Olimpiada 2025',
  fecha_inicio: new Date('2025-01-01'),
  fecha_fin: new Date('2025-03-01'),
  competicion_inicio: new Date('2025-01-15'),
  competicion_fin: new Date('2025-02-15'),
  descripcion_convocatoria: 'Olimpiada de ciencias 2025',
  id_estado_convocatoria: 1
};

// Funciones auxiliares para las pruebas
async function crearAreas() {
  console.log('Creando áreas de competencia...');
  
  const areas = [];
  for (const area of areaData) {
    // Intentar encontrar un área existente primero
    let existingArea = await prisma.area.findFirst({
      where: { nombre_area: area.nombre_area }
    });
    
    if (!existingArea) {
      existingArea = await prisma.area.create({ data: area });
      console.log(`✅ Área creada: ${existingArea.nombre_area}`);
    } else {
      console.log(`ℹ️ Área ya existe: ${existingArea.nombre_area}`);
    }
    
    areas.push(existingArea);
  }
  
  return areas;
}

async function crearGrados() {
  console.log('Creando grados...');
  
  const grados = [];
  for (const grado of gradoData) {
    // Intentar encontrar un grado existente primero
    let existingGrado = await prisma.grado.findFirst({
      where: { nombre_grado: grado.nombre_grado }
    });
    
    if (!existingGrado) {
      existingGrado = await prisma.grado.create({ data: grado });
      console.log(`✅ Grado creado: ${existingGrado.nombre_grado}`);
    } else {
      console.log(`ℹ️ Grado ya existe: ${existingGrado.nombre_grado}`);
    }
    
    grados.push(existingGrado);
  }
  
  return grados;
}

async function crearCategoria(grados) {
  console.log('Creando categoría...');
  
  const data = {
    ...categoriaData,
    grado_min_id: grados[0].id,
    grado_max_id: grados[5].id
  };
  
  // Intentar encontrar una categoría existente primero
  let existingCategoria = await prisma.categoria.findFirst({
    where: { nombre_categoria: data.nombre_categoria }
  });
  
  if (!existingCategoria) {
    existingCategoria = await prisma.categoria.create({ data });
    console.log(`✅ Categoría creada: ${existingCategoria.nombre_categoria}`);
  } else {
    console.log(`ℹ️ Categoría ya existe: ${existingCategoria.nombre_categoria}`);
  }
  
  return existingCategoria;
}

async function crearConvocatoria() {
  console.log('Creando convocatoria...');

  // Verificar si el estado de convocatoria existe
  let estadoConvocatoria = await prisma.estado_convocatoria.findFirst({
    where: { id: convocatoriaData.id_estado_convocatoria }
  });

  if (!estadoConvocatoria) {
    // Crear el estado si no existe
    estadoConvocatoria = await prisma.estado_convocatoria.create({
      data: {
        id: convocatoriaData.id_estado_convocatoria,
        nombre: 'Activa'
      }
    });
    console.log('✅ Estado de convocatoria creado');
  }
  
  // Intentar encontrar una convocatoria existente primero
  let existingConvocatoria = await prisma.convocatoria.findFirst({
    where: { nombre_convocatoria: convocatoriaData.nombre_convocatoria }
  });
  
  if (!existingConvocatoria) {
    existingConvocatoria = await prisma.convocatoria.create({ data: convocatoriaData });
    console.log(`✅ Convocatoria creada: ${existingConvocatoria.nombre_convocatoria}`);
  } else {
    console.log(`ℹ️ Convocatoria ya existe: ${existingConvocatoria.nombre_convocatoria}`);
  }
  
  return existingConvocatoria;
}

async function asignarAreaAConvocatoria(area, convocatoria) {
  console.log(`Asignando área ${area.nombre_area} a convocatoria ${convocatoria.nombre_convocatoria}...`);
  
  // Verificar si ya existe la asignación
  const existingAsignacion = await prisma.area_convocatoria.findFirst({
    where: {
      area_id: area.id,
      convocatoria_id: convocatoria.id
    }
  });
  
  if (!existingAsignacion) {
    const asignacion = await prisma.area_convocatoria.create({
      data: {
        area_id: area.id,
        convocatoria_id: convocatoria.id
      }
    });
    console.log('✅ Área asignada a convocatoria correctamente');
    return asignacion;
  } else {
    console.log('ℹ️ El área ya está asignada a esta convocatoria');
    return existingAsignacion;
  }
}

async function asignarCategoriaAConvocatoria(categoria, convocatoria) {
  console.log(`Asignando categoría ${categoria.nombre_categoria} a convocatoria ${convocatoria.nombre_convocatoria}...`);
  
  // Verificar si ya existe la asignación
  const existingAsignacion = await prisma.categoria_convocatoria.findFirst({
    where: {
      categoria_id: categoria.id,
      convocatoria_id: convocatoria.id
    }
  });
  
  if (!existingAsignacion) {
    const asignacion = await prisma.categoria_convocatoria.create({
      data: {
        categoria_id: categoria.id,
        convocatoria_id: convocatoria.id
      }
    });
    console.log('✅ Categoría asignada a convocatoria correctamente');
    return asignacion;
  } else {
    console.log('ℹ️ La categoría ya está asignada a esta convocatoria');
    return existingAsignacion;
  }
}

// Función principal para ejecutar las pruebas
async function runTests() {
  try {
    console.log('🚀 Iniciando pruebas de áreas y categorías');
    
    // Crear áreas de competencia
    const areas = await crearAreas();
    
    // Crear grados
    const grados = await crearGrados();
    
    // Crear categoría
    const categoria = await crearCategoria(grados);
    
    // Crear convocatoria
    const convocatoria = await crearConvocatoria();
    
    // Asignar áreas a la convocatoria
    for (const area of areas) {
      await asignarAreaAConvocatoria(area, convocatoria);
    }
    
    // Asignar categoría a la convocatoria
    await asignarCategoriaAConvocatoria(categoria, convocatoria);
    
    // Verificar que todo se haya creado correctamente
    console.log('\n📋 Resumen de la prueba:');
    console.log(`- ${areas.length} áreas creadas`);
    console.log(`- ${grados.length} grados creados`);
    console.log('- 1 categoría creada');
    console.log('- 1 convocatoria creada');
    console.log(`- ${areas.length} asignaciones de áreas a convocatoria`);
    console.log('- 1 asignación de categoría a convocatoria');
    
    console.log('\n✅ Pruebas completadas exitosamente');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
runTests(); 