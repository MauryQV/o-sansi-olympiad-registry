import prisma from '../config/prismaClient.js';


export const crearArea = async (nombre_area) => {
    return await prisma.area.create({ data: { nombre_area: nombre_area } });
};



export const getAreas = async () => {
    return await prisma.area.findMany();
};
