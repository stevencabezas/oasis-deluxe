# 🚀 Guía Completa de Deployment y Desarrollo Local

Esta guía te ayudará a trabajar localmente y desplegar cambios a producción.

---

## 📋 Tabla de Contenidos

1. [Configuración Local para Desarrollo](#configuración-local-para-desarrollo)
2. [Desplegar Backend a Render](#desplegar-backend-a-render)
3. [Desplegar Frontend a Vercel](#desplegar-frontend-a-vercel)
4. [Configurar Base de Datos en Neon](#configurar-base-de-datos-en-neon)
5. [Workflow: Hacer Cambios y Subirlos](#workflow-hacer-cambios-y-subirlos)
6. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---

## 🖥️ Configuración Local para Desarrollo

### Backend Local

#### 1. Configurar `.env` para desarrollo local

Crea o edita `backend/.env`:

```env
# ENTORNO
NODE_ENV=development

# BASE DE DATOS LOCAL (PostgreSQL en tu PC)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_password_local

# IMPORTANTE: Comenta o elimina DATABASE_URL para usar la BD local
# DATABASE_URL=postgresql://...

# SERVIDOR
PORT=5000

# JWT
JWT_SECRET=mi_secreto_super_seguro_123

# CORS
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE:** Si `DATABASE_URL` está presente, el backend lo usará **en lugar de** las variables individuales. Para trabajar localmente:
- **COMENTA** o **ELIMINA** la línea `DATABASE_URL`
- **DESCOMENTA** las variables `DB_HOST`, `DB_PORT`, etc.

#### 2. Iniciar Backend Local

```bash
cd backend
npm run dev
```

El backend correrá en: `http://localhost:5000`

#### 3. Poblar Base de Datos Local (si es necesario)

```bash
cd backend
npm run seed
```

---

### Frontend Local

#### 1. Configurar `.env` para desarrollo local

Crea o edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

**⚠️ NO uses** `.env.production` - ese es solo para builds de producción.

#### 2. Iniciar Frontend Local

```bash
cd frontend
npm run dev
```

El frontend correrá en: `http://localhost:5173`

---

## 🌐 Desplegar Backend a Render

### Credenciales Actuales

- **Servicio:** `oasis-deluxe`
- **URL:** `https://oasis-deluxe.onrender.com`
- **Repositorio:** `https://github.com/tu-usuario/react-landing-perfume`

### Variables de Entorno en Render

Ve a tu servicio en Render → **Environment** y asegúrate de tener:

```env
# Base de Datos (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require

# Entorno
NODE_ENV=production

# JWT (genera uno seguro en producción)
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion

# CORS (URL de tu frontend en Vercel)
FRONTEND_URL=https://oasis-deluxe.vercel.app

# Puerto (Render lo asigna automáticamente, pero puedes dejarlo)
PORT=5000
```

### Configuración de Build y Deploy

En Render, verifica:

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **MUY IMPORTANTE**

### Auto-Deploy

Render está configurado para **auto-desplegar** cuando haces push a la rama `main` en GitHub.

---

## 🎨 Desplegar Frontend a Vercel

### Credenciales Actuales

- **Proyecto:** `oasis-deluxe`
- **URL:** `https://oasis-deluxe.vercel.app`
- **Repositorio:** `https://github.com/tu-usuario/react-landing-perfume`

### Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://oasis-deluxe.onrender.com/api
```

⚠️ **IMPORTANTE:** Debe terminar en `/api`

### Configuración de Build

En Vercel, verifica:

- **Framework Preset:** `Vite`
- **Root Directory:** `frontend` ⚠️ **MUY IMPORTANTE**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Auto-Deploy

Vercel está configurado para **auto-desplegar** cuando haces push a la rama `main` en GitHub.

---

## 🗄️ Configurar Base de Datos en Neon

### Credenciales Actuales

- **Proyecto:** `oasis_deluxe`
- **Host:** `ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech`
- **Database:** `oasis_deluxe`
- **User:** `neondb_owner`
- **Password:** `npg_NI65lEBkzeSV`
- **Connection String:**
  ```
  postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require
  ```

### Poblar la Base de Datos de Neon

Desde tu computadora local:

#### 1. Configura temporalmente el `.env` del backend:

```env
DATABASE_URL=postgresql://neondb_owner:npg_NI65lEBkzeSV@ep-royal-waterfall-aevz14tx-pooler.c-2.us-east-2.aws.neon.tech/oasis_deluxe?sslmode=require
```

#### 2. Ejecuta el seed:

```bash
cd backend
npm run seed
```

#### 3. Restaura tu configuración local:

Comenta `DATABASE_URL` y descomenta las variables locales para seguir trabajando en tu PC.

---

## 🔄 Workflow: Hacer Cambios y Subirlos

### Proceso Completo

#### 1. **Trabaja Localmente**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

#### 2. **Haz tus cambios** en el código

Edita archivos, prueba localmente, etc.

#### 3. **Prueba que todo funcione** localmente

Asegúrate de que no haya errores en la consola.

#### 4. **Commit y Push a GitHub**

**Opción A: Con GitHub Desktop (Recomendado)**

1. Abre GitHub Desktop
2. Verás todos los archivos modificados
3. Escribe un mensaje descriptivo:
   - `feat: Add nueva funcionalidad X`
   - `fix: Corregir bug en Y`
   - `style: Mejorar diseño de Z`
4. Click en **Commit to main**
5. Click en **Push origin**

**Opción B: Con Terminal**

```bash
cd E:\Proyectos\react-landing-perfume
git add .
git commit -m "feat: Descripción de los cambios"
git push origin main
```

#### 5. **Deploys Automáticos**

- **Render:** Se redespliegará automáticamente (tarda ~2-3 minutos)
- **Vercel:** Se redespliegará automáticamente (tarda ~1 minuto)

#### 6. **Verifica en Producción**

- **Frontend:** `https://oasis-deluxe.vercel.app`
- **Backend API:** `https://oasis-deluxe.onrender.com/api/brands`

---

## 🔄 Casos de Uso Comunes

### Cambiar solo el Frontend

```bash
# 1. Haz cambios en archivos de frontend/
# 2. Prueba localmente
# 3. Commit y push
# 4. Vercel se redespliegará automáticamente
# 5. Render NO se redespliegará (no hubo cambios en backend/)
```

### Cambiar solo el Backend

```bash
# 1. Haz cambios en archivos de backend/
# 2. Prueba localmente
# 3. Commit y push
# 4. Render se redespliegará automáticamente
# 5. Vercel NO se redespliegará (no hubo cambios en frontend/)
```

### Cambiar ambos

```bash
# 1. Haz cambios en ambas carpetas
# 2. Prueba localmente
# 3. Commit y push
# 4. AMBOS se redesplegarán automáticamente
```

---

## 🛠️ Solución de Problemas Comunes

### Backend local no conecta a la BD

**Problema:** Error `connection refused`

**Solución:**
1. Asegúrate de que PostgreSQL esté corriendo en tu PC
2. Verifica que las credenciales en `.env` sean correctas
3. Verifica que `DATABASE_URL` esté comentado (para usar BD local)

---

### Frontend no se conecta al Backend

**Problema:** Error 404 o CORS

**Solución en Local:**
1. Verifica que `backend/.env` tenga `FRONTEND_URL=http://localhost:5173`
2. Verifica que `frontend/.env` tenga `VITE_API_URL=http://localhost:5000/api`
3. Reinicia ambos servidores

**Solución en Producción:**
1. Verifica variables de entorno en Vercel: `VITE_API_URL=https://oasis-deluxe.onrender.com/api`
2. Verifica variables de entorno en Render: `FRONTEND_URL=https://oasis-deluxe.vercel.app`
3. Redespliega si es necesario

---

### Error de Git "Permission Denied" en Windows

**Solución:** Usa **GitHub Desktop** en lugar de terminal.

---

### Render dice "Service is Live" pero devuelve 503

**Problema:** Render tardó mucho en iniciar (free tier)

**Solución:** Espera 1-2 minutos más, la primera petición después de inactividad puede tardar.

---

### Cambios no se reflejan en Producción

**Solución:**
1. Verifica que el commit se haya hecho: `git log`
2. Verifica que el push se haya completado: Revisa GitHub
3. Verifica el estado del deploy en Render/Vercel
4. Revisa los logs en Render/Vercel por errores

---

## 📝 Comandos Útiles Rápidos

### Backend

```bash
# Desarrollo
npm run dev

# Producción (local)
npm start

# Poblar base de datos
npm run seed

# Migración (agregar campo activo)
npm run migrate:activo
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Git

```bash
# Ver estado
git status

# Ver cambios
git diff

# Ver historial
git log --oneline

# Descartar cambios
git restore nombre-archivo

# Crear rama nueva
git checkout -b nombre-rama

# Cambiar de rama
git checkout main
```

---

## 🚀 Nueva Configuración desde Cero

Si necesitas configurar todo desde cero en el futuro:

### 1. **Neon (Base de Datos)**

1. Ve a https://neon.tech
2. Crea una cuenta / Inicia sesión
3. **Create Project**
4. Nombre: `oasis_deluxe` (o el que prefieras)
5. Region: **US East (Ohio)** (más cercano)
6. PostgreSQL Version: **16** (o la más reciente)
7. Copia el **Connection String** que te da

### 2. **Render (Backend)**

1. Ve a https://render.com
2. Crea una cuenta / Inicia sesión
3. **New** → **Web Service**
4. Conecta tu repositorio de GitHub
5. Configuración:
   - Name: `oasis-deluxe` (o el que prefieras)
   - Region: **Oregon** (free tier)
   - Branch: `main`
   - Root Directory: `backend` ⚠️
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
6. **Environment Variables** (agregar):
   ```
   DATABASE_URL=tu_connection_string_de_neon
   NODE_ENV=production
   JWT_SECRET=un_secreto_muy_seguro_123456
   FRONTEND_URL=https://tu-app.vercel.app
   ```
7. Click en **Create Web Service**
8. Espera que despliegue (~3 min)

### 3. **Vercel (Frontend)**

1. Ve a https://vercel.com
2. Crea una cuenta / Inicia sesión
3. **Add New** → **Project**
4. Importa tu repositorio de GitHub
5. Configuración:
   - Framework Preset: **Vite**
   - Root Directory: `frontend` ⚠️
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variables** (agregar):
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```
7. Click en **Deploy**
8. Espera que despliegue (~1 min)

### 4. **Poblar Base de Datos**

Desde tu PC local:

```bash
# 1. Edita backend/.env temporalmente
DATABASE_URL=tu_connection_string_de_neon

# 2. Ejecuta seed
cd backend
npm run seed

# 3. Restaura backend/.env para desarrollo local
```

---

## ✅ Checklist de Configuración Completa

### Desarrollo Local
- [ ] PostgreSQL instalado y corriendo
- [ ] `backend/.env` configurado para BD local
- [ ] `frontend/.env` configurado con `http://localhost:5000/api`
- [ ] Backend corre en `http://localhost:5000`
- [ ] Frontend corre en `http://localhost:5173`
- [ ] Ambos se comunican correctamente

### Producción
- [ ] Neon database creada y poblada
- [ ] Render configurado con variables de entorno
- [ ] Vercel configurado con variables de entorno
- [ ] Backend responde en `https://tu-backend.onrender.com/api`
- [ ] Frontend carga en `https://tu-frontend.vercel.app`
- [ ] Frontend se conecta correctamente al backend

---

## 🎓 Tips de Desarrollo

1. **Siempre trabaja en local primero** - Es más rápido y fácil de debugear
2. **Usa GitHub Desktop** - Evita errores de permisos en Windows
3. **Commits descriptivos** - `feat:`, `fix:`, `style:`, `docs:`
4. **Prueba antes de hacer push** - Ahorra tiempo y redeploys innecesarios
5. **Revisa los logs** - Render y Vercel tienen logs útiles para debugear
6. **No commitees archivos .env** - Ya están en `.gitignore`

---

## 📞 Referencias Rápidas

- **Dashboard Neon:** https://console.neon.tech
- **Dashboard Render:** https://dashboard.render.com
- **Dashboard Vercel:** https://vercel.com/dashboard
- **Repositorio GitHub:** https://github.com/tu-usuario/react-landing-perfume

---

**¡Tu aplicación está lista para desarrollo y producción!** 🎉

