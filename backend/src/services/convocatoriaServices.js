import prisma from '../config/prismaClient.js';



export const crearConvocatoria = async (data) => {
    return await prisma.convocatoria.create({ data });
};


export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    return await prisma.area_convocatoria.create({
        data: { convocatoria_id: convocatoriaId, area_id: areaId }
    });
};


export const asignarCategoriaAConvocatoria = async (convocatoriaId, categoriaId) => {
    return await prisma.categoria_convocatoria.create({
        data: { convocatoria_id: convocatoriaId, categoria_id: categoriaId }
    });
}

export const obtenerConvocatorias = async () => {
    return await prisma.convocatoria.findMany();
};

//pasar un id y devolver la convocatoria con ese id
export const obtenerConvocatoriaPorId = async (id) => {
    return await prisma.convocatoria.findUnique({
        where: { id },
    });
}

export const obtenerConvocatoriaPorEstados = async (estado) => {
    return await prisma.convocatoria.findMany({
        where: {
            estado_convocatoria: {
                nombre: estado,
            },
        },
    });
};
