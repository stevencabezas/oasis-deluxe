import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  brandId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'brand_id'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categoria: {
    type: DataTypes.ENUM('arabes', 'disenador', 'nichos'),
    allowNull: false
  },
  logoUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
    field: 'logo_url'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'brands',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['categoria'] },
    { fields: ['brand_id'] }
  ]
});

export default Brand;
