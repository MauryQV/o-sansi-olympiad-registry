const supabase = require('../config/supabaseClient');

const inscribirCompetidor = async (req, res) => {
    try {
        const { id_competidor } = req;
        const { id_area } = req.body;

        // 📝 Insertar la inscripción con estado "pendiente"
        const { error: inscriptionError } = await supabase
            .from('inscription')
            .insert([{ id_competidor, id_area, status: 'pendiente', inscription_date: new Date() }]);

        if (inscriptionError) throw inscriptionError;

        res.json({ success: true, message: "Competidor inscrito correctamente en el área" });

    } catch (error) {
        res.status(500).json({ error: "Error en la inscripción", details: error.message });
    }
};


module.exports = { inscribirCompetidor };