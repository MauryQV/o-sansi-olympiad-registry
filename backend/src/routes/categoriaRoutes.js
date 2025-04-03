import express from 'express';
import * as categoriaController from '../controllers/categoriaController.js';

const router = express.Router();

router.post('/crear-categorias', categoriaController.crearCategoria);
router.post('/asignar', categoriaController.asignarCategoria);
router.get('/ver-categorias', categoriaController.obtenerCategorias);

export default router;
