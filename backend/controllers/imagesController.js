import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, '../uploads');
const imgBasePath = path.join(__dirname, '../../frontend/public/img');

// Subir imagen
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });

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
    // Verificar que la carpeta exists
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
    const folders = [];
    
    // Solo devolver carpeta de uploads
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
    
    res.json({
      count: folders.length,
      folders
    });
  } catch (error) {
    console.error('Error listando carpetas:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar imagen
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
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

