# 🔐 Variables de Entorno - Guía Completa

Esta guía explica todas las variables de entorno necesarias para el proyecto.

---

## 📁 Archivos `.env` vs `.env.example`

### `.env` (NO SE SUBE A GIT)
- ✅ Contiene **credenciales reales**
- ✅ Está en `.gitignore`
- ✅ Cada desarrollador crea el suyo
- ❌ **NUNCA** se sube a GitHub

### `.env.example` (SÍ SE SUBE A GIT)
- ✅ Es una **plantilla sin credenciales**
- ✅ Documenta qué variables se necesitan
- ✅ Se sube a Git como referencia
- ❌ No contiene valores reales

---

## 🖥️ Backend - Variables de Entorno

### Crear `backend/.env`

Copia y pega esto en `backend/.env`:

```env
# ENTORNO
NODE_ENV=development

# BASE DE DATOS LOCAL (para desarrollo)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_password_postgresql

# BASE DE DATOS NEON (para usar BD de producción en local)
# Si descomentas esto, se usará en lugar de las variables de arriba
# DATABASE_URL=postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require

# SERVIDOR
PORT=5000

# JWT (OBLIGATORIO - genera uno seguro)
# Para generar: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=cd23c04642b75f81a7ed425f100c1252b39e6159efc35601889d991e040ec975d4d166ca53b68a9c735ac1cb5f8ea710372af20b6321829ed4d8b714c66012f1
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173
```

### Crear `backend/.env.example`

Para documentación (este SÍ se sube a Git):

```env
# ENTORNO
NODE_ENV=development

# BASE DE DATOS LOCAL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI

# BASE DE DATOS PRODUCCIÓN (Neon/Render)
# DATABASE_URL=postgresql://usuario:password@host:puerto/bd?sslmode=require

# SERVIDOR
PORT=5000

# JWT - ¡OBLIGATORIO!
# Genera uno con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=GENERA_UNO_SEGURO
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 🎨 Frontend - Variables de Entorno

### Crear `frontend/.env`

Para desarrollo local:

```env
VITE_API_URL=http://localhost:5000/api
```

### Crear `frontend/.env.example`

Para documentación:

```env
# URL del backend API
# Desarrollo: http://localhost:5000/api
# Producción: https://tu-backend.onrender.com/api
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Variables en Producción

### Render (Backend)

Ve a tu servicio en Render → **Environment**:

```env
DATABASE_URL=postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require
NODE_ENV=production
JWT_SECRET=cd23c04642b75f81a7ed425f100c1252b39e6159efc35601889d991e040ec975d4d166ca53b68a9c735ac1cb5f8ea710372af20b6321829ed4d8b714c66012f1
FRONTEND_URL=https://oasis-deluxe.vercel.app
PORT=5000
```

### Vercel (Frontend)

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://oasis-deluxe.onrender.com/api
```

---

## 🔐 Seguridad de JWT_SECRET

### ✅ Lo que hice para mejorar la seguridad:

1. **Eliminé los fallbacks inseguros:**
   - ❌ Antes: `process.env.JWT_SECRET || 'your-secret-key-here'`
   - ✅ Ahora: `process.env.JWT_SECRET` (obligatorio)

2. **Validación al iniciar:**
   - Si `JWT_SECRET` no está configurado, la app **no inicia**
   - Se muestra un error claro en los logs

3. **Mensaje de error explícito:**
   ```
   FATAL ERROR: JWT_SECRET no está configurado
   La aplicación no puede iniciar sin JWT_SECRET por razones de seguridad
   ```

### ❓ ¿Por qué es importante?

**ANTES (INSEGURO):**
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
```

- ❌ Si JWT_SECRET no está configurado, usa 'your-secret-key-here'
- ❌ Valor predecible = fácil de hackear
- ❌ Alguien podría generar tokens falsos
- ❌ Todos con ese código tendrían el mismo secreto

**AHORA (SEGURO):**
```javascript
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET no está configurado');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;
```

- ✅ Si JWT_SECRET no está, la app **falla inmediatamente**
- ✅ Obliga a configurar un secreto único y seguro
- ✅ No hay valores por defecto predecibles
- ✅ Fallo rápido = más fácil detectar el problema

