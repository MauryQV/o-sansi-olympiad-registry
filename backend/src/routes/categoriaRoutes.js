import { Router } from 'express';
import * as categoriaController from '../controllers/categoriaController.js';

const router = Router();

router.post('/crear-categoria', categoriaController.crearCategoria);

router.get('/ver-categorias', categoriaController.obtenerCategorias);

router.patch('/actualizar-categorias/:id', categoriaController.actualizarCategoria);//sospechoso

router.get('/ver-grados', categoriaController.verGrados);

router.get('/ver-grados-categoria/:id', categoriaController.obtenerGradosPorCategoria);

router.delete('/eliminar-categoria/:id', categoriaController.eliminarCategoriaCompleta);

router.get('/ver-categorias-area/:areaId', categoriaController.obtenerCategoriasPorArea);

router.delete('/eliminar-categoria-completa/:id', categoriaController.eliminarCategoriaCompleta);

export default router;
