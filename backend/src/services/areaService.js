const supabase = require('../config/supabaseClient');

const crearAreaConCategoria = async (nombre_area, cost, nombre_categoria, grado_min, grado_max) => {
    try {
        let id_categoria;

        // 1. Buscar si la categoría ya existe
        const { data: categoriaExistente, error: errorCategoria } = await supabase
            .from('categoria')
            .select('id_categoria')
            .eq('nombre_categoria', nombre_categoria)
            .single();

        if (errorCategoria && errorCategoria.code !== 'PGRST116') {
            throw new Error('Error al buscar la categoría');
        }

        if (categoriaExistente) {
            id_categoria = categoriaExistente.id_categoria;
        } else {
            // 2. Crear nueva categoría si no existe
            const { data: nuevaCategoria, error: errorNuevaCategoria } = await supabase
                .from('categoria')
                .insert([{ nombre_categoria, grado_min, grado_max }])
                .select()
                .single();

            if (errorNuevaCategoria) throw new Error('Error al crear la categoría');
            id_categoria = nuevaCategoria.id_categoria;
        }

        // 3. Crear el área
        const { data: nuevaArea, error: errorArea } = await supabase
            .from('area')
            .insert([{ nombre_area, cost }])
            .select()
            .single();

        if (errorArea) throw new Error('Error al crear el área');

        // 4. Relacionar el área con la categoría
        const { error: errorRelacion } = await supabase
            .from('area_categoria')
            .insert([{ id_area: nuevaArea.id_area, id_categoria }]);

        if (errorRelacion) throw new Error('Error al asignar la categoría al área');

        return { id_area: nuevaArea.id_area, nombre_area, cost, id_categoria, nombre_categoria, grado_min, grado_max };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { crearAreaConCategoria };
