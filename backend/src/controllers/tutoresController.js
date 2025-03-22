const supabase = require('../config/supabaseClient');
const { buscarTutores } = require('../services/tutoresService');


const buscarTutoresController = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query?.trim()) {
            return res.status(400).json({ error: 'Término de búsqueda requerido' });
        }


        const tutores = await buscarTutores(query);

        res.status(200).json(tutores);

    } catch (error) {
        console.error('Error de controladoxddd ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const getAllTutores = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tutor')
            .select('*');


        if (error) {
            console.error('Error en Supabase:', error);
            return res.status(500).json({
                error: 'Error al obtener tutores',
                details: error.message
            });
        }

        res.status(200).json(data);

    } catch (error) {

        console.error('Error inesperado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

const getTutorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const { data, error } = await supabase
            .from('tutor')
            .select('*')
            .eq('id_tutor', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Tutor no encontrado' });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tutor :,v' });
    }
};


const createTutor = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo } = req.body;

        // Insertar el tutor (ya se verificó duplicado en el middleware)
        const { data: newTutor, error: insertError } = await supabase
            .from('tutor')
            .insert([{ nombre, apellido, telefono, correo }])
            .select();

        if (insertError) throw insertError;

        res.status(201).json(newTutor[0]);

    } catch (error) {
        console.error('Error en createTutor:', error);
        res.status(500).json({ error: 'Error al crear tutor' });
    }
};

const deleteTutor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const { error } = await supabase
            .from('tutor')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Tutor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tutor' });
    }
};

module.exports =
{
    deleteTutor,
    createTutor,
    getAllTutores,
    getTutorById,
    buscarTutoresController
}