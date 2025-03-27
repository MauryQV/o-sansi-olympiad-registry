const supabase = require('../config/supabaseClient');

/**
 * Obtener todos los competidores
 */
const getAllCompetidores = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('competidores')
            .select('*');

        if (error) {
            console.error('Error al obtener competidores:', error);
            return res.status(500).json({
                error: 'Error al obtener competidores',
                details: error.message
            });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message || 'Error desconocido'
        });
    }
};

/**
 * Obtener un competidor por su ID
 */
const getCompetidorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID del competidor requerido' });
        }

        const { data, error } = await supabase
            .from('competidores')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Competidor no encontrado' });
            }
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Competidor no encontrado' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener competidor:', error);
        res.status(500).json({ 
            error: 'Error al obtener competidor',
            details: error.message || 'Error desconocido'
        });
    }
};

/**
 * Crear un nuevo competidor
 * La validación de datos y duplicados se hace en los middlewares
 */
const createCompetidor = async (req, res) => {
    try {
        const { nombre, apellido, area, email } = req.body;

        // Insertar el competidor
        const { data: newCompetidor, error: insertError } = await supabase
            .from('competidores')
            .insert([{ nombre, apellido, area, email }])
            .select();

        if (insertError) {
            console.error('Error al insertar competidor:', insertError);
            return res.status(500).json({ 
                error: 'Error al crear competidor', 
                details: insertError.message 
            });
        }

        if (!newCompetidor || newCompetidor.length === 0) {
            return res.status(500).json({ error: 'No se pudo crear el competidor' });
        }

        res.status(201).json(newCompetidor[0]);
    } catch (error) {
        console.error('Error en createCompetidor:', error);
        res.status(500).json({ 
            error: 'Error al crear competidor',
            details: error.message || 'Error desconocido'
        });
    }
};

/**
 * Eliminar un competidor por su ID
 */
const deleteCompetidor = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID del competidor requerido' });
        }

        // Verificar si el competidor existe antes de intentar eliminarlo
        const { data: existingCompetidor, error: searchError } = await supabase
            .from('competidores')
            .select('id')
            .eq('id', id)
            .single();

        if (searchError && searchError.code !== 'PGRST116') {
            console.error('Error al buscar competidor:', searchError);
            return res.status(500).json({ 
                error: 'Error al verificar competidor', 
                details: searchError.message 
            });
        }

        if (!existingCompetidor) {
            return res.status(404).json({ error: 'Competidor no encontrado' });
        }

        // Eliminar el competidor
        const { error: deleteError } = await supabase
            .from('competidores')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error al eliminar competidor:', deleteError);
            return res.status(500).json({ 
                error: 'Error al eliminar competidor', 
                details: deleteError.message 
            });
        }

        res.status(200).json({ message: 'Competidor eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteCompetidor:', error);
        res.status(500).json({ 
            error: 'Error al eliminar competidor',
            details: error.message || 'Error desconocido' 
        });
    }
};

/**
 * Buscar competidores por nombre, apellido o email
 */
const buscarCompetidores = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query?.trim()) {
            return res.status(400).json({ error: 'Término de búsqueda requerido' });
        }

        const { data, error } = await supabase
            .from('competidores')
            .select('*')
            .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,email.ilike.%${query}%`);

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error en buscarCompetidores:', error);
        res.status(500).json({ 
            error: 'Error al buscar competidores',
            details: error.message || 'Error desconocido'
        });
    }
};

module.exports = {
    getAllCompetidores,
    getCompetidorById,
    createCompetidor,
    deleteCompetidor,
    buscarCompetidores
}; 