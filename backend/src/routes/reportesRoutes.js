import express from 'express';
import { obtenerPostulantes } from '../controllers/reporteController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/permisoMiddleware.js';

const router = express.Router();

// Ruta para obtener el reporte de postulantes
// Protegida, solo accesible para roles admin y cajero
router.get(
  '/postulantes', 
  verificarToken, 
  verificarRol(['admin', 'cajero']), 
  obtenerPostulantes
);

export default router; 