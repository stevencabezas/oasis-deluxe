# 🚀 Guía de Deployment - Oasis Deluxe

## 📋 Información del Proyecto

**Stack de Deployment (Todo Gratis):**
- Frontend: Vercel (React + Vite)
- Backend: Render (Node.js + Express)
- Database: Neon (PostgreSQL)
- Repositorio: GitHub (Monorepo)

---

## 🔐 Credenciales de Neon (Base de Datos)

**Información extraída de tu connection string:**

```
Host: ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech
Port: 5432
Database: oasis_deluxe
User: neondb_owner
Password: npg_NI65lEBkzeSV
```

**Connection String Completa:**
```
postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require
```

⚠️ **IMPORTANTE:** Estas credenciales son sensibles. No las compartas públicamente.

---

## 📦 Paso 1: Subir a GitHub

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd E:\Proyectos\react-landing-perfume
git init
```

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `oasis-deluxe` (o el que prefieras)
3. **NO marques** "Initialize with README" (ya tienes archivos)
4. Visibilidad: **Private** (recomendado por seguridad)
5. Click "Create repository"

### 1.3 Conectar y subir

```bash
# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Oasis Deluxe - Frontend & Backend"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU-USUARIO/oasis-deluxe.git

# Cambiar a rama main
git branch -M main

# Subir código
git push -u origin main
```

**✅ Verificación:** Ve a tu repositorio en GitHub y verifica que veas las carpetas `frontend` y `backend`.

---

## 🗄️ Paso 2: Configurar Base de Datos (Neon)

### 2.1 Seed de la Base de Datos

Necesitas llenar tu base de datos en Neon con los datos iniciales.

**Opción A: Desde Render (después de desplegar backend)**
```bash
# En Render Shell
npm run seed
```

**Opción B: Desde tu computadora local**
```bash
# 1. Actualiza backend/.env con las credenciales de Neon
cd backend
# Edita .env con las credenciales de arriba

# 2. Ejecuta el seed
npm run seed
```

---

## 🔧 Paso 3: Deploy Backend (Render)

### 3.1 Crear Web Service

1. Ve a https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect tu repositorio de GitHub
4. **Autoriza Render** para acceder a tu repo

### 3.2 Configuración del Servicio

```
Name: oasis-deluxe-backend
Region: Oregon (US West) o el más cercano
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 3.3 Variables de Entorno

Click en "Advanced" → "Add Environment Variable":

```
DB_HOST = ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech
DB_PORT = 5432
DB_NAME = oasis_deluxe
DB_USER = neondb_owner
DB_PASSWORD = npg_NI65lEBkzeSV
DATABASE_URL = postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require
FRONTEND_URL = https://tu-app.vercel.app
JWT_SECRET = TU-SECRET-AQUI-MINIMO-32-CARACTERES
JWT_EXPIRES_IN = 7d
NODE_ENV = production
PORT = 5000
```

**⚠️ JWT_SECRET:** Genera uno seguro con:
```bash
# En tu terminal (Git Bash o WSL)
openssl rand -base64 32
```

O usa uno como: `oasis-deluxe-super-secret-jwt-key-2025-production-secure`

### 3.4 Deploy

1. Click "Create Web Service"
2. Espera ~2-3 minutos
3. Una vez desplegado, copia la URL (ej: `https://oasis-deluxe-backend.onrender.com`)

### 3.5 Seed Database

1. En Render Dashboard → Tu servicio → "Shell"
2. Ejecuta: `npm run seed`
3. Espera confirmación de datos importados

### 3.6 Verificar

Visita: `https://tu-backend.onrender.com/api/health`

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "connected"
}
```

---

## 🎨 Paso 4: Deploy Frontend (Vercel)

### 4.1 Import Project

1. Ve a https://vercel.com/new
2. Import tu repositorio de GitHub
3. Autoriza Vercel para acceder a tu repo

### 4.2 Configuración del Proyecto

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build (automático)
Output Directory: dist (automático)
Install Command: npm install (automático)
```

### 4.3 Variables de Entorno

Click "Environment Variables":

```
Name: VITE_API_URL
Value: https://tu-backend.onrender.com/api
```

**⚠️ IMPORTANTE:** Reemplaza `tu-backend.onrender.com` con la URL real de Render del paso anterior.

### 4.4 Deploy

1. Click "Deploy"
2. Espera ~1-2 minutos
3. Una vez desplegado, copia la URL (ej: `https://oasis-deluxe.vercel.app`)

---

## 🔄 Paso 5: Actualizar Backend con URL del Frontend

### 5.1 Actualizar FRONTEND_URL en Render

1. Ve a Render Dashboard → Tu backend → "Environment"
2. Edita `FRONTEND_URL`
3. Cambia de temporal a tu URL real de Vercel:
   ```
   FRONTEND_URL = https://oasis-deluxe.vercel.app
   ```
4. Click "Save Changes"
5. Render automáticamente redesplegará (~30 segundos)

---

## 👤 Paso 6: Crear Primer Usuario Admin

### 6.1 Acceder a la Aplicación

1. Ve a: `https://tu-app.vercel.app/admin/login`

### 6.2 Registrar Admin

