import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addEstadoColumn() {
  try {
    // Ejecutar SQL directamente
    const result = await prisma.$executeRawUnsafe(
      `ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "estado" BOOLEAN NOT NULL DEFAULT true;`
    );
    
    console.log('Columna estado añadida correctamente');
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error al añadir la columna estado:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
addEstadoColumn()
  .then(() => console.log('Operación completada con éxito'))
  .catch((error) => console.error('Error en la operación:', error)); 