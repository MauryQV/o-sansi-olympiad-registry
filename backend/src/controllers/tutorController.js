import * as tutorService from '../services/tutorService.js';

/**
 * Controlador para registrar un nuevo tutor
 */
export const registrarTutor = async (req, res, next) => {
    try {
        // Extraer datos del cuerpo de la petición
        const tutorData = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            carnet_identidad: req.body.carnet_identidad,
            correo_electronico: req.body.correo_electronico,
            telefono: req.body.telefono,
            password: req.body.password
        };
        
        console.log('Datos recibidos para registrar tutor:', {
            ...tutorData,
            password: '********' // No loguear la contraseña
        });
        
        // Registrar tutor usando el servicio
        const tutor = await tutorService.crearTutor(tutorData);
        
        // Devolver respuesta exitosa
        res.status(201).json({ 
            mensaje: 'Tutor registrado exitosamente',
            tutor: {
                id: tutor.id,
                nombre: tutor.nombre,
                apellido: tutor.apellido,
                carnet_identidad: tutor.carnet_identidad,
                correo_electronico: tutor.correo_electronico
            }
        });
    } catch (error) {
        console.error('Error en registrarTutor:', error);
        next(error);
    }
};

/**
 * Controlador para obtener todos los tutores
 */
export const obtenerTutores = async (req, res, next) => {
    try {
        // Obtener tutores del servicio
        const tutores = await tutorService.getTutores();
        
        // Formatear respuesta para incluir datos del usuario
        const formattedTutores = tutores.map(tutor => ({
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico
        }));
        
        res.status(200).json(formattedTutores);
    } catch (error) {
        console.error('Error en obtenerTutores:', error);
        next(error);
    }
};

/**
 * Controlador para obtener un tutor por ID
 */
export const obtenerTutorPorId = async (req, res, next) => {
    try {
        // Obtener tutor del servicio
        const tutor = await tutorService.getTutorById(req.params.id);
        
        if (!tutor) {
            return res.status(404).json({ error: 'Tutor no encontrado' });
        }
        
        // Formatear respuesta para incluir datos del usuario
        const formattedTutor = {
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico
        };
        
        res.status(200).json(formattedTutor);
    } catch (error) {
        console.error('Error en obtenerTutorPorId:', error);
        next(error);
    }
}; 