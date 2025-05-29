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

        // Mapeo para reasignar los valores de los grados
        const formatearGrado = (grado) => {
            const equivalencias = {
                "Primero": "1º",
                "Segundo": "2º",
                "Tercero": "3º",
                "Cuarto": "4º",
                "Quinto": "5º",
                "Sexto": "6º",
            };

            return {
                nombre_grado: equivalencias[grado.nombre_grado] || grado.nombre_grado, 
                nivel: grado.nivel.nombre_nivel, 
            };
        };

        const respuestaFormateada = {
            nombre_categoria: grados.nombre_categoria,
            grado_min: formatearGrado(grados.grado_min),
            grado_max: formatearGrado(grados.grado_max),
        };

        res.status(200).json(respuestaFormateada);
    } catch (error) {
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
