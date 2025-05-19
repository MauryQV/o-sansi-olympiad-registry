import express from 'express';
import * as categoriaController from '../controllers/categoriaController.js';

const router = express.Router();

router.post('/crear-categorias', categoriaController.crearCategoria);


router.get('/ver-categorias', categoriaController.obtenerCategorias);


router.patch('/actualizar-categorias/:id', categoriaController.actualizarCategoria);

router.get('/ver-grados', categoriaController.verGrados);

router.get('/ver-grados-categoria/:id', categoriaController.obtenerGradosPorCategoria);

router.delete('/eliminar-categoria-completa/:id', categoriaController.eliminarCategoriaCompleta);

export default router;
