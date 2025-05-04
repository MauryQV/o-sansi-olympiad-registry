import { Router } from 'express';
import * as inscripcionController from '../controllers/inscripcionController.js';
import * as autentificacion from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/inscripcion-tutor', autentificacion.authMiddleware, inscripcionController.registrarInscripcion);

router.put('/validar', autentificacion.authMiddleware, inscripcionController.validarInscripcion);





export default router;
