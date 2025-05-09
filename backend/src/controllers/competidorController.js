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
