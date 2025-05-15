import * as convocatoriaService from '../services/convocatoriaServices.js';

export const crearConvocatoriaController = async (req, res) => {
    try {
        const convocatoria = await convocatoriaService.crearConvocatoriaConRelaciones(req.body);
        res.status(201).json({ message: 'Convocatoria creada con éxito', convocatoria });
    } catch (error) {
        console.error('error al crear convocatoria', error.message);
        res.status(400).json({ error: error.message || 'error al crear la convocatoria' });
    }
};

/*export const asignarCategoria = async (req, res, next) => {
    try {
        const { convocatoriaId, categoriaId } = req.body;
        const result = await convocatoriaService.asignarCategoriaAConvocatoria(convocatoriaId, categoriaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}*/

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

export const actualizarConvocatoriaController = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await convocatoriaService.actualizarConvocatoria(id, req.body);
        res.status(200).json({ message: 'Convocatoria actualizada', result });
    } catch (error) {
        console.error('[ERROR ACTUALIZAR]', error.message);
        res.status(400).json({ error: error.message });
    }
};

export const obtenerConvocatoriaConAreas = async (req, res) => {
    try {
        const id = req.params.id;
        const convocatoria = await convocatoriaService.obtenerConvocatoriaConAreas(id);
        if (!convocatoria) {
            return res.status(404).json({ message: 'Convocatoria no encontrada' });
        }
        res.json(convocatoria);
    } catch (error) {
        console.error('[ERROR OBTENER CON AREAS]', error.message);
        res.status(400).json({ error: error.message });
    }
};

export const eliminarConvocatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await convocatoriaService.eliminarConvocatoria(id);
        res.status(200).json({ message: 'Convocatoria eliminada', result });
    } catch (error) {
        console.error('[ERROR ELIMINAR]', error.message);
        res.status(400).json({ error: error.message });
    }
};

export const obtenerEstadosConvocatoria = async (req, res) => {
    try {
        const estados = await convocatoriaService.obtenerEstadosConvocatoria();
        res.json(estados);
    } catch (error) {
        console.error('[ERROR OBTENER ESTADOS]', error.message);
        res.status(400).json({ error: error.message });
    }
};

export const obtenerNumerodeConvocatoriasActivas = async (req, res) => {
    try {
        const convocatorias_activas = await convocatoriaService.obtenerNumerodeConvocatoriasActivas();
        res.json({ convocatorias_activas });
    } catch (error) {
        console.error('error al obtener el numero de convocatorias activas', error.message);
        res.status(400).json({ error: error.message });
    }
}

export const obtenerUnaConvocatoriaActiva = async (req, res) => {
    try {
        const convocatoria = await convocatoriaService.obtenerUnaConvocatoriaActiva();
        res.json(convocatoria);
    } catch (error) {
        console.error('error al obtener la convocatoria activa', error.message);
        res.status(400).json({ error: error.message });
    }
}

export const visualizarConvocatoria = async (req, res) => {
    try {
        const id = req.params.id;
        const convocatoria = await convocatoriaService.visualizarConvocatoria(id);
        if (!convocatoria) {
            return res.status(404).json({ message: 'Convocatoria no encontrada' });
        }
        res.json(convocatoria);
    } catch (error) {
        console.error('error al visualizar la convocatoria', error.message);
        res.status(400).json({ error: error.message });
    }

}