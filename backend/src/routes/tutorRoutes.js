import express from 'express';
import * as tutorController from '../controllers/tutorController.js';


const router = express.Router();

router.post('/tutores/registro', tutorController.registrarTutor);

router.get('/tutores', tutorController.obtenerTutores);

router.get('/tutores/:id', tutorController.obtenerTutorPorId);

router.get('/buscar-tutor', tutorController.buscarTutores);




export default router; 