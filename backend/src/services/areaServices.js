import prisma from '../config/prismaClient.js';

/*export const crearArea = async (nombre) => {
    // Verificar si ya existe un área con el mismo nombre
    const areaExistente = await prisma.area.findFirst({
        where: { nombre_area: nombre }
    });


    if (areaExistente) {
        throw new Error('Ya existe un área con este nombre');
    }

    return await prisma.area.create({ data: { nombre_area: nombre } });
};
*/

//funcion para crear un area, pero no verifica si ya existe un area con el mismo nombre
export const crearArea = async (nombre_area, descripcion_area, costo) => {

    return await prisma.area.create({
        data: {
            nombre_area,
            descripcion_area,
            costo,
        },
    });
};


//funcion para devolver todas las areas creadas
export const getAreas = async () => {
    return await prisma.area.findMany();
};


export const getAreaById = async (id) => {
    return await prisma.area.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
            Area_convocatoria: {
                include: {
                    convocatoria: true,
                },
            },
        },
    });
};

export const updateArea = async (id, nombre_area, descripcion_area, costo) => {
    return await prisma.area.update({
        where: { id: parseInt(id, 10) },
        data: {
            nombre_area,
            descripcion_area,
            //agregado para respetar el mockup y especificaciones del ing
            costo
        }
    });
}

export const deleteArea = async (id) => {
    const area = await prisma.area.findUnique({
        where: { id: parseInt(id, 10) },
    });

    if (!area) {
        throw new Error('Área no encontrada');
    }

    return await prisma.area.delete({
        where: { id: parseInt(id, 10) },
    });
};

export const getCategoriasArea = async (id) => {
    return await prisma.categoria_area.findMany({
        where: { area_id: parseInt(id, 10) },
        select: {
            categoria: {
                select: {
                    id: true,
                    nombre_categoria: true,
                },
            },
        },
    });
};