---

## 🛠️ Generar JWT_SECRET Seguro

### Opción 1: Node.js (Recomendado)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Ejemplo de salida:**
```
cd23c04642b75f81a7ed425f100c1252b39e6159efc35601889d991e040ec975d4d166ca53b68a9c735ac1cb5f8ea710372af20b6321829ed4d8b714c66012f1
```

### Opción 2: Online (si no tienes Node)

Ve a: https://www.random.org/strings/
- Length: 64
- Format: Hex

### Opción 3: OpenSSL

```bash
openssl rand -hex 64
```

---

## 🔄 Tu Configuración Actual

### ✅ Lo que está BIEN:

1. **JWT_SECRET en Render:**
   ```
   cd23c04642b75f81a7ed425f100c1252b39e6159efc35601889d991e040ec975d4d166ca53b68a9c735ac1cb5f8ea710372af20b6321829ed4d8b714c66012f1
   ```
   - ✅ Es largo (128 caracteres hex = 64 bytes)
   - ✅ Es aleatorio
   - ✅ Es único
   - ✅ Está configurado en Render

2. **Código actualizado:**
   - ✅ Eliminados los fallbacks inseguros
   - ✅ Validación al inicio
   - ✅ Falla si JWT_SECRET no está configurado

### ⚠️ Lo que debes VERIFICAR:

1. **Backend local (`backend/.env`):**
   - Asegúrate de tener `JWT_SECRET` configurado
   - Puedes usar el mismo valor que en Render o generar uno nuevo para local

2. **Render:**
   - ✅ Ya lo configuraste correctamente
   - Render se redespliegará automáticamente con los cambios de código

---

## 📋 Checklist de Seguridad

### Desarrollo Local
- [ ] `backend/.env` existe y NO está en Git
- [ ] `JWT_SECRET` está configurado en `backend/.env`
- [ ] `frontend/.env` existe y NO está en Git
- [ ] `VITE_API_URL` apunta a localhost

### Producción
- [ ] `JWT_SECRET` configurado en Render (✅ ya lo hiciste)
- [ ] `DATABASE_URL` configurado en Render con SSL
- [ ] `FRONTEND_URL` configurado en Render
- [ ] `VITE_API_URL` configurado en Vercel

### Código
- [ ] ✅ Sin fallbacks inseguros en JWT
- [ ] ✅ Validación de JWT_SECRET al inicio
- [ ] ✅ `.env` en `.gitignore`
- [ ] `.env.example` como documentación (opcional)

---

## 🚨 Errores Comunes y Soluciones

### Error: "FATAL ERROR: JWT_SECRET no está configurado"

**Causa:** No existe `JWT_SECRET` en `.env` o en las variables de entorno.

**Solución:**
1. Genera un secreto: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. Agrégalo a tu `.env`:
   ```env
   JWT_SECRET=tu_secreto_generado_aqui
   ```
3. Reinicia el servidor

### Error: "Token inválido" después de hacer cambios

**Causa:** Cambiaste `JWT_SECRET` y los tokens antiguos ya no son válidos.

**Solución:**
1. Cierra sesión en el frontend
2. Vuelve a iniciar sesión
3. Se generará un nuevo token con el nuevo secreto

### Error: Backend no inicia en Render

**Causa:** `JWT_SECRET` no está configurado en Render.

**Solución:**
1. Ve a Render → tu servicio → Environment
2. Agrega `JWT_SECRET` con un valor seguro
3. Guarda (Render se redespliegará automáticamente)

---

## ✅ Resumen

### Antes (INSEGURO):
```javascript
❌ const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
```

### Ahora (SEGURO):
```javascript
✅ if (!process.env.JWT_SECRET) {
     process.exit(1);
   }
   const JWT_SECRET = process.env.JWT_SECRET;
```

### Tu configuración actual:
- ✅ **Render:** JWT_SECRET configurado correctamente
- ✅ **Código:** Fallbacks inseguros eliminados
- ⏳ **Local:** Verifica que tengas `JWT_SECRET` en `backend/.env`

---

¡Tu aplicación ahora es más segura! 🔐

