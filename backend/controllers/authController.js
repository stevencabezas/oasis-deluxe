import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User.js';

// Verificar que JWT_SECRET esté configurado
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET no está configurado en las variables de entorno');
  console.error('La aplicación no puede iniciar sin JWT_SECRET por razones de seguridad');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario por username o email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Registrar nuevo admin (solo para crear el primer usuario)
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si ya existe un usuario
    const userCount = await User.count();
    
    // Solo permitir registro si no hay usuarios (primer admin)
    // En producción, esto debería estar más restringido
    if (userCount > 0) {
      // Verificar si hay un token de admin en el header (para crear más admins después)
      // Por ahora, solo permitimos crear el primer usuario
      return res.status(403).json({ 
        error: 'Registro deshabilitado. Contacta al administrador.' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin'
    });

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar token (para mantener sesión)
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error verificando token' });
  }
};

