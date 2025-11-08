import express from 'express';
import {
  getAllBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  activateBrand
} from '../controllers/brandsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllBrands);
router.get('/slug/:slug', getBrandBySlug);
router.get('/:id', getBrandById);

// Rutas protegidas (admin)
router.post('/', authenticateToken, requireAdmin, createBrand);
router.put('/:id', authenticateToken, requireAdmin, updateBrand);
router.delete('/:id', authenticateToken, requireAdmin, deleteBrand);
router.patch('/:id/activate', authenticateToken, requireAdmin, activateBrand);

export default router;



