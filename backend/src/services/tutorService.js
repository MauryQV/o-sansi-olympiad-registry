import prisma from '../config/prismaClient.js';
import Joi from 'joi';
import { generarPassword } from '../utils/passwordSecurity.js';
import { supabase } from '../config/supabaseClient.js';

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

    // Crear el usuario con el carnet_identidad como contraseña
    const usuario = await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            correo_electronico,
            rol_id: ROL_TUTOR_ID,
            password: carnet_identidad, // Usamos el carnet como contraseña
        },
    });

    // Crear el tutor asociado al usuario
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
            password: carnet_identidad, // Devolvemos el carnet como contraseña
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
        throw new Error('Este usuario no tiene perfil de tutor.');
    }

    const solicitudes = await prisma.inscripcion_tutor.findMany({
        where: {
            tutor_id: tutor.id,
            aprobado: false
        },
        select: {
            inscripcion: {
                select: {
                    id: true,
                    fecha_inscripcion: true,
                    estado_inscripcion: true,
                    competidor: {
                        select: {
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellido: true
                                }
                            }
                        }
                    },
                    area: {
                        select: {
                            nombre_area: true
                        }
                    },
                    categoria: {
                        select: {
                            nombre_categoria: true,
                            grado_min: {
                                select: {
                                    nombre_grado: true,
                                    nivel: {
                                        select: {
                                            nombre_nivel: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return solicitudes.map((s) => ({
        solicitud_id: s.inscripcion.id,
        nombre_completo: `${s.inscripcion.competidor.usuario.nombre} ${s.inscripcion.competidor.usuario.apellido}`,
        area_nombre: s.inscripcion.area.nombre_area,
        categoria_nombre: s.inscripcion.categoria.nombre_categoria,
        grado: s.inscripcion.categoria.grado_min.nombre_grado,
        nivel: s.inscripcion.categoria.grado_min.nivel.nombre_nivel,
        rol: 'Tutor',
        estado: s.inscripcion.estado_inscripcion
    }));
};

export const obtenerInscripcionesCompetidores = async (tutorUsuarioId) => {
    const tutor = await prisma.tutor.findUnique({
        where: { usuario_id: tutorUsuarioId }
    });

    if (!tutor) {
        throw new Error('Este usuario no tiene perfil de tutor.');
    }

    // Obtener todas las inscripciones donde este tutor está asignado
    const inscripciones = await prisma.inscripcion_tutor.findMany({
        where: {
            tutor_id: tutor.id,
        },
        include: {
            inscripcion: {
                include: {
                    competidor: {
                        include: {
                            usuario: true,
                            colegio: true
                        }
                    },
                    area: true,
                    categoria: {
                        include: {
                            grado_min: {
                                include: {
                                    nivel: true
                                }
                            }
                        }
                    },
                    convocatoria: true
                }
            }
        }
    });

    // Formatear la respuesta para el frontend
    return inscripciones.map(inscripcionTutor => {
        const inscripcion = inscripcionTutor.inscripcion;
        const competidor = inscripcion.competidor;

        return {
            id: inscripcion.id,
            estudiante: `${competidor.usuario.nombre} ${competidor.usuario.apellido}`,
            area: inscripcion.area.nombre_area,
            categoria: inscripcion.categoria.nombre_categoria,
            grado: inscripcion.categoria.grado_min.nombre_grado,
            nivel: inscripcion.categoria.grado_min.nivel.nombre_nivel,
            colegio: competidor.colegio.nombre_colegio,
            email: competidor.usuario.correo_electronico,
            ci: competidor.carnet_identidad,
            fecha_inscripcion: inscripcion.fecha_inscripcion,
            estado: inscripcion.estado_inscripcion,
            aprobado: inscripcionTutor.aprobado,
            fecha_aprobacion: inscripcionTutor.fecha_aprobacion
        };
    });
};


export const buscarTutores = async (id_area, nombre) => {
    return await prisma.tutor.findMany({
        where: {
            ...(id_area && { area_id: parseInt(id_area, 10) }), // Filtrar por área si se proporciona
            ...(nombre && {
                usuario: {
                    OR: [
                        { nombre: { contains: nombre, mode: 'insensitive' } },
                        { apellido: { contains: nombre, mode: 'insensitive' } },
                    ],
                },
            }), // filtrar por nombre y/o apellido
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    correo_electronico: true,
                },
            },
        },
    });
};


export const obtenerSolicitudesView = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('public.SolicitudesPendientesTutor') // Asegúrate que el nombre es correcto
            .select('*');
        if (error) {
            console.error('Error de Supabase:', error); // <-- Esto mostrará el error real de la consulta
            throw new Error('Error al obtener las solicitudes pendientes');
        }
        res.json(data);
    } catch (error) {
        console.error('Error real:', error); // Esto mostrará el error lanzado arriba
        res.status(500).json({ error: 'Error al obtener solicitudes pendientes.' });
    }
};


