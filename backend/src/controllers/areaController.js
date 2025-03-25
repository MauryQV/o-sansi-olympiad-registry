const areaService = require('../services/areaService');

const crearArea = async (req, res) => {
    const { nombre_area, cost, nombre_categoria, grado_min, grado_max } = req.body;

    if (!nombre_area || !cost || !nombre_categoria) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const area = await areaService.crearAreaConCategoria(nombre_area, cost, nombre_categoria, grado_min, grado_max);
        res.status(201).json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearArea };
