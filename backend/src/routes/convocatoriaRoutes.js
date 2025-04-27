import express from 'express';
import * as convocatoriaController from '../controllers/convocatoriaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { requirePermiso } from '../middlewares/permisoMiddleware.js';

const router = express.Router();

// Comentando temporalmente los middleware de autenticación para pruebas
router.post('/crear-convocatoria',
    // verificarToken,
    // requirePermiso("crear-convocatoria"),
    convocatoriaController.crearConvocatoriaController);

router.post('/asignar-categoria', convocatoriaController.asignarCategoria);

router.get('/convocatorias', convocatoriaController.obtenerConvocatorias);

router.get('/convocatoria/:id', convocatoriaController.obtenerConvocatoriaPorId);

router.get('/convocatoria/estado/:estado', convocatoriaController.obtenerConvocatoriaPorEstados);

router.patch('/actualizar-convocatoria/:id', convocatoriaController.actualizarConvocatoriaController);

router.get('/convocatoria/areas/:id', convocatoriaController.obtenerConvocatoriaConAreas);

export default router;
