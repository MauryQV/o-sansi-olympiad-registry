import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

//no meter cosas innecesarias en el log, solo errores y advertencias :VVVVVVVVVVVVVVVVVVVVV
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error(`Error en operación prisma ${params.model}.${params.action}`);
    console.error('Detalles:', error);
    throw error;
  }
});

export default prisma;