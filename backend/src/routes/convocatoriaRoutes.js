import express from 'express';
import * as convocatoriaController from '../controllers/convocatoriaController.js';

const router = express.Router();

router.post('/crear-convocatoria', convocatoriaController.crearConvocatoria);
router.post('/asignar-area', convocatoriaController.asignarArea);
router.post('/asignar-categoria', convocatoriaController.asignarCategoria);
router.get('/convocatorias', convocatoriaController.obtenerConvocatorias);
router.get('/convocatoria/:id', convocatoriaController.obtenerConvocatoriaPorId);
router.get('/convocatoria/estado/:estado', convocatoriaController.obtenerConvocatoriaPorEstados);

export default router;
