const supabase = require('../config/supabaseClient');

const fetchDepartamentos = async () => {
    const { data, error } = await supabase
        .from('departamento')
        .select('*');

    if (error) throw error;
    return data;
};

const fetchProvincias = async (id_departamento) => {
    const { data, error } = await supabase
        .from('provincia')
        .select('*')
        .eq('id_departamento', id_departamento);

    if (error) throw error;
    return data;
};

const fetchColegios = async (id_provincia) => {
    const { data, error } = await supabase
        .from('colegio')
        .select('*')
        .eq('id_provincia', id_provincia);

    if (error) throw error;
    return data;
};

module.exports = { fetchDepartamentos, fetchProvincias, fetchColegios };
