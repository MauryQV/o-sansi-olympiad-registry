const supabase = require('../config/supabaseClient');

const obtenerCategorias = async () => {
    const { data, error } = await supabase
        .from('categoria')
        .select('*');

    if (error) throw new Error('Error al obtener categorías');

    return data;
};

const crearCategoria = async (nombre_categoria, grado_min, grado_max) => {
    const { data, error } = await supabase
        .from('categoria')
        .insert([{ nombre_categoria, grado_min, grado_max }])
        .select()
        .single();

    if (error) throw new Error('Error al crear la categoría');

    return data;
};

module.exports = { obtenerCategorias, crearCategoria };
