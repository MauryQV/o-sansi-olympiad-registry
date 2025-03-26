const supabase = require('../config/supabaseClient');

const inscribirCompetidor = async (competidorData) => {
    const {
        nombre, apellido, carnet_identidad, fecha_nacimiento,
        correo_electronico, id_provincia, id_escuela,
        id_tutores, id_area,
    } = competidorData;

    const { data: existingCompetidor, error: selectError } = await supabase
        .from('competidor')
        .select('id_competidor')
        .eq('carnet_identidad', carnet_identidad)
        .maybeSingle();

    if (selectError) throw selectError;

    let id_competidor;

    if (existingCompetidor) {
        id_competidor = existingCompetidor.id_competidor;
    } else {
        const { data: newCompetidor, error: insertError } = await supabase
            .from('competidor')
            .insert([{
                nombre, apellido, carnet_identidad, fecha_nacimiento,
                correo_electronico, id_provincia, id_escuela
            }])
            .select('id_competidor')
            .single();

        if (insertError) throw insertError;

        id_competidor = newCompetidor.id_competidor;
    }


    await Promise.all(id_tutores.map(id_tutor =>
        supabase.from('competidor_tutor').insert([{ id_competidor, id_tutor }])
    ));


    const inscriptionDate = new Date().toISOString();
    const { error: inscriptionError } = await supabase
        .from('inscription')
        .insert([{ id_competidor, id_area }]);

    if (inscriptionError) throw inscriptionError;

    return { success: true, message: 'Competidor inscrito correctamente' };
};


module.exports = { inscribirCompetidor };