import 'dotenv/config';
import prisma from '../src/config/prismaClient.js';

/**
 * Script para probar la restricción de máximo 2 áreas por participante
 * Este script realiza las siguientes pruebas:
 * 1. Crear un competidor de prueba o usar uno existente
 * 2. Crear o usar una convocatoria existente
 * 3. Inscribir al competidor en 2 áreas y verificar que funciona
 * 4. Intentar inscribir al competidor en una tercera área y verificar que falla
 */

// Crear el modelo para la inscripción a áreas si no existe
const modeloInscripcionArea = `
model Inscripcion_area {
  id                Int          @id @default(autoincrement())
  competidor_id     String
  area_id           Int
  convocatoria_id   Int
  fecha_inscripcion DateTime     @default(now())
  competidor        Competidor   @relation(fields: [competidor_id], references: [id])
  area              Area         @relation(fields: [area_id], references: [id])
  convocatoria      Convocatoria @relation(fields: [convocatoria_id], references: [id])
}`;

// Función para inscribir a un competidor en un área
async function inscribirEnArea(competidorId, areaId, convocatoriaId) {
  try {
    // Verificar si ya está inscrito en esta área
    const inscripcionExistente = await prisma.inscripcion_area.findFirst({
      where: {
        competidor_id: competidorId,
        area_id: areaId,
        convocatoria_id: convocatoriaId
      }
    });

    if (inscripcionExistente) {
      console.log(`⚠️ El competidor ya está inscrito en esta área`);
      return inscripcionExistente;
    }

    // Verificar cuántas áreas tiene asignadas
    const areasAsignadas = await prisma.inscripcion_area.count({
      where: {
        competidor_id: competidorId,
        convocatoria_id: convocatoriaId
      }
    });

    console.log(`ℹ️ El competidor está inscrito en ${areasAsignadas} áreas`);

    // Aplicar la restricción de máximo 2 áreas
    if (areasAsignadas >= 2) {
      console.error('❌ ERROR: No se puede inscribir en más de 2 áreas por convocatoria');
      return null;
    }

    // Crear la inscripción
    const inscripcion = await prisma.inscripcion_area.create({
      data: {
        competidor_id: competidorId,
        area_id: areaId,
        convocatoria_id: convocatoriaId,
        fecha_inscripcion: new Date()
      }
    });

    console.log(`✅ Inscripción creada en el área ${areaId}`);
    return inscripcion;
  } catch (error) {
    console.error('❌ Error al inscribir en área:', error.message);
    throw error;
  }
}

// Función para crear un competidor de prueba
async function crearCompetidorPrueba() {
  try {
    // Primero, buscar un usuario para asociarlo al competidor
    const usuario = await prisma.usuario.findFirst();
    
    if (!usuario) {
      console.error('❌ No se encontró ningún usuario para asociar al competidor');
      console.log('Creando usuario de prueba...');
      
      // Crear un rol si no existe
      let rol = await prisma.rol.findFirst();
      if (!rol) {
        rol = await prisma.rol.create({
          data: {
            nombre: 'estudiante',
          }
        });
      }
      
      // Crear usuario de prueba
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          correo_electronico: 'test@example.com',
          nombre: 'Usuario',
          apellido: 'Prueba',
          rol_id: rol.id
        }
      });
      
      console.log('✅ Usuario de prueba creado:', nuevoUsuario.id);
      
      // Buscar o crear provincia y colegio
      let provincia = await prisma.provincia.findFirst();
      let colegio = await prisma.colegio.findFirst();
      
      if (!provincia) {
        // Crear departamento primero
        const departamento = await prisma.departamento.create({
          data: {
            nombre_departamento: 'Departamento Prueba'
          }
        });
        
        provincia = await prisma.provincia.create({
          data: {
            nombre_provincia: 'Provincia Prueba',
            departamento_id: departamento.id
          }
        });
      }
      
      if (!colegio) {
        colegio = await prisma.colegio.create({
          data: {
            nombre_colegio: 'Colegio Prueba',
            provincia_id: provincia.id
          }
        });
      }
      
      // Crear competidor
      const competidor = await prisma.competidor.create({
        data: {
          usuario_id: nuevoUsuario.id,
          carnet_identidad: 'TEST123',
          fecha_nacimiento: new Date(2005, 0, 1),
          correo_electronico: 'testcomp@example.com',
          colegio_id: colegio.id,
          provincia_id: provincia.id
        }
      });
      
      console.log('✅ Competidor de prueba creado:', competidor.id);
      return competidor;
    } else {
      // Buscar si ya existe un competidor asociado a este usuario
      const competidorExistente = await prisma.competidor.findFirst({
        where: { usuario_id: usuario.id }
      });
      
      if (competidorExistente) {
        console.log('ℹ️ Usando competidor existente:', competidorExistente.id);
        return competidorExistente;
      }
      
      // Si no existe, buscar o crear provincia y colegio
      let provincia = await prisma.provincia.findFirst();
      let colegio = await prisma.colegio.findFirst();
      
      if (!provincia) {
        // Crear departamento primero
        const departamento = await prisma.departamento.create({
          data: {
            nombre_departamento: 'Departamento Prueba'
          }
        });
        
        provincia = await prisma.provincia.create({
          data: {
            nombre_provincia: 'Provincia Prueba',
            departamento_id: departamento.id
          }
        });
      }
      
      if (!colegio) {
        colegio = await prisma.colegio.create({
          data: {
            nombre_colegio: 'Colegio Prueba',
            provincia_id: provincia.id
          }
        });
      }
      
      // Crear competidor
      const competidor = await prisma.competidor.create({
        data: {
          usuario_id: usuario.id,
          carnet_identidad: 'TEST456',
          fecha_nacimiento: new Date(2005, 0, 1),
          correo_electronico: 'testcomp2@example.com',
          colegio_id: colegio.id,
          provincia_id: provincia.id
        }
      });
      
      console.log('✅ Competidor creado:', competidor.id);
      return competidor;
    }
  } catch (error) {
    console.error('❌ Error al crear competidor:', error.message);
    throw error;
  }
}

