import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando limpieza de datos de prueba...');

    // Eliminar pagos primero (relación con inscripciones)
    await prisma.pago.deleteMany({
      where: {}
    });
    console.log('Pagos eliminados');

    // Eliminar inscripciones tutor (relación con inscripciones)
    await prisma.inscripcion_tutor.deleteMany({
      where: {}
    });
    console.log('Inscripciones tutor eliminadas');

    // Eliminar inscripciones
    await prisma.inscripcion.deleteMany({
      where: {}
    });
    console.log('Inscripciones eliminadas');

    // Eliminar competidores de prueba
    await prisma.competidor.deleteMany({
      where: {
        usuario: {
          correo_electronico: {
            in: ['competidor1@test.com', 'competidor2@test.com', 'competidor3@test.com']
          }
        }
      }
    });
    console.log('Competidores eliminados');

    // Eliminar usuarios de prueba excepto admin y cajero
    await prisma.usuario.deleteMany({
      where: {
        correo_electronico: {
          in: ['competidor1@test.com', 'competidor2@test.com', 'competidor3@test.com']
        }
      }
    });
    console.log('Usuarios competidores eliminados');

    console.log('¡Limpieza completada con éxito!');
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 