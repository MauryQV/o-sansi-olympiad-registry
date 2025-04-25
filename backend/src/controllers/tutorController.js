import * as tutorService from '../services/tutorService.js';

// Registrar tutor
export const registrarTutor = async (req, res, next) => {
    try {
        const tutorData = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            carnet_identidad: req.body.carnet_identidad,
            correo_electronico: req.body.correo_electronico,
            numero_celular: req.body.numero_celular,
        };

        const { tutor, credenciales } = await tutorService.crearTutor(tutorData);

        // Enviar credenciales al frontend para que las maneje (por ejemplo: enviarlas por email)
        res.status(201).json({
            mensaje: 'Tutor registrado exitosamente',
            tutor,
            credenciales,
        });
    } catch (error) {
        console.error('Error en registrarTutor:', error.message);
        next(error);
    }
};

// Obtener todos los tutores
export const obtenerTutores = async (req, res, next) => {
    try {
        const tutores = await tutorService.getTutores();

        const respuesta = tutores.map(tutor => ({
            id: tutor.id,
            carnet_identidad: tutor.carnet_identidad,
            numero_celular: tutor.numero_celular,
            nombre: tutor.usuario.nombre,
            apellido: tutor.usuario.apellido,
            correo_electronico: tutor.usuario.correo_electronico,
        }));

        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error en obtenerTutores:', error.message);
        next(error);
    }
};

// Obtener tutor por ID
export const obtenerTutorPorId = async (req, res, next) => {
    try {
        const tutor = await tutorService.getTutorById(req.params.id);

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
        });
    } catch (error) {
        console.error('Error en obtenerTutorPorId:', error.message);
        next(error);
    }
};

export const buscarTutores = async (req, res, next) => {
    try {
        const { nombre } = req.query;

        if (!nombre || nombre.length < 2) {
            return res.status(400).json({ error: 'Debe ingresar al menos 2 letras para buscar' });
        }

        const resultados = await tutorService.buscarTutoresPorNombre(nombre);

        const formateado = resultados.map(t => ({
            id: t.id,
            nombre: t.usuario.nombre,
            apellido: t.usuario.apellido,
        }));

        res.status(200).json(formateado);
    } catch (error) {
        console.error('Error en buscarTutores:', error.message);
        next(error);
    }
};
