const supabase = require('../config/supabaseClient');


const verificarCompetidor = async (req, res, next) => {
    const { carnet_identidad, id_area } = req.body;


    const { data: existingCompetidor, error: selectError } = await supabase
        .from('competidor')
        .select('id_competidor')
        .eq('carnet_identidad', carnet_identidad)
        .maybeSingle();

    if (selectError) {
        return res.status(500).json({ error: "Error al verificar competidor" });
    }

    if (!existingCompetidor) {
        return res.status(400).json({ error: "El competidor no está registrado en el sistema" });
    }

    const id_competidor = existingCompetidor.id_competidor;

    // 🔎 2. Verificar cuántas inscripciones tiene el competidor
    const { data: inscripciones, error: inscriptionError } = await supabase
        .from('inscription')
        .select('id_area')
        .eq('id_competidor', id_competidor);

    if (inscriptionError) {
        return res.status(500).json({ error: "Error al verificar inscripciones previas" });
    }


    const totalInscripciones = inscripciones.length;
    const yaInscritoEnArea = inscripciones.some(inscripcion => inscripcion.id_area === id_area);

    if (yaInscritoEnArea) {
        return res.status(400).json({ error: "El competidor ya está inscrito en esta área" });
    }

    if (totalInscripciones >= 2) {
        return res.status(400).json({ error: "El competidor ya alcanzó el máximo de 2 inscripciones en distintas áreas" });
    }

    req.id_competidor = id_competidor;
    next();
};

module.exports = {

    verificarCompetidor
}