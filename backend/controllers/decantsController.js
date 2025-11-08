import { Decant } from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todos los decants
export const getAllDecants = async (req, res) => {
  try {
    const { search, includeInactive } = req.query;
    
    const where = {};
    
    // Por defecto solo mostrar activos, a menos que se especifique includeInactive
    if (includeInactive !== 'true') {
      where.activo = true;
    }
    
    if (search) {
      where.nombre = {
        [Op.iLike]: `%${search}%`
      };
    }
    
    const decants = await Decant.findAll({
      where,
      order: [['activo', 'DESC'], ['nombre', 'ASC']]
    });
    
    res.json(decants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener decant por ID
export const getDecantById = async (req, res) => {
  try {
    const { id } = req.params;
    const decant = await Decant.findByPk(id);
    
    if (!decant) {
      return res.status(404).json({ error: 'Decant no encontrado' });
    }
    
    res.json(decant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo decant (para admin)
export const createDecant = async (req, res) => {
  try {
    const { nombre, imagen, precio2ml, precio5ml, precio10ml } = req.body;
    
    const decant = await Decant.create({
      nombre,
      imagen,
      precio2ml: parseFloat(precio2ml),
      precio5ml: parseFloat(precio5ml),
      precio10ml: parseFloat(precio10ml)
    });
    
    res.status(201).json(decant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar decant (admin)
export const updateDecant = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, imagen, precio2ml, precio5ml, precio10ml, activo } = req.body;
    
    const decant = await Decant.findByPk(id);
    
    if (!decant) {
      return res.status(404).json({ error: 'Decant no encontrado' });
    }
    
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (imagen) updateData.imagen = imagen;
    if (precio2ml !== undefined) updateData.precio2ml = parseFloat(precio2ml);
    if (precio5ml !== undefined) updateData.precio5ml = parseFloat(precio5ml);
    if (precio10ml !== undefined) updateData.precio10ml = parseFloat(precio10ml);
    if (activo !== undefined) updateData.activo = activo;
    
    await decant.update(updateData);
    
    res.json(decant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar decant (admin) - soft delete
export const deleteDecant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const decant = await Decant.findByPk(id);
    
    if (!decant) {
      return res.status(404).json({ error: 'Decant no encontrado' });
    }
    
    // Soft delete - marcar como inactivo
    await decant.update({ activo: false });
    
    res.json({ message: 'Decant eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activar decant (admin)
export const activateDecant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const decant = await Decant.findByPk(id);
    
    if (!decant) {
      return res.status(404).json({ error: 'Decant no encontrado' });
    }
    
    await decant.update({ activo: true });
    
    res.json({ message: 'Decant activado correctamente', decant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
