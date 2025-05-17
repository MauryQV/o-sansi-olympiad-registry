import express from 'express';
import * as convocatoriaController from '../controllers/convocatoriaController.js';
//Aun no se implentara
import { verificarToken } from '../middlewares/authMiddleware.js';
import { requirePermiso } from '../middlewares/permisoMiddleware.js';

const router = express.Router();

router.post('/crear-convocatoria', convocatoriaController.crearConvocatoriaController);

//router.post('/asignar-categoria', convocatoriaController.asignarCategoria);

router.get('/convocatorias', convocatoriaController.obtenerConvocatorias);

router.get('/convocatoria/:id', convocatoriaController.obtenerConvocatoriaPorId);

router.get('/convocatoria/estado/:estado', convocatoriaController.obtenerConvocatoriaPorEstados);

router.patch('/actualizar-convocatoria/:id', convocatoriaController.actualizarConvocatoriaController);

router.get('/convocatoria/areas/:id', convocatoriaController.obtenerConvocatoriaConAreas);

router.delete('/eliminar-convocatoria/:id', convocatoriaController.eliminarConvocatoria);

router.get('/convocatoria-estados', convocatoriaController.obtenerEstadosConvocatoria);

router.get('/convocatoria-numeros', convocatoriaController.obtenerNumerodeConvocatoriasActivas);

router.get('/convocatoria-una-activa', convocatoriaController.obtenerUnaConvocatoriaActiva);

router.get('/visualizar-convocatoria/:id', convocatoriaController.visualizarConvocatoria);

export default router;
