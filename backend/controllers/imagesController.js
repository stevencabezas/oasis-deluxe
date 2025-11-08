import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, '../../frontend/public/img/uploads');
const imgBasePath = path.join(__dirname, '../../frontend/public/img');

// Subir imagen
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    // Ruta relativa para usar en el frontend
    const imageUrl = `/img/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Imagen subida correctamente',
      imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todas las imágenes de una carpeta
export const listImages = async (req, res) => {
  try {
    const { folder } = req.query; // Carpeta opcional: 'uploads', 'armaf', etc.
    
    let targetPath = uploadPath;
    
    if (folder && folder !== 'uploads') {
      targetPath = path.join(imgBasePath, folder);
    }
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(targetPath)) {
      return res.json({ images: [] });
    }
    
    // Leer archivos de la carpeta
    const files = fs.readdirSync(targetPath, { withFileTypes: true });
    
    const images = [];
    
    // Función recursiva para obtener todas las imágenes
    const getImagesRecursive = (dirPath, relativePath = '') => {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item.name);
        const relPath = path.join(relativePath, item.name);
        
        if (item.isDirectory()) {
          // Recursivamente buscar en subcarpetas
          getImagesRecursive(fullPath, relPath);
        } else {
          // Verificar si es una imagen
          const ext = path.extname(item.name).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
            const stats = fs.statSync(fullPath);
            const urlPath = folder && folder !== 'uploads' 
              ? `/img/${folder}/${relPath.replace(/\\/g, '/')}`
              : `/img/uploads/${relPath.replace(/\\/g, '/')}`;
            
            images.push({
              filename: item.name,
              path: relPath.replace(/\\/g, '/'),
              url: urlPath,
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime
            });
          }
        }
      });
    };
    
    getImagesRecursive(targetPath);
    
    // Ordenar por fecha de modificación (más reciente primero)
    images.sort((a, b) => b.modified - a.modified);
    
    res.json({
      folder: folder || 'uploads',
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Error listando imágenes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar todas las carpetas disponibles
export const listFolders = async (req, res) => {
  try {
    const folders = [];
    
    // Leer carpetas en /img
    const items = fs.readdirSync(imgBasePath, { withFileTypes: true });
    
    items.forEach(item => {
      if (item.isDirectory() && item.name !== 'uploads') {
        const folderPath = path.join(imgBasePath, item.name);
        const stats = fs.statSync(folderPath);
        
        // Contar imágenes en la carpeta
        const countImages = (dirPath) => {
          let count = 0;
          const items = fs.readdirSync(dirPath, { withFileTypes: true });
          
          items.forEach(item => {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
              count += countImages(fullPath);
            } else {
              const ext = path.extname(item.name).toLowerCase();
              if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                count++;
              }
            }
          });
          
          return count;
        };
        
        folders.push({
          name: item.name,
          path: `/img/${item.name}`,
          imageCount: countImages(folderPath),
          modified: stats.mtime
        });
      }
    });
    
    // Agregar carpeta de uploads
    if (fs.existsSync(uploadPath)) {
      const stats = fs.statSync(uploadPath);
      const uploadFiles = fs.readdirSync(uploadPath);
      const imageCount = uploadFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      }).length;
      
      folders.unshift({
        name: 'uploads',
        path: '/img/uploads',
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
    const { folder } = req.query;
    
    let filePath;
    
    if (folder && folder !== 'uploads') {
      filePath = path.join(imgBasePath, folder, filename);
    } else {
      filePath = path.join(uploadPath, filename);
    }
    
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

