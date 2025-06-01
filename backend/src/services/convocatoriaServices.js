import prisma from '../config/prismaClient.js';
import Joi from 'joi';

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

const convocatoriaModelSchema = Joi.object({
    nombre_convocatoria: Joi.string().required(),
    descripcion_convocatoria: Joi.string().required(),
    id_estado_convocatoria: Joi.number().required(),
    fecha_inicio: Joi.date().greater('now').required(),
    fecha_fin: Joi.date().required(),
    pago_inicio: Joi.date().required(),
    pago_fin: Joi.date().required(),
    competicion_inicio: Joi.date().required(),
    competicion_fin: Joi.date().required(),
}).custom((value, helpers) => {
    const {
        fecha_inicio,
        fecha_fin,
        pago_inicio,
        pago_fin,
        competicion_inicio,
        competicion_fin
    } = value;

    if (fecha_inicio >= fecha_fin) {
        return helpers.message('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    if (pago_inicio < fecha_inicio) {
        return helpers.message('El inicio del período de pago debe ser posterior a la fecha de inicio');
    }

    if (pago_fin <= pago_inicio) {
        return helpers.message('El fin del período de pago debe ser posterior al inicio del período de pago');
    }

    if (competicion_inicio <= pago_fin) {
        return helpers.message('El inicio de la competición debe ser posterior al fin del período de pago');
    }

    if (competicion_fin <= competicion_inicio) {
        return helpers.message('El fin de la competición debe ser posterior al inicio de la competición');
    }

    return value;
}, 'Validaciones cruzadas de fechas');

const crearConvocatoria = async (data) => {
    const { error, value } = convocatoriaModelSchema.validate(data, { abortEarly: false });

    if (error) {
        const messages = error.details.map((err) => err.message).join('; ');
        throw new Error(`Error al crear la convocatoria: ${messages}`);
    }

    return await prisma.convocatoria.create({
        data: value,
    });
};






export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    console.log(`Asignando área ${areaId} a convocatoria ${convocatoriaId}`);

    const asignacionExistente = await prisma.area_convocatoria.findFirst({
        where: {
            convocatoria_id: convocatoriaId,
            area_id: areaId
        }
    });

    if (asignacionExistente) {
        console.warn('Ya existe esta asignación.');
        return; // No continuar
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
        pago_fin: new Date(pago_fin),
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


/*export const asignarCategoriaAConvocatoria = async (convocatoriaId, categoriaId) => {
    return await prisma.categoria_convocatoria.create({
        data: { convocatoria_id: convocatoriaId, categoria_id: categoriaId }
    });
}*/

export const obtenerConvocatorias = async () => {
    const convocatorias = await prisma.convocatoria.findMany({
        include: {
            estado_convocatoria: true,
            _count: {
                select: {
                    Area_convocatoria: true,
                },
            },
        },
    });

    const estadoMapeado = {
        'EN INSCRIPCIONES': 'En inscripcion',
        'EN COMPETENCIA': 'En competencia',
        'FINALIZADO': 'Finalizado',
        'BORRADOR': 'Borrador',
        'EN PAGOS': 'En pagos'
    };

    return convocatorias.map(({ id_estado_convocatoria, estado_convocatoria, _count, ...convocatoria }) => ({
        ...convocatoria,
        estado: estadoMapeado[estado_convocatoria.nombre] || estado_convocatoria.nombre,
        numero_areas: _count.Area_convocatoria
    }));
};

//pasar un id y devolver la convocatoria con ese id
export const obtenerConvocatoriaPorId = async (id) => {
    return await prisma.convocatoria.findUnique({
        where: { id },
        include: {
            Area_convocatoria: {
                select: {
                    area_id: true // Incluir solo los IDs de las areas asociadas
                }
            }
        }
    });
};

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
        pago_inicio,
        pago_fin,
        competicion_inicio,
        competicion_fin,
        areaIds
    } = data;

    const updateData = {};
    if (nombre_convocatoria) updateData.nombre_convocatoria = nombre_convocatoria;
    if (descripcion_convocatoria) updateData.descripcion_convocatoria = descripcion_convocatoria;
    if (fecha_inicio) updateData.fecha_inicio = new Date(fecha_inicio);
    if (fecha_fin) updateData.fecha_fin = new Date(fecha_fin);
    if (pago_inicio) updateData.pago_inicio = new Date(pago_inicio);
    if (pago_fin) updateData.pago_fin = new Date(pago_fin);
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

export const obtenerNumerodeConvocatoriasActivas = async () => {
    const convocatorias = await prisma.convocatoria.findMany({
        where: {
            id_estado_convocatoria: { in: [2, 3] },
        },
    });

    return convocatorias.length;
};

export const obtenerUnaConvocatoriaActiva = async () => {
    const convocatoria = await prisma.convocatoria.findFirst({
        where: {
            id_estado_convocatoria: 2,
        },
        select: {
            nombre_convocatoria: true,
            descripcion_convocatoria: true,
            fecha_inicio: true,
            competicion_fin: true,
        },
    });

    return convocatoria;
};

export const visualizarConvocatoria = async (id) => {
    const convocatoria = await prisma.convocatoria.findUnique({
        where: { id: parseInt(id) },
        include: {
            estado_convocatoria: true,
            Area_convocatoria: {
                include: { area: true }
            }
        }
    });

    if (!convocatoria) {
        throw new Error('Convocatoria no encontrada');
    }

    // Mapeo de nombres de estado para mostrar en la interfaz
    const estadoMapeado = {
        'EN INSCRIPCIONES': 'En inscripcion',
        'EN COMPETENCIA': 'En competencia',
        'FINALIZADO': 'Finalizado',
        'BORRADOR': 'Borrador',
        'EN PAGOS': 'En pagos'
    };

    // Transformar la respuesta para simplificarla
    const respuestaSimplificada = {
        id: convocatoria.id,
        nombre_convocatoria: convocatoria.nombre_convocatoria,
        fecha_inicio: convocatoria.fecha_inicio,
        fecha_fin: convocatoria.fecha_fin,
        pago_inicio: convocatoria.pago_inicio,
        pago_fin: convocatoria.pago_fin,
        competicion_inicio: convocatoria.competicion_inicio,
        competicion_fin: convocatoria.competicion_fin,
        descripcion_convocatoria: convocatoria.descripcion_convocatoria,
        estado: estadoMapeado[convocatoria.estado_convocatoria.nombre] || convocatoria.estado_convocatoria.nombre, // Estado mapeado
        areas: convocatoria.Area_convocatoria.map(ac => ac.area.nombre_area) // Solo los nombres de las áreas
    };

    return respuestaSimplificada;
}

