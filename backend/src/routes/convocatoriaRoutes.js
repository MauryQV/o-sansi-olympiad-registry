import express from 'express';
import * as convocatoriaController from '../controllers/convocatoriaController.js';

const router = express.Router();

router.post('/crear-convocatoria', convocatoriaController.crearConvocatoria);
router.post('/asignar-area', convocatoriaController.asignarArea);

export default router;
