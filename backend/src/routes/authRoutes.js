import express from 'express';
import * as authControllers from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authControllers.login);

export default router;

