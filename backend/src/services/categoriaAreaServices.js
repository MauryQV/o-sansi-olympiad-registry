import prisma from '../config/prismaClient.js';

// Función para devolver todas las relaciones de Categoria_area
export const getCategoriasAreas = async () => {
    return await prisma.categoria_area.findMany();
};