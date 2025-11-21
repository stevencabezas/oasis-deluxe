import express from 'express';
import upload from '../config/upload.js';
import {
  uploadImage,
  listImages,
  listFolders,
  deleteImage
} from '../controllers/imagesController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Subir imagen
router.post('/upload', upload.single('image'), uploadImage);

// Listar imágenes de una carpeta
router.get('/list', listImages);

// Listar carpetas disponibles
router.get('/folders', listFolders);

// Eliminar imagen
router.delete('/:filename', deleteImage);

export default router;

