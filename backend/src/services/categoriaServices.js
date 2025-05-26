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
    try {
        // Obtener la categoría con sus grados mínimo y máximo
        const categoria = await prisma.categoria.findUnique({
            where: { id: parseInt(id_categoria, 10) },
            include: {
                grado_min: {
                    include: {
                        nivel: true
                    }
                },
                grado_max: {
                    include: {
                        nivel: true
                    }
                }
            }
        });

        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }

        // Obtener todos los grados que están dentro del rango de la categoría
        const gradosCategoria = await prisma.grado.findMany({
            where: {
                AND: [
                    { id: { gte: categoria.grado_min_id } },
                    { id: { lte: categoria.grado_max_id } }
                ]
            },
            include: {
                nivel: true
            },
            orderBy: [
                { nivel: { nombre_nivel: 'asc' } },
                { id: 'asc' }
            ]
        });

        // Formatear los grados según las equivalencias
        const equivalencias = {
            "Primero": "1",
            "Segundo": "2",
            "Tercero": "3",
            "Cuarto": "4",
            "Quinto": "5",
            "Sexto": "6"
        };

        const gradosFormateados = gradosCategoria.map(grado => ({
            id: grado.id,
            nombre_grado: equivalencias[grado.nombre_grado] || grado.nombre_grado,
            nivel: grado.nivel.nombre_nivel
        }));

        // Obtener niveles únicos
        const nivelesUnicos = [...new Set(gradosFormateados.map(g => g.nivel))];

        // Formatear la respuesta
        return {
            id_categoria: categoria.id,
            nombre_categoria: categoria.nombre_categoria,
            grados: gradosFormateados,
            niveles: nivelesUnicos
        };
    } catch (error) {
        console.error('Error al obtener grados de la categoría:', error);
        throw error;
    }
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

export const obtenerCategoriasPorArea = async (areaId) => {
    try {
        const categorias = await prisma.categoria_area.findMany({
            where: {
                area_id: parseInt(areaId, 10)
            },
            include: {
                categoria: true
            }
        });

        return categorias;
    } catch (error) {
        console.error('Error al obtener categorías por área:', error);
        throw error;
    }
};