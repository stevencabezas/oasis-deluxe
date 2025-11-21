import express from 'express';
import {
  getAllDecants,
  getDecantById,
  createDecant,
  updateDecant,
  deleteDecant,
  activateDecant
} from '../controllers/decantsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllDecants);
router.get('/:id', getDecantById);

// Rutas protegidas (admin)
router.post('/', authenticateToken, requireAdmin, createDecant);
router.put('/:id', authenticateToken, requireAdmin, updateDecant);
router.delete('/:id', authenticateToken, requireAdmin, deleteDecant);
router.patch('/:id/activate', authenticateToken, requireAdmin, activateDecant);

export default router;



