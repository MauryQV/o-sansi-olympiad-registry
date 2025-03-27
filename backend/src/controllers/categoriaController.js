const categoriaService = require('../services/categoriaService');

const getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCategoria = async (req, res) => {
    const { nombre_categoria, grado_min, grado_max } = req.body;

    if (!nombre_categoria || grado_min == null || grado_max == null) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const categoria = await categoriaService.crearCategoria(nombre_categoria, grado_min, grado_max);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCategorias, createCategoria };