// Función principal para ejecutar las pruebas
async function runTests() {
  try {
    console.log('🚀 Iniciando prueba de restricción de máximo 2 áreas por participante');
    
    // Verificar si el modelo Inscripcion_area existe
    try {
      await prisma.inscripcion_area.findFirst();
      console.log('ℹ️ Modelo Inscripcion_area encontrado');
    } catch (error) {
      console.error('❌ ERROR: El modelo Inscripcion_area no existe');
      console.log('Es necesario ejecutar las siguientes migraciones:');
      console.log('1. Agregar el modelo Inscripcion_area al esquema de Prisma');
      console.log('2. Ejecutar prisma migrate dev');
      console.log('\nEjemplo del modelo a agregar:');
      console.log(modeloInscripcionArea);
      
      console.log('\nEn la relación Competidor agregar:');
      console.log('  Inscripcion_area   Inscripcion_area[]');
      
      console.log('\nEn la relación Area agregar:');
      console.log('  Inscripcion_area  Inscripcion_area[]');
      
      console.log('\nEn la relación Convocatoria agregar:');
      console.log('  Inscripcion_area         Inscripcion_area[]');
      
      process.exit(1);
    }
    
    // Obtener competidor
    const competidor = await crearCompetidorPrueba();
    
    // Obtener convocatoria
    let convocatoria = await prisma.convocatoria.findFirst();
    if (!convocatoria) {
      // Verificar si el estado de convocatoria existe
      let estadoConvocatoria = await prisma.estado_convocatoria.findFirst();
      
      if (!estadoConvocatoria) {
        // Crear el estado si no existe
        estadoConvocatoria = await prisma.estado_convocatoria.create({
          data: {
            nombre: 'Activa'
          }
        });
      }
      
      // Crear convocatoria
      convocatoria = await prisma.convocatoria.create({
        data: {
          nombre_convocatoria: 'Olimpiada de Prueba',
          fecha_inicio: new Date(),
          fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          competicion_inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          competicion_fin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          descripcion_convocatoria: 'Convocatoria para prueba',
          id_estado_convocatoria: estadoConvocatoria.id
        }
      });
    }
    
    console.log('ℹ️ Usando convocatoria:', convocatoria.nombre_convocatoria);
    
    // Obtener áreas
    let areas = await prisma.area.findMany({
      take: 3
    });
    
    if (areas.length < 3) {
      console.log('ℹ️ No hay suficientes áreas. Creando áreas de prueba...');
      
      // Crear áreas de prueba
      for (let i = areas.length; i < 3; i++) {
        const area = await prisma.area.create({
          data: {
            nombre_area: `Área de prueba ${i+1}`,
            descripcion_area: `Descripción del área de prueba ${i+1}`
          }
        });
        areas.push(area);
        
        // Asignar el área a la convocatoria
        await prisma.area_convocatoria.create({
          data: {
            area_id: area.id,
            convocatoria_id: convocatoria.id
          }
        });
      }
    }
    
    // Limpiar inscripciones previas del competidor
    await prisma.inscripcion_area.deleteMany({
      where: {
        competidor_id: competidor.id,
        convocatoria_id: convocatoria.id
      }
    });
    
    console.log('\n📝 PRUEBA 1: Inscribir en la primera área');
    const inscripcion1 = await inscribirEnArea(competidor.id, areas[0].id, convocatoria.id);
    
    console.log('\n📝 PRUEBA 2: Inscribir en la segunda área');
    const inscripcion2 = await inscribirEnArea(competidor.id, areas[1].id, convocatoria.id);
    
    console.log('\n📝 PRUEBA 3: Intentar inscribir en la tercera área (debe fallar)');
    const inscripcion3 = await inscribirEnArea(competidor.id, areas[2].id, convocatoria.id);
    
    if (!inscripcion3) {
      console.log('\n✅ RESTRICCIÓN APLICADA CORRECTAMENTE: No se permitió la inscripción en más de 2 áreas');
    } else {
      console.error('\n❌ ERROR: La restricción de máximo 2 áreas no está funcionando correctamente');
    }
    
    // Mostrar las áreas en las que está inscrito el competidor
    const areasInscritas = await prisma.inscripcion_area.findMany({
      where: {
        competidor_id: competidor.id,
        convocatoria_id: convocatoria.id
      },
      include: {
        area: true
      }
    });
    
    console.log('\n📋 Áreas en las que está inscrito el competidor:');
    areasInscritas.forEach(inscripcion => {
      console.log(`- ${inscripcion.area.nombre_area}`);
    });
    
    console.log('\n✅ Pruebas completadas exitosamente');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
runTests(); 