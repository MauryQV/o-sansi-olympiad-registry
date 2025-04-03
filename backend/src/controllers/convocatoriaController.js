import * as convocatoriaService from '../services/convocatoriaServices.js';


export const crearConvocatoria = async (req, res, next) => {
    try {
        const convocatoria = await convocatoriaService.crearConvocatoria(req.body);
        res.status(201).json(convocatoria);
    } catch (error) {
        next(error);
    }
};


export const asignarArea = async (req, res, next) => {
    try {
        const { convocatoriaId, areaId } = req.body;
        const result = await convocatoriaService.asignarAreaAConvocatoria(convocatoriaId, areaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
