import prisma from '../config/prismaClient.js';


/*export const crearCategoria = async (data) => {
    const gradoMin = await prisma.grado.findUnique({
        where: { id: data.grado_min_id }
    });
    const gradoMax = await prisma.grado.findUnique({
        where: { id: data.grado_max_id }
    });
    const valorGradoMin = parseInt(gradoMin.nombre_grado);
    const valorGradoMax = parseInt(gradoMax.nombre_grado);

    if (isNaN(valorGradoMin) || isNaN(valorGradoMax)) {
        throw new Error('Formato de grado inválido para comparación');
    }

    if (valorGradoMin > valorGradoMax) {
        throw new Error('El grado mínimo debe ser menor o igual al grado máximo');
    }

    return await prisma.categoria.create({ data });
};*/



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
            categoria_id: parseInt(nuevaCategoria.id),
            area_id: parseInt(area_id)
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

export const actualizarCategoriaConArea = async (id, data) => {
    const { nombre_categoria, descripcion_cat, grado_min_id, grado_max_id, area_id } = data;

    if (!area_id) {
        throw new Error('Debes seleccionar un área para la categoría');
    }
    const categoriaActualizada = await prisma.categoria.update({
        where: { id: parseInt(id, 10) },
        data: {
            nombre_categoria,
            descripcion_cat,
            grado_min_id,
            grado_max_id,
        },
    });

    await prisma.categoria_area.deleteMany({
        where: {
            categoria_id: parseInt(id, 10)
        }
    });

    await prisma.categoria_area.create({
        data: {
            categoria_id: parseInt(id, 10),
            area_id: parseInt(area_id, 10)
        }
    });

    const relacionActualizada = await prisma.categoria_area.findFirst({
        where: {
            categoria_id: parseInt(id, 10)
        }
    });

    if (!relacionActualizada) {
        throw new Error('Error al actualizar la relación categoria-área');
    }

    return {
        ...categoriaActualizada,
        area_id: relacionActualizada.area_id
    };
};
export const obtenerGrados = async () => {
    return await prisma.grado.findMany({
        include: {
            nivel: true,
        },

    });
};
/*
export const obtenerGradosSecundaria = async () => {
    return await prisma.grado.findMany({
        where: {
            nombre_grado: {
                in: ['1ro', '2do', '3ro', '4to', '5to', '6to']
            }
        }
    });
}**/

export const obtenerGradosCategorias = async (id_categoria) => {
    return await prisma.categoria.findUnique({
        where: { id: parseInt(id_categoria, 10) },
        select: {
            nombre_categoria: true, // Incluir el nombre de la categoría
            grado_min: {
                select: {
                    nombre_grado: true, // Nombre del grado mínimo
                    id_nivel: true,     // ID del nivel asociado al grado mínimo
                    nivel: {            // Relación con el modelo Nivel
                        select: {
                            nombre_nivel: true, // Nombre del nivel
                        },
                    },
                },
            },
            grado_max: {
                select: {
                    nombre_grado: true, // Nombre del grado máximo
                    id_nivel: true,     // ID del nivel asociado al grado máximo
                    nivel: {            // Relación con el modelo Nivel
                        select: {
                            nombre_nivel: true, // Nombre del nivel
                        },
                    },
                },
            },
        },
    });
};