const supabase = require('../config/supabaseClient');
const verificarDuplicado = async (req, res, next) => {
    try {
        const { correo } = req.body;

        const { data: existingTutor, error: searchError } = await supabase
            .from('tutor')
            .select('*')
            .eq('correo', correo)
            .single();

        if (searchError && searchError.code !== 'PGRST116') {
            throw searchError;
        }

        if (existingTutor) {
            return res.status(400).json({ error: 'Ya existe un tutor con este correo' });
        }

        next(); // el proceso se va al controlador

    } catch (error) {
        console.error('Error en verificarDuplicado:', error);
        res.status(500).json({ error: 'Error al verificar duplicados' });
    }
};

module.exports = {

    verificarDuplicado
}