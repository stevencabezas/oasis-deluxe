# ⚡ Quick Start - Oasis Deluxe

Guía ultra-rápida para empezar a trabajar en el proyecto.

---

## 🚀 Primera Vez

### 1. Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/react-landing-perfume.git
cd react-landing-perfume
```

### 2. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar Backend

Crea `backend/.env`:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=5000
JWT_SECRET=mi_secreto_123
FRONTEND_URL=http://localhost:5173
```

### 4. Configurar Frontend

Crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Crear Base de Datos

Abre pgAdmin → Create Database → `oasis_deluxe`

### 6. Poblar Base de Datos

```bash
cd backend
npm run seed
```

### 7. Iniciar Servidores

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### 8. Abrir en Navegador

- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin/login
  - Usuario: `admin`
  - Password: `admin123`

---

## 🔄 Día a Día

### Empezar

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Terminar

```bash
# Ctrl+C en ambas terminales
```

### Hacer Cambios

1. Edita código
2. Prueba en http://localhost:5173
3. Commit y push con GitHub Desktop

---

## 📚 Más Info

- **Desarrollo Local:** [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Documentación:** [README.md](README.md)

---

## 🆘 Ayuda Rápida

### Backend no inicia

```bash
# Verifica que PostgreSQL esté corriendo
# Verifica backend/.env
# Revisa el puerto 5000
```

### Frontend no conecta

```bash
# Verifica que backend esté corriendo
# Verifica frontend/.env
# Reinicia el frontend
```

### Base de datos vacía

```bash
cd backend
npm run seed
```

---

## 🌐 URLs de Producción

- **Frontend:** https://oasis-deluxe.vercel.app
- **Admin:** https://oasis-deluxe.vercel.app/admin/login
- **API:** https://oasis-deluxe.onrender.com/api

---

¡Listo! 🎉

