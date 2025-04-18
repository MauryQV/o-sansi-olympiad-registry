import prisma from '../config/prismaClient.js';

export const crearCategoriaConArea = async (data) => {
    const {
        nombre_categoria,
        descripcion_cat,
        grado_min_id,
        grado_max_id,
        area_id //selecciona el area_id desde el front react :V
    } = data;

    if (!area_id) {
        throw new Error('Debes seleccionar un área para la categoría');
    }

    const nuevaCategoria = await prisma.categoria.create({
        data: {
            nombre_categoria,
            descripcion_cat,
            grado_min_id,
            grado_max_id,
        },
    });


    await prisma.categoria_area.create({
        data: {
            categoria_id: nuevaCategoria.id,
            area_id
        }
    });

    return {
        ...nuevaCategoria,
        area_id
    };
};

export const obtenerCategorias = async () => {
    return await prisma.categoria.findMany({
        include: {
            grado_min: true,
            grado_max: true,

        },
    });
};
