const supabase = require('../config/supabaseClient');


const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email }]);

        if (error) throw error;

        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ name, email })
            .eq('id', id);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};