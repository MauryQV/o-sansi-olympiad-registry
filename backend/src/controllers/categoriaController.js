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

export const verGrados = async (req, res, next) => {
    try {
        const grados = await categoriaService.obtenerGrados();
        res.status(200).json(grados);
    } catch (error) {
        next(error);
    }
}

export const obtenerGradosPorCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await categoriaService.obtenerGradosCategorias(id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener grados:', error);
        next(error);
    }
};

export const eliminarCategoriaCompleta = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoriaEliminada = await categoriaService.eliminarCategoriaCompletaBD(id);
        res.status(200).json({ message: 'Categoría y relaciones eliminadas correctamente', data: categoriaEliminada });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: `Error al eliminar: No se encontró la categoría con ID ${req.params.id}.` });
        }
        next(error);
    }
};

export const obtenerCategoriasPorArea = async (req, res, next) => {
    try {
        const { areaId } = req.params;
        const categorias = await categoriaService.obtenerCategoriasPorArea(areaId);
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};
