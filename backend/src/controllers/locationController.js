import * as locationService from "../services/locationServices.js";

export const getDepartamentos = async (req, res, next) => {
    try {
        const departamentos = await locationService.getDepartamentos();
        res.json(departamentos);
    } catch (error) {
        next(error);
    }
};

export const getProvinciasByDepartamento = async (req, res, next) => {
    try {
        const { departamentoId } = req.params;
        const provincias = await locationService.getProvinciasByDepartamento(parseInt(departamentoId, 10));
        res.json(provincias);
    } catch (error) {
        next(error);
    }
};
export const getColegiosByProvincia = async (req, res, next) => {
    try {
        const { provinciaId } = req.params;
        const colegios = await locationService.getColegiosByProvincia(parseInt(provinciaId, 10));
        res.json(colegios);
    } catch (error) {
        next(error);
    }
};

