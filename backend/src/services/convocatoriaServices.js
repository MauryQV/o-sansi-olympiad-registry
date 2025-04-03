import prisma from '../config/prismaClient.js';



export const crearConvocatoria = async (data) => {
    return await prisma.convocatoria.create({ data });
};


export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    return await prisma.area_convocatoria.create({
        data: { convocatoria_id: convocatoriaId, area_id: areaId }
    });
};

export const obtenerConvocatorias = async () => {
    return await prisma.convocatoria.findMany({
        include: { Area_convocatoria: true }
    });
};
