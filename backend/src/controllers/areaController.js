const areaService = require('../services/areaService');

const createArea = async (req, res) => {
    const { nombre_area, cost, id_categoria } = req.body;

    if (!nombre_area || !cost || !id_categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const area = await areaService.crearArea(nombre_area, cost, id_categoria);
        res.status(201).json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createArea };

