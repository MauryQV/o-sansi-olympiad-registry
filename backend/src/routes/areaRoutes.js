import express from 'express';
import * as areaController from '../controllers/areaController.js';

const router = express.Router();

router.post('/crear-area', areaController.crearArea);
router.get('/ver-areas', areaController.obtenerAreas);

export default router;
