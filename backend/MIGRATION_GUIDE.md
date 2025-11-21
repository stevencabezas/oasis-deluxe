# Guía de Migración - Campo "activo" en Brands

## Fecha: Noviembre 2025

### Cambios

Se agregó el campo `activo` (BOOLEAN) a la tabla `brands` para soportar soft delete (eliminación lógica).

### Por qué es necesario

El modelo `Brand.js` fue actualizado para incluir el campo `activo`, pero la base de datos existente no tiene esta columna. Esta migración agrega la columna y actualiza todos los registros existentes.

### Cómo ejecutar la migración

**Paso 1:** Asegúrate de que el servidor backend esté detenido

**Paso 2:** Ejecuta el script de migración

```bash
cd backend
npm run migrate:activo
```

**Paso 3:** Verifica que la migración fue exitosa

Deberías ver un mensaje como:
```
✅ Migración completada exitosamente
   - Campo "activo" agregado a tabla brands
   - Registros actualizados: X
```

**Paso 4:** Reinicia el servidor backend

```bash
npm run dev
```

### Qué hace la migración

1. Verifica la conexión a la base de datos
2. Agrega la columna `activo` BOOLEAN con valor por defecto `true`
3. Si la columna ya existe, no hace nada (es idempotente)
4. Actualiza todos los registros existentes para que tengan `activo = true`

### En caso de error

Si encuentras algún error:

1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en el archivo `.env`
3. Asegúrate de tener permisos para modificar la tabla

También puedes ejecutar manualmente en PostgreSQL:

```sql
-- Agregar columna
ALTER TABLE brands ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Actualizar registros existentes
UPDATE brands SET activo = true WHERE activo IS NULL;
```

### Rollback (Deshacer)

Si necesitas revertir esta migración:

```sql
ALTER TABLE brands DROP COLUMN IF EXISTS activo;
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los datos de la columna `activo`.

---

## Migraciones Futuras

Si necesitas ejecutar migraciones adicionales, sigue este mismo patrón:

1. Crear script en `backend/scripts/`
2. Agregar comando en `package.json`
3. Documentar en este archivo

