import prisma from '../config/prismaClient.js';
import supabase from '../config/supabaseClient.js';

/**
 * Crea un nuevo tutor y su usuario asociado
 */
export const crearTutor = async (tutorData) => {
    try {
        // Verificar si ya existe un usuario con el mismo correo electrónico
        const usuarioExistente = await prisma.usuario.findFirst({
            where: {
                correo_electronico: tutorData.correo_electronico
            }
        });

        if (usuarioExistente) {
            throw new Error('Ya existe un usuario registrado con este correo electrónico');
        }

        // Verificar si ya existe un tutor con el mismo carnet de identidad
        const tutorExistente = await prisma.tutor.findFirst({
            where: {
                carnet_identidad: tutorData.carnet_identidad
            }
        });

        if (tutorExistente) {
            throw new Error('Ya existe un tutor registrado con este carnet de identidad');
        }

        // Registrar usuario en Supabase para autenticación
        const { data: userData, error } = await supabase.auth.signUp({
            email: tutorData.correo_electronico,
            password: tutorData.password
        });

        if (error) {
            throw new Error('Error al registrar el usuario: ' + error.message);
        }

        // Obtener rol de tutor
        const tutorRole = await prisma.rol.findFirst({
            where: {
                nombre: 'tutor'
            }
        });

        if (!tutorRole) {
            throw new Error('Rol de tutor no encontrado en el sistema');
        }

        // Crear primero el usuario con los datos personales
        const usuario = await prisma.usuario.create({
            data: {
                id: userData.user.id,
                correo_electronico: tutorData.correo_electronico,
                nombre: tutorData.nombre,
                apellido: tutorData.apellido,
                rol_id: tutorRole.id
            }
        });

        // Luego crear el tutor relacionado con el usuario
        const tutor = await prisma.tutor.create({
            data: {
                usuario_id: usuario.id,
                carnet_identidad: tutorData.carnet_identidad
            },
            include: {
                usuario: true
            }
        });

        // El objeto resultante ya incluye usuario con todos los datos personales
        return {
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico
        };
    } catch (error) {
        console.error('Error en crearTutor:', error);
        throw error;
    }
};

/**
 * Obtiene todos los tutores con sus datos de usuario
 */
export const getTutores = async () => {
    try {
        return await prisma.tutor.findMany({
            include: {
                usuario: true
            }
        });
    } catch (error) {
        console.error('Error en getTutores:', error);
        throw error;
    }
};

/**
 * Obtiene un tutor por ID con sus datos de usuario
 */
export const getTutorById = async (id) => {
    try {
        return await prisma.tutor.findUnique({
            where: { id },
            include: {
                usuario: true
            }
        });
    } catch (error) {
        console.error('Error en getTutorById:', error);
        throw error;
    }
};

/**
 * Valida el formato del carnet de identidad (7 dígitos numéricos)
 */
export const validarCarnetIdentidad = (carnet) => {
    const regex = /^\d{7}$/;
    return regex.test(carnet);
};

/**
 * Valida el formato de correo electrónico
 */
export const validarCorreoElectronico = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
};

/**
 * Valida el formato del número de teléfono (celular boliviano)
 */
export const validarTelefono = (telefono) => {
    const regex = /^[67]\d{7}$/;
    return regex.test(telefono);
}; 