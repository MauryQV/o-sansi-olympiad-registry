import express from 'express';
import * as userController from '../controllers/userController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas para administradores
router.get('/', verificarToken, verificarAdmin, userController.getUsers);
router.get('/roles', verificarToken, verificarAdmin, userController.getRoles);
router.get('/:id', verificarToken, verificarAdmin, userController.getUserById);
router.post('/', verificarToken, verificarAdmin, userController.createUser);
router.put('/:id', verificarToken, verificarAdmin, userController.updateUser);
router.patch('/:id/status', verificarToken, verificarAdmin, userController.changeUserStatus);
router.delete('/:id', verificarToken, verificarAdmin, userController.deleteUser);

export default router; 