1. Click en "Registrar Primera Cuenta"
2. Completa el formulario:
   - Username: admin (o el que prefieras)
   - Email: tu-email@example.com
   - Password: (usa una contraseña segura)
3. Click "Registrar"
4. Serás redirigido al dashboard

**⚠️ IMPORTANTE:** El registro se deshabilitará automáticamente después de crear el primer usuario. Solo ese usuario podrá acceder al admin.

---

## ✅ Verificación Post-Deployment

Verifica que todo funcione:

- [ ] **Frontend carga**: `https://tu-app.vercel.app`
- [ ] **Backend responde**: `https://tu-backend.onrender.com/api/health`
- [ ] **Login funciona**: Puedes iniciar sesión en `/admin/login`
- [ ] **Dashboard accesible**: Ves el panel de administración
- [ ] **CRUD funciona**:
  - [ ] Puedes ver marcas
  - [ ] Puedes ver perfumes
  - [ ] Puedes crear un perfume de prueba
  - [ ] Puedes editar
  - [ ] Puedes eliminar (soft delete)
  - [ ] Puedes activar
- [ ] **Búsqueda funciona**: El debouncing de 500ms funciona
- [ ] **Responsive**: Se ve bien en móvil
- [ ] **Imágenes cargan**: Las imágenes existentes se muestran

---

## 🔄 Flujo de Actualizaciones

### Actualizar código

```bash
# Hacer cambios en tu código local
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

**Resultado:**
- ✅ Vercel detectará el cambio y redesplegará frontend automáticamente (~1-2 min)
- ✅ Render detectará el cambio y redesplegará backend automáticamente (~2-3 min)

### Ver logs

**Frontend (Vercel):**
- Dashboard → Tu proyecto → Deployments → Click en el último → Logs

**Backend (Render):**
- Dashboard → Tu servicio → Logs (stream en tiempo real)

---

## 📸 Gestión de Imágenes en Producción

### Situación Actual

Las imágenes están en `frontend/public/img/`. Esto funciona para:
- ✅ Imágenes existentes (incluidas en el código)
- ❌ Imágenes subidas desde el dashboard (se pierden en cada deploy)

### Solución Temporal

**Para MVP inicial:**
1. Sube imágenes manualmente a `frontend/public/img/uploads/`
2. Haz commit y push
3. Se desplegarán con el frontend

### Solución Permanente (Más adelante)

Cuando tengas usuarios reales, migrar a **Cloudflare R2**:
- 10GB gratis
- $0 de egress
- CDN incluido
- Imágenes persistentes

Te ayudaré a implementarlo cuando lo necesites.

---

## ⚠️ Limitaciones del Free Tier

### Render (Backend)
- **Cold starts**: Se duerme tras 15 min de inactividad
- **Primera request**: ~30 segundos después de despertar
- **Solución**: Usa un servicio de ping (UptimeRobot gratis)

### Neon (Database)
- **Storage**: 500MB (suficiente para empezar)
- **Conexiones**: 1 conexión activa
- **Backups**: 7 días de retención

### Vercel (Frontend)
- **Bandwidth**: 100GB/mes (más que suficiente)
- **Build time**: Ilimitado en hobby plan

---

## 🐛 Troubleshooting

### Backend no arranca

**Check logs en Render:**
```
Error: password authentication failed
→ Verifica variables de entorno DB_PASSWORD
```

### Frontend no conecta con backend

**Verifica:**
1. CORS configurado correctamente en backend (FRONTEND_URL)
2. VITE_API_URL en Vercel apunta a Render
3. Backend está corriendo (no dormido)

### Base de datos vacía

```bash
# En Render Shell
npm run seed
```

### Error "Token inválido"

- Limpia localStorage
- Haz logout y login nuevamente
- Verifica JWT_SECRET en Render

---

## 📊 Monitoreo

### URLs Importantes

Guarda estas URLs:

```
Frontend: https://tu-app.vercel.app
Backend: https://tu-backend.onrender.com
API Health: https://tu-backend.onrender.com/api/health
Admin Login: https://tu-app.vercel.app/admin/login

Dashboards:
Vercel: https://vercel.com/dashboard
Render: https://render.com/dashboard
Neon: https://console.neon.tech
```

### Keep-Alive (Opcional)

Para evitar cold starts en Render:

1. Crea cuenta en https://uptimerobot.com (gratis)
2. Agrega monitor HTTP(s)
3. URL: `https://tu-backend.onrender.com/api/health`
4. Interval: 5 minutos

---

## 🎉 ¡Listo!

Tu aplicación está desplegada y funcionando en producción.

**Próximos pasos:**
1. ✅ Prueba todas las funcionalidades
2. ✅ Agrega contenido real (perfumes, marcas)
3. ✅ Comparte el link
4. 🚀 Recibe feedback de usuarios

**Cuando necesites escalar:**
- Dominio personalizado
- Cloudflare R2 para imágenes
- Planes pagos (si excedes límites)
- Analytics y monitoreo avanzado

---

**Documentación creada:** Noviembre 2025
**Stack:** React + Vite + Node.js + Express + PostgreSQL
**Costo:** $0/mes (MVP)




