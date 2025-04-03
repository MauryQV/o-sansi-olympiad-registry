import prisma from '../config/prismaClient.js';


export const crearArea = async (nombre) => {
    return await prisma.area.create({ data: { nombre_area: nombre } });
};



export const obtenerAreas = async () => {
    return await prisma.area.findMany();
};
