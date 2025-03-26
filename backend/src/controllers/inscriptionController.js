const { inscribirCompetidor } = require('../services/inscriptionService');

const inscribir = async (req, res) => {
    try {
        const result = await inscribirCompetidor(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error en inscripción:', error);
        res.status(500).json({ error: 'Error al inscribir competidor' });
    }
};

module.exports = { inscribir };
