import * as tutorService from '../services/tutorService.js';
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { validarToken } from '../utils/jwtUtils.js';

// Registrar tutor
export const registrarTutor = async (req, res, next) => {
    try {
        const { nombre, apellido, correo_electronico, password, carnet_identidad, numero_celular, area_id } = req.body;

        // Verificar si ya existe un usuario con ese correo
        const usuarioExistente = await prisma.usuario.findFirst({
            where: { correo_electronico: correo_electronico }
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Verificar si ya existe un tutor con ese CI
        const tutorExistente = await prisma.tutor.findFirst({
            where: { carnet_identidad: carnet_identidad }
        });

        if (tutorExistente) {
            return res.status(400).json({ error: 'El carnet de identidad ya está registrado' });
        }

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario con rol de tutor (rol_id 2)
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                correo_electronico,
                password: passwordHash,
                rol_id: 2, // Rol de tutor
            }
        });

        // Crear tutor asociado al usuario
        const nuevoTutor = await prisma.tutor.create({
            data: {
                usuario_id: nuevoUsuario.id,
                carnet_identidad,
                numero_celular,
                area_id: parseInt(area_id)
            }
        });

        res.status(201).json({
            mensaje: 'Tutor registrado exitosamente',
            tutor: {
                id: nuevoTutor.id,
                nombre,
                apellido,
                correo: correo_electronico,
                area_id
            }
        });
    } catch (error) {
        console.error('Error al registrar tutor:', error);
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

export const buscarTutores = async (req, res) => {
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