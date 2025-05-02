import express from 'express';
import * as inscripcionController from '../controllers/inscripcionController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar una inscripción (requiere autenticación)
router.post('/registrar', verificarToken, inscripcionController.registrarInscripcion);

// Ruta para obtener información académica (áreas, categorías, grados)
router.get('/info-academica', inscripcionController.obtenerInfoAcademica);

// Ruta para verificar si el periodo de inscripción está activo
router.get('/periodo-activo', inscripcionController.verificarPeriodoInscripcion);

export default router; 