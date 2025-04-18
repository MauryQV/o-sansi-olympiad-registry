import prisma from '../config/prismaClient.js';

const crearConvocatoria = async (data) => {
    return await prisma.convocatoria.create({
        data,
    });
};

export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    return await prisma.area_convocatoria.create({
        data: { convocatoria_id: convocatoriaId, area_id: areaId }
    });
};


export const crearConvocatoriaConRelaciones = async (data) => {
    const {
        nombre_convocatoria,
        id_estado_convocatoria,
        fecha_inicio,
        fecha_fin,
        competicion_inicio,
        competicion_fin,
        descripcion_convocatoria,
        areaIds,
    } = data;

    if (!areaIds || areaIds.length === 0) {
        throw new Error('Debes incluir al menos un área');
    }

    const nuevaConvocatoria = await crearConvocatoria({
        nombre_convocatoria,
        id_estado_convocatoria,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        competicion_inicio: new Date(competicion_inicio),
        competicion_fin: new Date(competicion_fin),
        descripcion_convocatoria,
    });

    const convocatoriaId = nuevaConvocatoria.id;

    // 2. Asignar áreas
    await Promise.all(
        areaIds.map((areaId) =>
            asignarAreaAConvocatoria(convocatoriaId, areaId)
        )
    );

    return nuevaConvocatoria;
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


export const actualizarConvocatoria = async (id, data) => {
    const {
        nombre_convocatoria,
        descripcion_convocatoria,
        fecha_inicio,
        fecha_fin,
        competicion_inicio,
        competicion_fin,
        areaIds
    } = data;

    const updateData = {};
    if (nombre_convocatoria) updateData.nombre_convocatoria = nombre_convocatoria;
    if (descripcion_convocatoria) updateData.descripcion_convocatoria = descripcion_convocatoria;
    if (fecha_inicio) updateData.fecha_inicio = new Date(fecha_inicio);
    if (fecha_fin) updateData.fecha_fin = new Date(fecha_fin);
    if (competicion_inicio) updateData.competicion_inicio = new Date(competicion_inicio);
    if (competicion_fin) updateData.competicion_fin = new Date(competicion_fin);

    if (updateData.fecha_inicio && updateData.fecha_fin && updateData.fecha_inicio >= updateData.fecha_fin) {
        throw new Error('fecha_inicio debe ser antes que fecha_fin');
    }

    if (updateData.competicion_inicio && updateData.competicion_fin && updateData.competicion_inicio >= updateData.competicion_fin) {
        throw new Error('competicion_inicio debe ser antes que competicion_fin');
    }


    const updated = await prisma.convocatoria.update({
        where: { id: parseInt(id) },
        data: updateData,
    });

    if (Array.isArray(areaIds)) {
        await prisma.area_convocatoria.deleteMany({
            where: { convocatoria_id: updated.id }
        });

        if (areaIds.length > 0) {
            await Promise.all(
                areaIds.map(areaId =>
                    asignarAreaAConvocatoria(updated.id, areaId)
                )
            );
        }
    }

    return updated;
};