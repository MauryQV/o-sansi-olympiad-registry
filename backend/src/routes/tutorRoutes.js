import express from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import * as  autentificacion from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar un nuevo tutor
router.post('/registro-tutor', tutorController.registrarTutor);

// Ruta para buscar tutores por nombre (autocompletado)
//router.get('/buscar', tutorController.buscarTutores);

// Ruta para obtener todos los tutores disponibles
router.get('/disponibles', tutorController.obtenerTutoresDisponibles);


router.get('/solicitudes', autentificacion.authMiddleware, tutorController.getSolicitudesPendientes);


router.get('/tutor-areas', tutorController.obtenerTutoresFiltrados);

router.get('/solicitudes-view', tutorController.obtenerSolicitudesPendientesView);
// Ruta para obtener las inscripciones de los competidores asignados a un tutor
router.get('/mis-competidores', autentificacion.authMiddleware, tutorController.obtenerCompetidoresAsignados);


export default router; 