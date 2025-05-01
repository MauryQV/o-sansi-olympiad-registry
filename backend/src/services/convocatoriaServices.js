import prisma from '../config/prismaClient.js';


/*export const crearConvocatoria = async (data) => {
    // Verificar si ya existe una convocatoria con el mismo nombre
    const convocatoriaExistente = await prisma.convocatoria.findFirst({
        where: { nombre_convocatoria: data.nombre_convocatoria }
    });

    if (convocatoriaExistente) {
        throw new Error('Ya existe una convocatoria con este nombre');
    }

    // Validar coherencia de fechas
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFin = new Date(data.fecha_fin);
    const competicionInicio = new Date(data.competicion_inicio);
    const competicionFin = new Date(data.competicion_fin);

    if (fechaInicio >= fechaFin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    if (competicionInicio >= competicionFin) {
        throw new Error('La fecha de inicio de competición debe ser anterior a la fecha de fin de competición');
    }

    if (competicionInicio < fechaInicio) {
        throw new Error('La competición no puede iniciar antes de la fecha de inicio de la convocatoria');
    }

    if (competicionFin > fechaFin) {
        throw new Error('La competición no puede terminar después de la fecha de fin de la convocatoria');
    }

    return await prisma.convocatoria.create({ data });

    */

const crearConvocatoria = async (data) => {
    return await prisma.convocatoria.create({
        data,
    });
};

export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    const asignacionExistente = await prisma.area_convocatoria.findFirst({
        where: {
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (asignacionExistente) {
        throw new Error('Esta área ya está asignada a la convocatoria');
    }

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
        pago_inicio,
        pago_fin,
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
        pago_inicio: new Date(pago_inicio),
        pago_fin: new Date(pagon_fin),
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
    const convocatorias = await prisma.convocatoria.findMany({
        include: {
            estado_convocatoria: true, // Incluye la relación con estado_convocatoria
            _count: {
                select: {
                    Area_convocatoria: true, // Cuenta las áreas asociadas
                },
            },
        },
    });

    // Mapear los resultados para incluir "estado" y el número de áreas asociadas
    return convocatorias.map(({ id_estado_convocatoria, estado_convocatoria, _count, ...convocatoria }) => ({
        ...convocatoria,
        estado: estado_convocatoria.nombre, // Agregar el nombre del estado como "estado"
        numero_areas: _count.Area_convocatoria, // Agregar el número de áreas asociadas
    }));
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

export const obtenerConvocatoriaConAreas = async (id) => {
    return await prisma.convocatoria.findUnique({
        where: { id: parseInt(id) },
        include: {
            Area_convocatoria: {
                include: { area: true }
            }
        }
    });
};

export const actualizarConvocatoria = async (id, data) => {
    const {
        nombre_convocatoria,
        descripcion_convocatoria,
        id_estado_convocatoria,
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
    if (id_estado_convocatoria) updateData.id_estado_convocatoria = id_estado_convocatoria;

    if (updateData.fecha_inicio && updateData.fecha_fin && updateData.fecha_inicio >= updateData.fecha_fin) {
        throw new Error('fecha_inicio debe ser antes que fecha_fin');
    }

    if (updateData.competicion_inicio && updateData.competicion_fin && updateData.competicion_inicio >= updateData.competicion_fin) {
        throw new Error('competicion_inicio debe ser antes que competicion_fin');
    }

    //hey
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

export const eliminarConvocatoria = async (id) => {
    // Obtener la convocatoria por ID
    const convocatoria = await prisma.convocatoria.findUnique({
        where: { id: parseInt(id) },
        include: {
            estado_convocatoria: true, // Incluye el estado para verificar su nombre
        },
    });

    if (
        convocatoria.id_estado_convocatoria !== 1
    ) {
        throw new Error('Solo se pueden eliminar convocatorias en estado "Borrador" ');
    }

    return await prisma.convocatoria.delete({
        where: { id: parseInt(id) },
    });
};

export const obtenerEstadosConvocatoria = async () => {
    return await prisma.estado_convocatoria.findMany();
};