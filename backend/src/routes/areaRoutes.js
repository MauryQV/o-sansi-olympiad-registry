import express from 'express';
import * as areaController from '../controllers/areaController.js';

const router = express.Router();

router.post('/crear-area', areaController.crearArea);

export default router;
