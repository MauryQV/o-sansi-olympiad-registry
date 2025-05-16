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
        const grados = await categoriaService.obtenerGradosCategorias(id);

        if (!grados || !grados.grado_min || !grados.grado_max) {
            return res.status(404).json({ error: 'Grados no encontrados para esta categoría' });
        }

        const gradoMinStr = `${grados.grado_min.nombre_grado} de ${grados.grado_min.nivel.nombre_nivel}`.toUpperCase();
        const gradoMaxStr = `${grados.grado_max.nombre_grado} de ${grados.grado_max.nivel.nombre_nivel}`.toUpperCase();

        const mismoGrado = (
            grados.grado_min.nombre_grado === grados.grado_max.nombre_grado &&
            grados.grado_min.id_nivel === grados.grado_max.id_nivel
        );

        const rango = mismoGrado ? gradoMinStr : `${gradoMinStr} - ${gradoMaxStr}`;

        res.status(200).json({ rango });
    } catch (error) {
        next(error);
    }
};
