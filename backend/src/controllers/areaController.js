import * as areaService from '../services/areaServices.js';

export const crearArea = async (req, res, next) => {
    try {
        const area = await areaService.crearArea(req.body.nombre);
        res.status(201).json(area);
    } catch (error) {
        next(error);
    }

};

export const obtenerAreas = async (req, res, next) => {
    try {
        const data = await areaService.getAreas();
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};
