import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const areasRequeridas = [
  { nombre_area: 'Matemática', descripcion_area: 'Área de matemáticas', costo: 150.00 },
  { nombre_area: 'Robótica', descripcion_area: 'Área de robótica', costo: 200.00 },
  { nombre_area: 'Astronomía y Astrofísica', descripcion_area: 'Área de astronomía y astrofísica', costo: 175.00 },
  { nombre_area: 'Biología', descripcion_area: 'Área de biología', costo: 160.00 },
  { nombre_area: 'Química', descripcion_area: 'Área de química', costo: 170.00 },
  { nombre_area: 'Física', descripcion_area: 'Área de física', costo: 180.00 },
  { nombre_area: 'Informática', descripcion_area: 'Área de informática', costo: 190.00 }
];

async function verificarYCrearAreas() {
  try {
    console.log('🔍 Verificando áreas existentes en la base de datos...');
    
    // Obtener todas las áreas existentes
    const areasExistentes = await prisma.area.findMany();
    console.log(`📊 Áreas actuales en la base de datos: ${areasExistentes.length}`);
    
    if (areasExistentes.length > 0) {
      console.log('📋 Áreas existentes:');
      areasExistentes.forEach((area, index) => {
        console.log(`   ${index + 1}. ${area.nombre_area} - ${area.costo} Bs`);
      });
    }
    
    console.log('\n🔄 Verificando áreas requeridas...');
    
    // Verificar y crear áreas faltantes
    let areasCreadas = 0;
    for (const areaRequerida of areasRequeridas) {
      const areaExistente = areasExistentes.find(
        area => area.nombre_area.toLowerCase() === areaRequerida.nombre_area.toLowerCase()
      );
      
      if (!areaExistente) {
        console.log(`➕ Creando área: ${areaRequerida.nombre_area}`);
        await prisma.area.create({
          data: areaRequerida
        });
        areasCreadas++;
      } else {
        console.log(`✅ Ya existe: ${areaRequerida.nombre_area}`);
      }
    }
    
    if (areasCreadas > 0) {
      console.log(`\n🎉 Se crearon ${areasCreadas} nuevas áreas.`);
      
      // Mostrar el estado final
      const areasFinales = await prisma.area.findMany();
      console.log(`\n📊 Total de áreas después de la verificación: ${areasFinales.length}`);
      console.log('📋 Listado completo:');
      areasFinales.forEach((area, index) => {
        console.log(`   ${index + 1}. ${area.nombre_area} - ${area.costo} Bs`);
      });
    } else {
      console.log('\n✅ Todas las áreas requeridas ya existen en la base de datos.');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar las áreas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
verificarYCrearAreas()
  .then(() => console.log('\n🏁 Verificación completada con éxito'))
  .catch((error) => console.error('💥 Error en la verificación:', error)); 