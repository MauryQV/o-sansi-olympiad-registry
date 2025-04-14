import prisma from "../config/prismaClient.js";

export const getDepartamentos = async () => {
    return await prisma.departamento.findMany()
}

