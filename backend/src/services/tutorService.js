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
});

// Crear nuevo tutor y usamos el esquema de joi 
export const crearTutor = async (data) => {
    const { error, value } = tutorSchema.validate(data);
    if (error) {
        throw new Error(`Datos inválidos: ${error.details[0].message}`);
    }

    const { nombre, apellido, correo_electronico, carnet_identidad, numero_celular } = value;

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
        throw new Error('Ya existe un usuario o tutor con es corre o carnet de identidad');
    }
    //hasheams la password
    const contraseñaGenerada = generarPassword();
    const hashedPassword = await bcrypt.hash(contraseñaGenerada, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            correo_electronico,
            rol_id: ROL_TUTOR_ID,
            password: hashedPassword,
        },
    });

    const tutor = await prisma.tutor.create({
        data: {
            usuario_id: usuario.id,
            carnet_identidad,
            numero_celular,
        },
    });

    return {
        tutor: {
            id: tutor.id,
            carnet_identidad,
            numero_celular,
            usuario_id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo_electronico: usuario.correo_electronico,
        },
        credenciales: {
            correo_electronico,
            contraseña: contraseñaGenerada,
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


export const buscarTutoresPorNombre = async (nombre) => {
    return await prisma.tutor.findMany({
        where: {
            usuario: {
                nombre: {
                    contains: nombre,
                    mode: 'insensitive'
                }
            }
        },
        include: {
            usuario: true
        }
    });
};
