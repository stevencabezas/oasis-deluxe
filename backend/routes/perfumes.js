import express from 'express';
import {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
  activatePerfume
} from '../controllers/perfumesController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllPerfumes);
router.get('/:id', getPerfumeById);

// Rutas protegidas (admin)
router.post('/', authenticateToken, requireAdmin, createPerfume);
router.put('/:id', authenticateToken, requireAdmin, updatePerfume);
router.delete('/:id', authenticateToken, requireAdmin, deletePerfume);
router.patch('/:id/activate', authenticateToken, requireAdmin, activatePerfume);

export default router;



