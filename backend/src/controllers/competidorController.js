import * as competidorService from '../services/competidorService.js';


export const crearCompetidor = async (req, res, next) => {
    try {
        const competidor = await competidorService.registrarCompetidor(req.body);

        res.status(201).json({
            message: 'competidor registrado corrctamente',
            competidor,
        });
    } catch (error) {
        console.error('no se pudo registrar', error.message);
        res.status(400).json({
            message: 'Error al registrar el competidor',
            error: error.message,
        });
    }
};

export const obtenerSolicitudesDelCompetidor = async (req, res, next) => {
    try {
        const solicitudes = await competidorService.obtenerSolicitudesDelCompetidor(req.user.id);
        res.status(200).json(solicitudes);
    } catch (error) {
        console.error('funciona pofavo:', error);
        next(error);
    }
};

export const obtenerInscripcionesCompetidor = async (req, res) => {
    try {
        console.log("=== Consultando inscripciones del competidor ===");
        console.log("Usuario:", req.user.id);
        
        const inscripciones = await competidorService.obtenerInscripcionesCompetidor(req.user.id);
        res.status(200).json({ inscripciones });
    } catch (error) {
        console.error('Error al obtener inscripciones del competidor:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener inscripciones', 
            error: error.message 
        });
    }
};
