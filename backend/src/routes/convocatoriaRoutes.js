import express from 'express';
import * as convocatoriaController from '../controllers/convocatoriaController.js';

const router = express.Router();

router.post('/crear-convocatoria', convocatoriaController.crearConvocatoriaController);

router.post('/asignar-categoria', convocatoriaController.asignarCategoria);

router.get('/convocatorias', convocatoriaController.obtenerConvocatorias);

router.get('/convocatoria/:id', convocatoriaController.obtenerConvocatoriaPorId);

router.get('/convocatoria/estado/:estado', convocatoriaController.obtenerConvocatoriaPorEstados);

router.patch('/actualizar-convocatoria/:id', convocatoriaController.actualizarConvocatoriaController);

export default router;
