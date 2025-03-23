const supabase = require('../config/supabaseClient')

const getAreas = async (req, res) => {
    try {
        const { data, error } = await supabase.from('area').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un área
const createArea = async (req, res) => {
    const { name_area, categoria_id } = req.body;

    try {
        const { data, error } = await supabase
            .from('area')
            .insert([{ name_area, categoria_id }]);

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAreas, createArea };