import * as categoriaService from '../services/categoriaServices.js';

export const crearCategoria = async (req, res, next) => {
    try {
        const categoria = await categoriaService.crearCategoria(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
};

export const asignarCategoria = async (req, res, next) => {
    try {
        const { convocatoriaId, categoriaId } = req.body;
        const result = await categoriaService.asignarCategoriaAConvocatoria(convocatoriaId, categoriaId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const obtenerCategorias = async (req, res, next) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};
