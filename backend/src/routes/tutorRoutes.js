import express from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar un nuevo tutor
router.post('/registro', tutorController.registrarTutor);

// Ruta para buscar tutores por nombre (autocompletado)
router.get('/buscar', tutorController.buscarTutores);

// Ruta para obtener todos los tutores disponibles
router.get('/disponibles', tutorController.obtenerTutoresDisponibles);

export default router; 