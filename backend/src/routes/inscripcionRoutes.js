import { Router } from 'express';
import * as inscripcionController from '../controllers/inscripcionController.js';
import * as autentificacion from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/inscripcion-tutor', autentificacion.authMiddleware, inscripcionController.registrarInscripcion);

router.patch('/inscripcion-tutor/aceptar/:id', autentificacion.authMiddleware, inscripcionController.aceptarInscripcionController);

router.patch('/inscripcion-tutor/rechazar/:id', autentificacion.authMiddleware, inscripcionController.rechazarInscripcionController);



export default router;
