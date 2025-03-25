const supabase = require('../config/supabaseClient');

const crearArea = async (nombre_area, cost, id_categoria) => {
    const { data, error } = await supabase
        .from('area')
        .insert([{ nombre_area, cost }])
        .select()
        .single();

    if (error) throw new Error('Error al crear el área');

    // Relacionar el área con la categoría
    const { error: errorRelacion } = await supabase
        .from('area_categoria')
        .insert([{ id_area: data.id_area, id_categoria }]);

    if (errorRelacion) throw new Error('Error al asignar la categoría al área');

    return data;
};

module.exports = { crearArea };

