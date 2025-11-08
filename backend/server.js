import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection, syncDatabase } from './config/database.js';
import brandsRoutes from './routes/brands.js';
import perfumesRoutes from './routes/perfumes.js';
import decantsRoutes from './routes/decants.js';
import authRoutes from './routes/auth.js';
import imagesRoutes from './routes/images.js';

// Importar modelos y relaciones
import './models/index.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar a PostgreSQL
(async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      // Sincronizar modelos (crear tablas si no existen)
      await syncDatabase(false);
    }
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
  }
})();

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/perfumes', perfumesRoutes);
app.use('/api/decants', decantsRoutes);

// Rutas protegidas (admin)
app.use('/api/images', imagesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});

