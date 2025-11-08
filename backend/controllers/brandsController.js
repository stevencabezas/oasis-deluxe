import { Brand, Perfume } from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todas las marcas (con filtro opcional por categoría)
export const getAllBrands = async (req, res) => {
  try {
    const { categoria, search, includeInactive } = req.query;
    const where = {};
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    // Por defecto solo mostrar activas, a menos que se especifique includeInactive
    if (includeInactive !== 'true') {
      where.activo = true;
    }
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { brandId: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const brands = await Brand.findAll({
      where,
      order: [['activo', 'DESC'], ['nombre', 'ASC']]
    });
    
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener marca por ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar por ID numérico, brandId o slug
    const brand = await Brand.findOne({
      where: {
        [Op.or]: [
          { id: isNaN(id) ? null : parseInt(id) },
          { brandId: id },
          { slug: id }
        ]
      }
    });
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener marca por slug
export const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await Brand.findOne({
      where: { 
        slug,
        activo: true  // Solo mostrar marcas activas en la ruta pública
      }
    });
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    // Obtener perfumes de la marca
    const perfumes = await Perfume.findAll({
      where: {
        marcaId: brand.id,
        activo: true
      },
      order: [['categoria', 'ASC'], ['nombre', 'ASC']]
    });
    
    // Organizar perfumes por categoría
    const perfumesOrganizados = {
      hombres: perfumes.filter(p => p.categoria === 'hombre'),
      mujeres: perfumes.filter(p => p.categoria === 'mujer'),
      unixes: perfumes.filter(p => p.categoria === 'unisex')
    };
    
    res.json({
      ...brand.toJSON(),
      perfumes: perfumesOrganizados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva marca (para admin)
export const createBrand = async (req, res) => {
  try {
    const { id, nombre, categoria, logoUrl } = req.body;
    
    // Generar slug si no se proporciona
    const slug = req.body.slug || id || nombre.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    
    const brand = await Brand.create({
      brandId: id || slug,
      nombre,
      slug,
      categoria,
      logoUrl: logoUrl || ''
    });
    
    res.status(201).json(brand);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'La marca ya existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Actualizar marca (admin)
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, logoUrl, slug } = req.body;
    
    const brand = await Brand.findByPk(id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    await brand.update({
      nombre: nombre || brand.nombre,
      categoria: categoria || brand.categoria,
      logoUrl: logoUrl !== undefined ? logoUrl : brand.logoUrl,
      slug: slug || brand.slug
    });
    
    res.json(brand);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'El slug o brandId ya existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Eliminar marca (admin) - soft delete
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    
    const brand = await Brand.findByPk(id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    // Soft delete - marcar como inactivo
    await brand.update({ activo: false });
    
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activar marca (admin)
export const activateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    
    const brand = await Brand.findByPk(id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }
    
    await brand.update({ activo: true });
    
    res.json({ message: 'Marca activada correctamente', brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
