const supabase = require('../config/supabaseClient');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categoria').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear una categoría con rango de grados
const createCategoria = async (req, res) => {
    const { nombre_categoria, grado_min, grado_max } = req.body;

    try {
        const { data, error } = await supabase
            .from('categoria')
            .insert([{ nombre_categoria, grado_min, grado_max }]);

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getCategorias, createCategoria };
