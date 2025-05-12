import * as areaService from '../services/areaServices.js';

export const crearArea = async (req, res, next) => {
    try {
        const { nombre_area, descripcion_area, costo } = req.body;

        if (!nombre_area) {
            return res.status(400).json({ message: "El campo 'nombre_area' es obligatorio" });
        }

        const area = await areaService.crearArea(nombre_area, descripcion_area, costo);
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
        const { nombre_area, descripcion_area, costo } = req.body;
        const area = await areaService.updateArea(id, nombre_area, descripcion_area, costo);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        res.status(200).json(area);
    } catch (error) {
        next(error);
    }
}

export const eliminarArea = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const area = await areaService.deleteArea(id);
        if (!area) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        res.status(200).json(area);
    } catch (error) {
        next(error);
    }
}

export const obtenerCategoriasArea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categorias = await areaService.getCategoriasArea(id);
        if (!categorias) {
            return res.status(404).json({ message: 'No se encontraron categorias para esta area' });
        }
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
}