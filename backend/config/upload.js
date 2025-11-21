import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar si se debe usar Cloudinary (si están configuradas las vars)
const cloudinaryEnabled = !!(
  process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME
);

// Ruta donde se guardarán las imágenes (dentro del backend) — solo para modo local
const uploadPath = path.join(__dirname, '../uploads');

if (!cloudinaryEnabled) {
  // Crear el directorio si no existe (solo en modo local)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Configuración de almacenamiento para disco (local)
  var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Generar nombre único: timestamp + nombre original
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      const sanitizedName = nameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);

      cb(null, sanitizedName + '-' + uniqueSuffix + ext);
    }
  });
}

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WebP)'), false);
  }
};

// Configuración de multer
let upload;
if (cloudinaryEnabled) {
  // En modo Cloudinary usamos memoryStorage y subimos desde el buffer
  const storage = multer.memoryStorage();
  upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
} else {
  upload = multer({
    storage: diskStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
}

export default upload;
export { cloudinaryEnabled, uploadPath };

