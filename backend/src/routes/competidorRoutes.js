import express from 'express';
import * as competidorControllers from '../controllers/competidorController.js'



const router = express.Router();

router.post('/registro-competidor', competidorControllers.crearCompetidor);

export default router;