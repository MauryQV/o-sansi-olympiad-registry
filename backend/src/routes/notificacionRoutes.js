// routes/notificacionesRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getNotificaciones,
    marcarLeida,
    marcarTodasLeidas,
    eliminar
} from '../controllers/notificacionController.js';

const router = express.Router();

router.get('/notificaciones/', authMiddleware, getNotificaciones);

router.patch('/notificaciones/:id/leida', authMiddleware, marcarLeida);

router.patch('/notificaciones/todas/leidas', authMiddleware, marcarTodasLeidas);

router.delete('/notificaciones/:id', authMiddleware, eliminar);

export default router;
