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
export const crearArea = async (nombre_area, descripcion_area, costo) => {

    return await prisma.area.create({
        data: {
            nombre_area,
            descripcion_area,
            costo,
        },
    });
};



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
            costo
        }
    });
}

export const deleteArea = async (id) => {
    return await prisma.area.delete({
        where: { id: parseInt(id, 10) },
    });
}

