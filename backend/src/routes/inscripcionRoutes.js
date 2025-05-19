import { Router } from 'express';
import * as inscripcionController from '../controllers/inscripcionController.js';
import * as autentificacion from '../middlewares/authMiddleware.js';
import { esTutor } from '../middlewares/permisoMiddleware.js';

const router = Router();
//registrar inscripcion
router.post('/inscripcion-tutor', autentificacion.authMiddleware, inscripcionController.registrarInscripcion);



//aceptar inscripcion
router.patch('/inscripcion-tutor/aceptar/:id', autentificacion.verificarToken, esTutor, inscripcionController.aceptarInscripcionController);

//obtener inscripciones pendientes
//router.get('/inscripcion-tutor/pendientes', autentificacion.authMiddleware, inscripcionController.obtenerInscripcionesPendientes);

//rechazar inscripcion
router.patch('/inscripcion-tutor/rechazar/:id', autentificacion.verificarToken, esTutor, inscripcionController.rechazarInscripcionController);

//obtener motivos de rechazo
router.get('/inscripcion-tutor/motivos-rechazo', inscripcionController.obtenerMotivosRechazoController);

export default router;
