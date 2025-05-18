import express from 'express';
import * as categoriaAreaController from '../controllers/categoriaAreaController.js';

const router = express.Router();

router.get('/ver-categorias-areas', categoriaAreaController.obtenerCategoriasAreas);

export default router;
