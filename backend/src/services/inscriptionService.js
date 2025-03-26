const supabase = require('../config/supabaseClient');

const inscribirCompetidor = async (competidorData) => {
    const { nombre, apellido, carnet_identidad, fecha_nacimiento, correo_electronico, id_provincia, id_escuela } = competidorData;

    const { data: existingCompetidor, error: selectError } = await supabase
        .from('competidor')
        .select('id_competidor')
        .eq('carnet_identidad', carnet_identidad)
        .maybeSingle(); // 🔹 Usa maybeSingle() para evitar error si no encuentra nada

    if (selectError) throw selectError;

    let id_competidor;

    if (existingCompetidor) {
        id_competidor = existingCompetidor.id_competidor;
    } else {
        const { data: newCompetidor, error: insertError } = await supabase
            .from('competidor')
            .insert([{ nombre, apellido, carnet_identidad, fecha_nacimiento, correo_electronico, id_provincia, id_escuela }])
            .select('id_competidor')
            .single(); // Aquí sí usamos single() porque insertamos solo 1 fila

        if (insertError) throw insertError;

        id_competidor = newCompetidor.id_competidor;
    }

    return id_competidor;



    for (const id_tutor of id_tutores) {
        await supabase
            .from('competidor_tutor')
            .insert([{ id_competidor, id_tutor }]);
    }


    const { error: inscriptionError } = await supabase
        .from('inscription')
        .insert([{ id_competidor, id_area, id_categoria, status: 'pendiente', inscription_date: new Date() }]);

    if (inscriptionError) throw inscriptionError;

    return { success: true, message: 'Competidor inscrito correctamente' };
};



module.exports = { inscribirCompetidor };