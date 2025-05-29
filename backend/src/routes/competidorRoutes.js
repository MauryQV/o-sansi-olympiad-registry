import express from 'express';
import * as competidorControllers from '../controllers/competidorController.js'
import * as autentificacion from '../middlewares/authMiddleware.js';



const router = express.Router();

router.post('/registro-competidor', competidorControllers.crearCompetidor);

router.get('/mis-solicitudes', autentificacion.authMiddleware, competidorControllers.obtenerSolicitudesDelCompetidor);

router.get('/mis-inscripciones', autentificacion.authMiddleware, competidorControllers.obtenerInscripcionesCompetidor);


export default router;