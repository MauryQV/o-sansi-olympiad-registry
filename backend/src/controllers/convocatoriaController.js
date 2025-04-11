import * as convocatoriaService from '../services/convocatoriaServices.js';


export const crearConvocatoria = async (req, res, next) => {
    try {
        const convocatoria = await convocatoriaService.crearConvocatoria(req.body);
        res.status(201).json(convocatoria);
    } catch (error) {
        next(error);
    }
};


export const asignarArea = async (req, res, next) => {
    try {
        const { convocatoriaId, areaId } = req.body;
        const result = await convocatoriaService.asignarAreaAConvocatoria(convocatoriaId, areaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const asignarCategoria = async (req, res, next) => {
    try {
        const { convocatoriaId, categoriaId } = req.body;
        const result = await convocatoriaService.asignarCategoriaAConvocatoria(convocatoriaId, categoriaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const obtenerConvocatorias = async (req, res, next) => {
    try {
        const convocatorias = await convocatoriaService.obtenerConvocatorias();
        res.json(convocatorias);
    } catch (error) {
        next(error);
    }
}

export const obtenerConvocatoriaPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const convocatoria = await convocatoriaService.obtenerConvocatoriaPorId(id);
        if (!convocatoria) {
            return res.status(404).json({ message: 'Convocatoria no encontrada' });
        }
        res.json(convocatoria);
    } catch (error) {
        next(error);
    }
};

export const obtenerConvocatoriaPorEstados = async (req, res, next) => {
    try {
        const { estado } = req.params;
        const convocatoria = await convocatoriaService.obtenerConvocatoriaPorEstados(estado);
        if (!convocatoria) {
            return res.status(404).json({ message: 'Convocatoria no encontrada' });
        }
        res.json(convocatoria);
    } catch (error) {
        next(error);
    }
}