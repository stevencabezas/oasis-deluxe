import express from 'express';
import { login, register, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/register - Registrar nuevo admin (solo primer usuario)
router.post('/register', register);

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, verifyToken);

export default router;

