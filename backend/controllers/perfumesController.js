import { Perfume, Brand } from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todos los perfumes (con paginación y filtros)
export const getAllPerfumes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      categoria, 
      marcaId,
      minPrice,
      maxPrice,
      search,
      includeInactive 
    } = req.query;
    
    const where = {};
    
    // Por defecto solo mostrar activos, a menos que se especifique includeInactive
    if (includeInactive !== 'true') {
      where.activo = true;
    }
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    if (marcaId) {
      where.marcaBrandId = marcaId;
    }
    
    if (minPrice || maxPrice) {
      where.precio = {};
      if (minPrice) where.precio[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.precio[Op.lte] = parseFloat(maxPrice);
    }
    
    // Búsqueda en nombre de perfume y marca
    let includeSearch = [{
      model: Brand,
      as: 'marca',
      attributes: ['id', 'nombre', 'brandId', 'slug']
    }];
    
    if (search) {
      where[Op.or] = [
        {
          nombre: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          '$marca.nombre$': {
            [Op.iLike]: `%${search}%`
          }
        }
      ];
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: perfumes } = await Perfume.findAndCountAll({
      where,
      include: includeSearch,
      order: [['nombre', 'ASC']],
      limit: Number(limit),
      offset: offset,
      distinct: true // Para contar correctamente con JOINs
    });
    
    const pages = Math.ceil(count / Number(limit));
    
    res.json({
      perfumes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener perfume por ID
export const getPerfumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const perfume = await Perfume.findByPk(id, {
      include: [{
        model: Brand,
        as: 'marca',
        attributes: ['id', 'nombre', 'brandId', 'slug']
      }]
    });
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume no encontrado' });
    }
    
    res.json(perfume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo perfume (para admin)
export const createPerfume = async (req, res) => {
  try {
    const { nombre, precio, imagenUrl, categoria, marcaId } = req.body;
    
    // Buscar la marca por brandId o slug
    const brand = await Brand.findOne({
      where: {
        [Op.or]: [
          { brandId: marcaId },
          { slug: marcaId }
        ]
      }
    });
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    const perfume = await Perfume.create({
      nombre,
      precio: parseFloat(precio),
      imagenUrl,
      categoria,
      marcaId: brand.id,
      marcaBrandId: brand.brandId
    });
    
    // Cargar la relación con la marca
    await perfume.reload({
      include: [{
        model: Brand,
        as: 'marca',
        attributes: ['id', 'nombre', 'brandId', 'slug']
      }]
    });
    
    res.status(201).json(perfume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar perfume (admin)
export const updatePerfume = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagenUrl, categoria, marcaId, activo } = req.body;
    
    const perfume = await Perfume.findByPk(id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume no encontrado' });
    }
    
    let updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (precio !== undefined) updateData.precio = parseFloat(precio);
    if (imagenUrl) updateData.imagenUrl = imagenUrl;
    if (categoria) updateData.categoria = categoria;
    if (activo !== undefined) updateData.activo = activo;
    
    // Si se cambia la marca
    if (marcaId) {
      const brand = await Brand.findOne({
        where: {
          [Op.or]: [
            { brandId: marcaId },
            { slug: marcaId }
          ]
        }
      });
      
      if (!brand) {
        return res.status(404).json({ error: 'Marca no encontrada' });
      }
      
      updateData.marcaId = brand.id;
      updateData.marcaBrandId = brand.brandId;
    }
    
    await perfume.update(updateData);
    
    await perfume.reload({
      include: [{
        model: Brand,
        as: 'marca',
        attributes: ['id', 'nombre', 'brandId', 'slug']
      }]
    });
    
    res.json(perfume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar perfume (admin) - soft delete
export const deletePerfume = async (req, res) => {
  try {
    const { id } = req.params;
    
    const perfume = await Perfume.findByPk(id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume no encontrado' });
    }
    
    // Soft delete - marcar como inactivo
    await perfume.update({ activo: false });
    
    res.json({ message: 'Perfume eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activar perfume (admin)
export const activatePerfume = async (req, res) => {
  try {
    const { id } = req.params;
    
    const perfume = await Perfume.findByPk(id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume no encontrado' });
    }
    
    await perfume.update({ activo: true });
    
    await perfume.reload({
      include: [{
        model: Brand,
        as: 'marca',
        attributes: ['id', 'nombre', 'brandId', 'slug']
      }]
    });
    
    res.json({ message: 'Perfume activado correctamente', perfume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
