import prisma from "../config/prismaClient.js";

export const getDepartamentos = async () => {
    return await prisma.departamento.findMany({
        select: {
            id: true,
            nombre_departamento: true,
        },
    });
};

export const getProvinciasByDepartamento = async (departamentoId) => {
    return await prisma.provincia.findMany({
        where: { departamento_id: departamentoId },
        select: {
            id: true,
            nombre_provincia: true,
        },
    });
};

// Obtener colegios por provincia
export const getColegiosByProvincia = async (provinciaId) => {
    return await prisma.colegio.findMany({
        where: { provincia_id: provinciaId },
        select: {
            id: true,
            nombre_colegio: true,
        },
    });
};