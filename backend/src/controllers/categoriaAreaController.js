import * as categoriaAreaService from '../services/categoriaAreaServices.js';

export const obtenerCategoriasAreas = async (req, res, next) => {
    try {
        const data = await categoriaAreaService.getCategoriasAreas();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message || error.details || 'Error al obtener las relaciones' });
    }
};