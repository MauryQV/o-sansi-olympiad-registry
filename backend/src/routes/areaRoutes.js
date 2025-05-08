import express from 'express';
import * as areaController from '../controllers/areaController.js';

const router = express.Router();

router.post('/crear-area', areaController.crearArea);

router.get('/ver-areas', areaController.obtenerAreas);

router.get('/ver-area/:id', areaController.obtenerAreaPorId);

router.patch('/actualizar-area/:id', areaController.actualizarArea);

router.delete('/eliminar-area/:id', areaController.eliminarArea);

router.get('/ver-categorias-area/:id', areaController.obtenerCategoriasArea);

export default router;
