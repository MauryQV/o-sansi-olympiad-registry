import * as competidorService from '../services/competidorService.js';


export const crearCompetidor = async (req, res, next) => {
    try {
        const competidor = await competidorService.registrarCompetidor(req.body);

        res.status(201).json({
            message: 'Competidor registrado correctamente',
            competidor,
        });
    } catch (error) {
        console.error('[ERROR REGISTRAR COMPETIDOR]', error.message);
        res.status(400).json({
            message: 'Error al registrar el competidor',
            error: error.message,
        });
    }
};