import prisma from '../config/prismaClient.js';

export const crearCategoria = async (data) => {
    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await prisma.categoria.findFirst({
        where: { nombre_categoria: data.nombre_categoria }
    });

    if (categoriaExistente) {
        throw new Error('Ya existe una categoría con este nombre');
    }

    // Obtener los grados para verificar coherencia
    const gradoMin = await prisma.grado.findUnique({
        where: { id: data.grado_min_id }
    });

    const gradoMax = await prisma.grado.findUnique({
        where: { id: data.grado_max_id }
    });

    if (!gradoMin || !gradoMax) {
        throw new Error('Los grados especificados no existen');
    }

    // Convertir nombres de grado a valores numéricos para comparar (asumiendo formato como "1ro", "2do", etc.)
    const valorGradoMin = parseInt(gradoMin.nombre_grado);
    const valorGradoMax = parseInt(gradoMax.nombre_grado);

    if (isNaN(valorGradoMin) || isNaN(valorGradoMax)) {
        throw new Error('Formato de grado inválido para comparación');
    }

    if (valorGradoMin > valorGradoMax) {
        throw new Error('El grado mínimo debe ser menor o igual al grado máximo');
    }

    return await prisma.categoria.create({ data });
};

export const asignarCategoriaAConvocatoria = async (convocatoriaId, categoriaId) => {
    // Verificar si la categoría ya está asignada a esta convocatoria
    const asignacionExistente = await prisma.Categoria_convocatoria.findFirst({
        where: {
            convocatoria_id: convocatoriaId,
            categoria_id: categoriaId
        }
    });

    if (asignacionExistente) {
        throw new Error('Esta categoría ya está asignada a la convocatoria');
    }

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
            //Categoria_convocatoria: true, 
        },
    });
};
