import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ error: 'Error de configuración del servidor' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Error verificando token' });
  }
};

// Middleware para verificar que el usuario es admin
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
  }
};

