import sequelize from '../config/database.js';
import { testConnection } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function addActivoToBrands() {
  try {
    console.log('🔄 Iniciando migración: Agregar campo "activo" a tabla brands...');
    
    // Verificar conexión
    await testConnection();
    
    // Agregar columna activo si no existe
    await sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'brands' AND column_name = 'activo'
        ) THEN
          ALTER TABLE brands ADD COLUMN activo BOOLEAN DEFAULT true;
          RAISE NOTICE 'Columna "activo" agregada correctamente';
        ELSE
          RAISE NOTICE 'La columna "activo" ya existe';
        END IF;
      END $$;
    `);
    
    // Actualizar registros existentes para asegurar que tengan activo = true
    const [results] = await sequelize.query(`
      UPDATE brands 
      SET activo = true 
      WHERE activo IS NULL;
    `);
    
    console.log('✅ Migración completada exitosamente');
    console.log(`   - Campo "activo" agregado a tabla brands`);
    console.log(`   - Registros actualizados: ${results.length || 0}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
addActivoToBrands();

