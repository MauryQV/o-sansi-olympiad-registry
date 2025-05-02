import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Agregamos el manejo de errores global para debug
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error(`Error en operación Prisma ${params.model}.${params.action}`);
    console.error('Detalles:', error);
    throw error;
  }
});

export default prisma;
