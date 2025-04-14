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

export const obtenerAreaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const area = await areaService.getAreaById(id);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        res.status(200).json(area);
    } catch (error) {
        next(error);
    }
}

export const actualizarArea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre_area, descripcion_area } = req.body;
        const area = await areaService.updateArea(id, nombre_area, descripcion_area);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        res.status(200).json(area);
    } catch (error) {
        next(error);
    }
}