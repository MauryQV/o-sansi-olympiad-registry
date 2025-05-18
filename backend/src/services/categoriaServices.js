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
    try {
        const { nombre_categoria, descripcion_cat, grado_min_id, grado_max_id, area_id } = data;

        if (!area_id) {
            throw new Error('Debes seleccionar un área para la categoría');
        }

        if (!nombre_categoria || !descripcion_cat) {
            throw new Error('El nombre y la descripción son obligatorios');
        }

        if (!grado_min_id || !grado_max_id) {
            throw new Error('Debes seleccionar los grados mínimo y máximo');
        }

        const categoriaActualizada = await prisma.categoria.update({
            where: { id: parseInt(id, 10) },
            data: {
                nombre_categoria,
                descripcion_cat,
                grado_min_id: parseInt(grado_min_id, 10),
                grado_max_id: parseInt(grado_max_id, 10),
            },
        });

        // Actualizar la relación con el área
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
    } catch (error) {
        console.error('Error en actualizarCategoriaConArea:', error);
        throw error;
    }
};
export const obtenerGrados = async () => {
    return await prisma.grado.findMany({
        include: {
            nivel: true,
        },

    });
};


export const obtenerGradosCategorias = async (id_categoria) => {
    return await prisma.categoria.findUnique({
        where: { id: parseInt(id_categoria, 10) },
        select: {
            nombre_categoria: true, 
            grado_min: {
                select: {
                    nombre_grado: true, 
                    id_nivel: true,    
                    nivel: {       
                        select: {
                            nombre_nivel: true, 
                        },
                    },
                },
            },
            grado_max: {
                select: {
                    nombre_grado: true, 
                    id_nivel: true,    
                    nivel: {          
                        select: {
                            nombre_nivel: true, 
                        },
                    },
                },
            },
        },
    });
};

export const eliminarCategoriaCompletaBD = async (categoriaId) => {
    const id = parseInt(categoriaId, 10);
    if (isNaN(id)) {
        throw new Error('El ID de la categoría debe ser un número válido.');
    }

    return await prisma.$transaction(async (tx) => {
        // Primero, eliminar las relaciones en categoria_area
        await tx.categoria_area.deleteMany({
            where: {
                categoria_id: id,
            },
        });

        // Luego, eliminar la categoria jiji
        const categoriaEliminada = await tx.categoria.delete({
            where: {
                id: id,
            },
        });

        return categoriaEliminada;
    });
};