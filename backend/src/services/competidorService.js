import prisma from '../config/prismaClient.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';


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


function generarPassword() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 10; i++) {
        pass += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return pass;
}

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

    const contraseñaGenerada = generarPassword();

    const hashedPassword = await bcrypt.hash(contraseñaGenerada, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            correo_electronico,
            rol_id: ROL_COMPETIDOR_ID,
            password: hashedPassword,
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
            contraseña: contraseñaGenerada,
        },
    };
};
