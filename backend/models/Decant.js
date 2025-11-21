import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Decant = sequelize.define('Decant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio2ml: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_2ml',
    validate: {
      min: 0
    }
  },
  precio5ml: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_5ml',
    validate: {
      min: 0
    }
  },
  precio10ml: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_10ml',
    validate: {
      min: 0
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'decants',
  timestamps: true,
  underscored: true
});

export default Decant;
