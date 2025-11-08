import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Perfume = sequelize.define('Perfume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'imagen_url'
  },
  categoria: {
    type: DataTypes.ENUM('hombre', 'mujer', 'unisex'),
    allowNull: false
  },
  marcaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'id'
    },
    field: 'marca_id',
    onDelete: 'CASCADE'
  },
  marcaBrandId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'marca_brand_id'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'perfumes',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['marca_id'] },
    { fields: ['categoria'] },
    { fields: ['marca_brand_id'] },
    { fields: ['activo'] }
  ]
});

export default Perfume;
