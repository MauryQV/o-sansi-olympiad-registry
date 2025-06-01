import * as tutorService from '../services/tutorService.js';
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { validarToken } from '../utils/jwtUtils.js';

//registrar un nuevo tutor
export const registrarTutor = async (req, res, next) => {
    try {
        const { nombre, apellido, correo_electronico, carnet_identidad, numero_celular, area_id } = req.body;

        // servicio para crear el tutor
        const nuevoTutor = await tutorService.crearTutor({
            nombre,
            apellido,
            correo_electronico,
            carnet_identidad,
            numero_celular,
            area_id,
        });

        res.status(201).json({
            mensaje: 'Tutor registrado exitosamente',
            tutor: nuevoTutor.tutor,
            credenciales: nuevoTutor.credenciales, // Devolver credenciales (correo y contraseña)
        });
    } catch (error) {
        console.error('Error al registrar tutor:', error.message);
        res.status(500).json({ error: 'Error en el servidor al registrar tutor' });
    }
};

/**
 * Obtiene todos los tutores disponibles para inscripción
 */
export const obtenerTutoresDisponibles = async (req, res) => {
    try {
        console.log("Obteniendo tutores disponibles");
        const tutores = await prisma.tutor.findMany({
            include: {
                usuario: true,
                area: true
            }
        });

        const tutoresFormateados = tutores.map(tutor => ({
            id: tutor.id,
            nombre: `${tutor.usuario.nombre} ${tutor.usuario.apellido}`,
            correo: tutor.usuario.correo_electronico,
            telefono: tutor.numero_celular,
            area: tutor.area.nombre_area
        }));

        res.status(200).json(tutoresFormateados);
    } catch (error) {
        console.error('Error al obtener tutores disponibles:', error);
        res.status(500).json({ error: 'Error en el servidor al obtener tutores disponibles' });
    }
};

// Obtener todos los tutores
export const obtenerTutores = async (req, res, next) => {
    try {
        const tutores = await prisma.tutor.findMany({
            include: {
                usuario: true,
                area: true
            }
        });

        const respuesta = tutores.map(tutor => ({
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            numero_celular: tutor.numero_celular,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico,
            area: tutor.area.nombre_area
        }));

        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error en obtenerTutores:', error);
        res.status(500).json({ error: 'Error al obtener tutores' });
    }
};

// Obtener tutor por ID
export const obtenerTutorPorId = async (req, res, next) => {
    try {
        const tutor = await prisma.tutor.findFirst({
            where: { id: req.params.id },
            include: {
                usuario: true,
                area: true
            }
        });

        if (!tutor) {
            return res.status(404).json({ error: 'Tutor no encontrado' });
        }

        res.status(200).json({
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            numero_celular: tutor.numero_celular,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico,
            area: tutor.area.nombre_area
        });
    } catch (error) {
        console.error('Error en obtenerTutorPorId:', error);
        res.status(500).json({ error: 'Error al obtener tutor por ID' });
    }
};

/*export const buscarTutores = async (req, res) => {
    try {
        const { nombre, area } = req.query;

        if (!nombre || nombre.length < 3) {
            return res.status(400).json({ error: 'Se requiere al menos 3 caracteres para la búsqueda' });
        }

        console.log("Buscando tutores con nombre:", nombre, "y área:", area || "cualquiera");

        // Construir filtro para la búsqueda usando OR con contains
        let filtro = {
            OR: [
                {
                    usuario: {
                        nombre: {
                            contains: nombre,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    usuario: {
                        apellido: {
                            contains: nombre,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        };

        // Si se especifica un área, filtrar por ella también
        if (area && area !== 'null' && area !== 'undefined' && area !== '') {
            console.log(`Filtrando por área específica: ${area}`);
            filtro = {
                AND: [
                    filtro,
                    {
                        area: {
                            nombre_area: {
                                equals: area,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            };
        }

        console.log("Filtro de búsqueda:", JSON.stringify(filtro));

        const tutores = await prisma.tutor.findMany({
            where: filtro,
            include: {
                usuario: true,
                area: true
            },
            take: 10 // Limitar a 10 resultados
        });

        console.log(`Encontrados ${tutores.length} tutores`);

        const tutoresFormateados = tutores.map(tutor => ({
            id: tutor.id,
            nombre: `${tutor.usuario.nombre} ${tutor.usuario.apellido}`,
            correo: tutor.usuario.correo_electronico,
            telefono: tutor.numero_celular,
            area: tutor.area.nombre_area
        }));

        res.status(200).json(tutoresFormateados);
    } catch (error) {
        console.error('Error al buscar tutores:', error);
        res.status(500).json({ error: 'Error en el servidor al buscar tutores' });
    }
};
*/

export const getSolicitudesPendientes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const solicitudes = await tutorService.obtenerSolicitudesPendientes(usuarioId);
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({
            error: error.message || 'Error al cargar solicitudes pendientes.'
        });
    }
};


export const obtenerTutoresFiltrados = async (req, res) => {
    try {
        const { id_area, nombre } = req.query; // Obtener parámetros de consulta
        const tutores = await tutorService.buscarTutores(id_area, nombre);

        // Formatear los datos para devolver el nombre completo, teléfono y correo
        const resultado = tutores.map((tutor) => ({
            id: tutor.id,
            nombre_completo: `${tutor.usuario.nombre} ${tutor.usuario.apellido}`,
            telefono: tutor.numero_celular,
            correo: tutor.usuario.correo_electronico,
        }));

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener tutores filtrados:', error);
        res.status(500).json({ error: 'Error al obtener tutores filtrados.' });
    }
};

export const obtenerSolicitudesPendientesView = async (req, res) => {
    try {
        const solicitudes = await tutorService.obtenerSolicitudesView();
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error('Error real:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes pendientes.' });
    }
};

export const obtenerCompetidoresAsignados = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        //console.log("=== Obteniendo inscripciones de competidores asignados al tutor ===");
        //console.log("Tutor usuario ID:", usuarioId);

        const inscripciones = await tutorService.obtenerInscripcionesCompetidores(usuarioId);
        console.log(`Encontradas ${inscripciones.length} inscripciones asignadas`);

        res.status(200).json({ inscripciones });
    } catch (error) {
        console.error('Error al obtener inscripciones de competidores:', error);
        res.status(500).json({
            error: error.message || 'Error al cargar inscripciones de competidores.'
        });
    }
};
