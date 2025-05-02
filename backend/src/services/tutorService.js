import prisma from '../config/prismaClient.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { generarPassword } from '../utils/passwordSecurity.js';

const ROL_TUTOR_ID = 4;

//joi
const tutorSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    apellido: Joi.string().min(2).max(50).required(),
    correo_electronico: Joi.string().email().required(),
    carnet_identidad: Joi.string().min(5).max(20).required(),
    numero_celular: Joi.string().pattern(/^\d{8,12}$/).required(),
    area_id: Joi.alternatives().try(
        Joi.string().required(),
        Joi.number().integer().required()
    ).required(),
});

// crear nuevo tutor y usamos el esquema de joi 
export const crearTutor = async (data) => {
    const { error, value } = tutorSchema.validate(data);
    if (error) {
        throw new Error(`Datos inválidos: ${error.details[0].message}`);
    }

    const { nombre, apellido, correo_electronico, carnet_identidad, numero_celular, area_id } = value;

    const existente = await prisma.usuario.findFirst({
        where: {
            OR: [
                { correo_electronico },
                { tutor: { carnet_identidad } },
            ],
        },
        include: { tutor: true },
    });

    if (existente) {
        throw new Error('Ya existe un usuario o tutor con ese correo o carnet de identidad');
    }

    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            correo_electronico,
            rol_id: ROL_TUTOR_ID,
            password: carnet_identidad, // carnet = contraseña
        },
    });

    const tutor = await prisma.tutor.create({
        data: {
            usuario_id: usuario.id,
            carnet_identidad,
            numero_celular,
            area_id,
        },
    });

    return {
        tutor: {
            id: tutor.id,
            area_id,
            carnet_identidad,
            numero_celular,
            usuario_id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo_electronico: usuario.correo_electronico,
        },
        credenciales: {
            correo_electronico,
            password: carnet_identidad, //devolvemos la contraseña 
        },
    };
};


export const getTutores = async () => {
    return await prisma.tutor.findMany({
        include: { usuario: true },
    });
};

export const getTutorById = async (id) => {
    return await prisma.tutor.findUnique({
        where: { id },
        include: { usuario: true },
    });
};

export const buscarTutoresPorNombreYArea = async (id_area, nombre) => {
    return await prisma.tutor.findMany({
        where: {
            area_id: id_area,
            usuario: {
                nombre: {
                    contains: nombre,
                    mode: 'insensitive',
                },
            },
        },
        include: {
            usuario: true,
        },
    });
};

export const obtenerSolicitudesPendientes = async (tutorUsuarioId) => {
    const tutor = await prisma.tutor.findUnique({
        where: { usuario_id: tutorUsuarioId }
    });

    if (!tutor) {
        throw new Error('No se encontró el tutor.');
    }

    const solicitudes = await prisma.inscripcion_tutor.findMany({
        where: {
            tutor_id: tutor.id,
            aprobado: false
        },
        include: {
            inscripcion: true,
            competidor: {
                include: {
                    usuario: true,
                    colegio: true,
                    provincia: {
                        include: {
                            departamento: true
                        }
                    }
                }
            }
        }
    });

    return solicitudes.map((s) => ({
        id: s.id,
        competidor: {
            nombre: s.competidor.usuario.nombre,
            apellido: s.competidor.usuario.apellido,
            colegio: s.competidor.colegio.nombre_colegio,
            provincia: s.competidor.provincia.nombre_provincia,
            departamento: s.competidor.provincia.departamento.nombre_departamento
        },
        fecha_inscripcion: s.inscripcion.fecha_inscripcion,
        estado: s.inscripcion.estado_inscripcion
    }));
};


