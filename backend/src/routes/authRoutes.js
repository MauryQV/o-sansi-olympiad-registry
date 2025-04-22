import express from 'express';
import prisma from '../config/prismaClient.js';
import * as authControllers from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authControllers.login);

//Temporalmente deshabilitado el perfil de competidores
router.get('/perfil', verificarToken, async (req, res) => {
    const usuarioId = req.usuario.id;

    const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: { competidor: true },
    });

    res.json(usuario);
});

export default router;

