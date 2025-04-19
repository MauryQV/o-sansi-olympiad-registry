import express from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { validarDatosTutor } from '../middlewares/tutorMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registro de tutores (pública)
router.post('/tutores/registro', validarDatosTutor, tutorController.registrarTutor);

// Rutas protegidas (requieren autenticación)
router.get('/tutores', authMiddleware, tutorController.obtenerTutores);

router.get('/tutores/:id', authMiddleware, tutorController.obtenerTutorPorId);

export default router; 