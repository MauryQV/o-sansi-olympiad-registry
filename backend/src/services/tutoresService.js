const supabase = require('../config/supabaseClient');

const buscarTutores = async (query) => {
    try {

        const { data, error } = await supabase
            .from('tutor')
            .select('*')
            .or(
                `nombre.ilike.%${query}%,apellido.ilike.%${query}%,correo.ilike.%${query}%`
            );

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error en buscarTutores:', error);
        throw new Error('Error al buscar tutores test');
    }
};

module.exports = {
    buscarTutores
}