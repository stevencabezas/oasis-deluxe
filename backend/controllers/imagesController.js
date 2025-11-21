import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary, uploadToCloudinaryBuffer, listResources } from '../config/cloudinary.js';
import { cloudinaryEnabled, uploadPath as localUploadPath } from '../config/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = localUploadPath || path.join(__dirname, '../uploads');
const imgBasePath = path.join(__dirname, '../../frontend/public/img');

// Subir imagen
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });

    // Si Cloudinary está activado, subir desde el buffer
    if (cloudinaryEnabled) {
      if (!req.file.buffer) return res.status(400).json({ error: 'No se encontró buffer de la imagen en la petición' });
      const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads';
      const result = await uploadToCloudinaryBuffer(req.file.buffer, folder);
      const imageUrl = result.secure_url || result.url;
      return res.json({
        message: 'Imagen subida correctamente',
        imageUrl,
        public_id: result.public_id,
        size: result.bytes,
        format: result.format
      });
    }

    // usar BACKEND_URL si existe; si no, derivar de la request
    const baseUrl =
      process.env.BACKEND_URL ??
      `${req.protocol}://${req.get('host')}`;

    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    return res.json({ message:'Imagen subida correctamente', imageUrl, filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Listar todas las imágenes de uploads
export const listImages = async (req, res) => {
  try {
    if (cloudinaryEnabled) {
      const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads';
      const resources = await listResources(folder, 100);
      const images = (resources.resources || []).map(r => ({
        filename: r.public_id,
        url: r.secure_url,
        size: r.bytes,
        created: r.created_at,
        modified: r.created_at
      }));
      images.sort((a,b) => new Date(b.modified) - new Date(a.modified));
      return res.json({ count: images.length, images });
    }

    // Verificar que la carpeta exists (modo local)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      return res.json({ images: [] });
    }

    const files = fs.readdirSync(uploadPath, { withFileTypes: true });
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_URL || '') 
      : '';

    const images = files
      .filter(file => {
        const ext = path.extname(file.name).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => {
        const fullPath = path.join(uploadPath, file.name);
        const stats = fs.statSync(fullPath);

        return {
          filename: file.name,
          url: `${baseUrl}/uploads/${file.name}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });

    // Ordenar por fecha de modificación (más reciente primero)
    images.sort((a, b) => b.modified - a.modified);

    res.json({
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Error listando imágenes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar carpetas (simplificado - solo uploads)
export const listFolders = async (req, res) => {
  try {
    if (cloudinaryEnabled) {
      const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads';
      const resources = await listResources(folder, 1);
      const count = resources.total_count || (resources.resources || []).length || 0;
      return res.json({
        count: 1,
        folders: [{ name: folder, path: folder, imageCount: count, modified: new Date() }]
      });
    }

    const folders = [];

    // Solo devolver carpeta de uploads (modo local)
    if (fs.existsSync(uploadPath)) {
      const stats = fs.statSync(uploadPath);
      const uploadFiles = fs.readdirSync(uploadPath);
      const imageCount = uploadFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      }).length;
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? (process.env.BACKEND_URL || '') 
        : '';
      
      folders.push({
        name: 'uploads',
        path: `${baseUrl}/uploads`,
        imageCount,
        modified: stats.mtime
      });
    }

    res.json({ count: folders.length, folders });
  } catch (error) {
    console.error('Error listando carpetas:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar imagen
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    if (cloudinaryEnabled) {
      // filename expected to be public_id or public_id with folder; remove extension if present
      const publicId = filename.replace(/\.[^/.]+$/, '');
      const result = await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'image' });
      if (result.result === 'not found' || result.result === 'error') {
        return res.status(404).json({ error: 'Imagen no encontrada en Cloudinary' });
      }
      return res.json({ message: 'Imagen eliminada correctamente', result });
    }

    const filePath = path.join(uploadPath, filename);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Eliminar archivo
    fs.unlinkSync(filePath);

    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: error.message });
  }
};

