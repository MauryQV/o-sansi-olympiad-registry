const { fetchDepartamentos, fetchProvincias, fetchColegios } = require('../services/locationService');

const getDepartamentos = async (req, res) => {
    try {
        const data = await fetchDepartamentos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
};

const getProvincias = async (req, res) => {
    try {
        const { id_departamento } = req.params;
        const data = await fetchProvincias(id_departamento);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las provincias' });
    }
};

const getColegios = async (req, res) => {
    try {
        const { id_provincia } = req.params;
        const data = await fetchColegios(id_provincia);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los colegios' });
    }
};

module.exports = { getDepartamentos, getProvincias, getColegios };
