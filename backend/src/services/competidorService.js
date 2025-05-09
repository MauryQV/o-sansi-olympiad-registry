import prisma from '../config/prismaClient.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { generarPassword } from '../utils/passwordSecurity.js';


const ROL_COMPETIDOR_ID = 2;

const competidorSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    apellido: Joi.string().min(2).max(50).required(),
    correo_electronico: Joi.string().email().required(),
    carnet_identidad: Joi.string().min(5).max(20).required(),
    fecha_nacimiento: Joi.date().iso().required(),
    colegio_id: Joi.number().integer().required(),
    provincia_id: Joi.number().integer().required(),
});



export const registrarCompetidor = async (data) => {
    const { error, value } = competidorSchema.validate(data);
    if (error) {
        throw new Error(`Datos inválidos: ${error.details[0].message}`);
    }

    const {
        nombre,
        apellido,
        correo_electronico,
        carnet_identidad,
        fecha_nacimiento,
        colegio_id,
        provincia_id,
    } = value;

    const existente = await prisma.usuario.findFirst({
        where: {
            OR: [
                { correo_electronico },
                { competidor: { carnet_identidad } },
            ],
        },
        include: { competidor: true },
    });

    if (existente) {
        throw new Error('Ya existe un usuario o competidor con ese correo o carnet');
    }


    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            correo_electronico,
            rol_id: ROL_COMPETIDOR_ID,
            password: carnet_identidad,
        },
    });

    const competidor = await prisma.competidor.create({
        data: {
            usuario_id: usuario.id,
            carnet_identidad,
            fecha_nacimiento: new Date(fecha_nacimiento),
            colegio_id,
            provincia_id,
        },
        include: {
            colegio: true,
            provincia: {
                include: {
                    departamento: true,
                },
            },
            usuario: true,
        },
    });

    return {
        competidor,
        credenciales: {
            correo_electronico,
            contraseña: carnet_identidad,
        },
    };
};

export const obtenerSolicitudesDelCompetidor = async (usuarioId) => {
    const competidor = await prisma.competidor.findUnique({
        where: { usuario_id: usuarioId }
    });

    if (!competidor) {
        throw new Error('No se encontró el competidor.');
    }

    const inscripciones = await prisma.inscripcion_tutor.findMany({
        where: {
            inscripcion: {
                competidor_id: competidor.id
            }
        },
        include: {
            inscripcion: true,
            tutor: {
                include: {
                    usuario: true
                }
            }
        }
    });

    const agrupadas = {};

    for (const item of inscripciones) {
        const idIns = item.inscripcion_id;

        if (!agrupadas[idIns]) {
            agrupadas[idIns] = {
                inscripcionId: idIns,
                fecha: item.inscripcion.fecha_inscripcion,
                estado: item.inscripcion.estado_inscripcion,
                tutores: []
            };
        }

        agrupadas[idIns].tutores.push({
            nombre: item.tutor.usuario.nombre,
            apellido: item.tutor.usuario.apellido,
            aprobado: item.aprobado,
            fecha_aprobacion: item.fecha_aprobacion
        });
    }

    return Object.values(agrupadas);
};
