import prisma from '../config/prismaClient.js';

export const crearConvocatoria = async (data) => {
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
};

export const asignarAreaAConvocatoria = async (convocatoriaId, areaId) => {
    // Verificar si el área ya está asignada a esta convocatoria
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

export const obtenerConvocatorias = async () => {
    return await prisma.convocatoria.findMany({
        include: { Area_convocatoria: true }
    });
};
