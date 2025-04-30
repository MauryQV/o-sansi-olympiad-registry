import * as categoriaService from '../services/categoriaServices.js';

export const crearCategoria = async (req, res, next) => {
    try {
        const result = await categoriaService.crearCategoriaConArea(req.body);
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

export const actualizarCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoriaActualizada = await categoriaService.actualizarCategoriaConArea(id, req.body);
        res.status(200).json(categoriaActualizada);
    } catch (error) {
        next(error);
    }
};