import prisma from '../config/prismaClient.js';

export const crearArea = async (nombre) => {
    // Verificar si ya existe un área con el mismo nombre
    const areaExistente = await prisma.area.findFirst({
        where: { nombre_area: nombre }
    });

    if (areaExistente) {
        throw new Error('Ya existe un área con este nombre');
    }

    return await prisma.area.create({ data: { nombre_area: nombre } });
};

export const obtenerAreas = async () => {
    return await prisma.area.findMany();
};
