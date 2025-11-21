# 🖥️ Configuración Rápida para Desarrollo Local

Este archivo contiene las configuraciones exactas para trabajar localmente.

> 💡 **Nota:** Para más detalles sobre seguridad de variables de entorno, consulta [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

---

## ⚙️ Backend - `backend/.env`

Crea o edita `backend/.env` con este contenido:

```env
# ENTORNO
NODE_ENV=development

# ===== OPCIÓN 1: BASE DE DATOS LOCAL (Recomendado para desarrollo) =====
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI

# ===== OPCIÓN 2: BASE DE DATOS NEON (Para testing con BD de producción) =====
# Si quieres usar Neon en desarrollo, comenta las líneas de arriba y descomenta esta:
# DATABASE_URL=<REDACTED_DATABASE_URL>

# SERVIDOR
PORT=5000

# JWT (para login admin) - ¡OBLIGATORIO!
# Genera uno seguro con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# O usa el mismo que en producción para testing
JWT_SECRET=<REDACTED_JWT_SECRET>
JWT_EXPIRES_IN=24h

# CORS (permite que el frontend local se conecte)
FRONTEND_URL=http://localhost:5173
```

### ⚠️ IMPORTANTE

- **Para trabajar LOCAL:** Usa `DB_HOST`, `DB_PORT`, etc. (COMENTA `DATABASE_URL`)
- **Para trabajar con NEON:** Usa `DATABASE_URL` (COMENTA las variables `DB_HOST`, `DB_PORT`, etc.)
- El sistema prioriza `DATABASE_URL` si está presente

---

## 🎨 Frontend - `frontend/.env`

Crea o edita `frontend/.env` con este contenido:

```env
# Backend local
VITE_API_URL=http://localhost:5000/api
```

⚠️ **NO uses** `.env.production` - Vite usa ese archivo solo para builds de producción.

---

## 🚀 Iniciar Servidores

### Backend (Terminal 1)

```bash
cd backend
npm run dev
```

✅ Correrá en: `http://localhost:5000`

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

✅ Correrá en: `http://localhost:5173`

---

## 📊 Poblar Base de Datos Local

Si tu base de datos local está vacía:

```bash
cd backend
npm run seed
```

Este comando:
- Conecta a la BD configurada en `.env`
- Crea las tablas (brands, perfumes, decants, users)
- Importa todos los datos desde `frontend/src/services/data.js`

---

## 🔑 Crear Usuario Administrador

El script de seed crea automáticamente un usuario admin:

```
Usuario: admin
Password: admin123
```

⚠️ **IMPORTANTE:** Cambia esta contraseña después de iniciar sesión por primera vez.

---

## ✅ Verificar que Todo Funcione

### 1. Backend API

Abre en tu navegador:
- http://localhost:5000/api/brands
- http://localhost:5000/api/perfumes
- http://localhost:5000/api/decants

Deberías ver JSON con datos.

### 2. Frontend

Abre: http://localhost:5173

Deberías ver la página de inicio con todos los perfumes y marcas.

### 3. Dashboard Admin

1. Ve a: http://localhost:5173/admin/login
2. Login: `admin` / `admin123`
3. Deberías entrar al dashboard

---

## 🔄 Cambiar entre BD Local y Neon

### Para usar BD LOCAL:

```env
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_password

# DATABASE_URL=...  ← COMENTA ESTA LÍNEA
```

### Para usar BD NEON:

```env
# backend/.env
# DB_HOST=localhost  ← COMENTA TODO ESTO
# DB_PORT=5432
# DB_NAME=oasis_deluxe
# DB_USER=postgres
# DB_PASSWORD=tu_password

DATABASE_URL=<REDACTED_DATABASE_URL>
```

**Después de cambiar:** Reinicia el servidor backend (`Ctrl+C` y `npm run dev`)

---

## 🛠️ Troubleshooting

### Error: "connection refused"

**Problema:** PostgreSQL no está corriendo

**Solución:**
1. Abre pgAdmin 4
2. Inicia el servidor PostgreSQL
3. O ejecuta: `net start postgresql-x64-16` (Windows)

### Error: "password authentication failed"

**Problema:** Contraseña incorrecta en `.env`

**Solución:**
1. Verifica tu contraseña de PostgreSQL
2. Actualiza `DB_PASSWORD` en `backend/.env`

### Error: "database oasis_deluxe does not exist"

**Problema:** La base de datos no existe

**Solución:**
1. Abre pgAdmin 4
2. Click derecho en "Databases" → Create → Database
3. Nombre: `oasis_deluxe`
4. Guarda
5. Ejecuta `npm run seed`

### Frontend muestra "Network Error"

**Problema:** Backend no está corriendo o URL incorrecta

**Solución:**
1. Verifica que el backend esté corriendo: http://localhost:5000/api/brands
2. Verifica `frontend/.env`: `VITE_API_URL=http://localhost:5000/api`
3. Reinicia el frontend

---

## 📝 Comandos Útiles

```bash
# Backend
cd backend
npm run dev          # Desarrollo con hot-reload
npm start            # Producción (sin hot-reload)
npm run seed         # Poblar base de datos

# Frontend
cd frontend
npm run dev          # Desarrollo con hot-reload
npm run build        # Build para producción
npm run preview      # Preview del build

# Base de datos
psql -U postgres                        # Conectar a PostgreSQL
\l                                      # Listar bases de datos
\c oasis_deluxe                         # Conectar a oasis_deluxe
\dt                                     # Listar tablas
SELECT COUNT(*) FROM brands;            # Contar marcas
```

---

## 🎯 Workflow Diario

### Empezar a trabajar

```bash
# 1. Abrir VS Code / Cursor
# 2. Abrir 2 terminales

# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# 3. Abrir navegador: http://localhost:5173
```

### Terminar de trabajar

```bash
# En ambas terminales
Ctrl + C

# Opcional: Commit si hiciste cambios
git add .
git commit -m "feat: descripción"
git push origin main
```

---

¡Listo para desarrollar! 🚀

