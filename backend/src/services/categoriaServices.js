import prisma from '../config/prismaClient.js';

export const crearCategoria = async (data) => {
    return await prisma.categoria.create({ data })
};

export const asignarCategoriaAConvocatoria = async (convocatoriaId, categoriaId) => {
    return await prisma.Categoria_convocatoria.create({
        data: {
            convocatoria_id: convocatoriaId,
            categoria_id: categoriaId
        }
    });
};

export const obtenerCategorias = async () => {
    return await prisma.categoria.findMany({
        include: {
            grado_min: true,
            grado_max: true,
            Categoria_convocatoria: true,
        },
    });
};
