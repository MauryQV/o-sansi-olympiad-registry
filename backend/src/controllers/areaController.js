import * as areaService from '../services/areaServices.js';

export const crearArea = async (req, res, next) => {
    try {
        const { nombre_area, descripcion_area } = req.body;

        if (!nombre_area) {
            return res.status(400).json({ message: "El campo 'nombre_area' es obligatorio" });
        }

        const area = await areaService.crearArea(nombre_area, descripcion_area);
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
        const id = parseInt(req.params.id, 10);
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