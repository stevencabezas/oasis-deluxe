// Archivo para definir relaciones entre modelos
// Esto evita dependencias circulares

import Brand from './Brand.js';
import Perfume from './Perfume.js';
import Decant from './Decant.js';
import User from './User.js';

// Definir relaciones
Brand.hasMany(Perfume, { 
  foreignKey: 'marcaId', 
  as: 'perfumes',
  onDelete: 'CASCADE'
});

Perfume.belongsTo(Brand, { 
  foreignKey: 'marcaId', 
  as: 'marca'
});

export { Brand, Perfume, Decant, User };



