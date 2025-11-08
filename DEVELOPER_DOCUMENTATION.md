# 📚 Documentación para Desarrolladores - Perfumería Oasis Deluxe

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Autenticación y Seguridad](#autenticación-y-seguridad)
6. [Base de Datos](#base-de-datos)
7. [API Endpoints](#api-endpoints)
8. [Sistema de Gestión de Imágenes](#sistema-de-gestión-de-imágenes)
9. [Guía de Desarrollo](#guía-de-desarrollo)
10. [Despliegue](#despliegue)

---

## 🎯 Visión General

**Perfumería Oasis Deluxe** es una aplicación web full-stack para la gestión y visualización de perfumes, marcas y decants. El proyecto está dividido en dos partes principales:

- **Frontend**: Aplicación React con Vite
- **Backend**: API REST con Node.js, Express y PostgreSQL

### Tecnologías Principales

**Frontend:**
- React 19
- React Router 7
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- JWT (Autenticación)
- bcryptjs (Encriptación de contraseñas)

---

## 🏗️ Arquitectura del Proyecto

```
react-landing-perfume/
├── backend/                 # API REST
│   ├── config/             # Configuración de base de datos
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Middlewares (auth, etc.)
│   ├── models/             # Modelos de Sequelize
│   ├── routes/             # Rutas de Express
│   ├── scripts/            # Scripts de utilidad (seed)
│   └── server.js           # Punto de entrada
│
├── frontend/               # Aplicación React
│   ├── public/             # Archivos estáticos
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Páginas/rutas
│       │   └── admin/     # Páginas de administración
│       ├── services/       # Servicios API
│       └── styles/         # Estilos CSS
│
└── img/                    # Imágenes del proyecto
```

---

## 🔧 Backend

### Estructura

#### **Configuración**
- `config/database.js`: Configuración de Sequelize y conexión a PostgreSQL

#### **Modelos** (`models/`)
- `Brand.js`: Modelo de marcas
- `Perfume.js`: Modelo de perfumes (relación con Brand)
- `Decant.js`: Modelo de decants
- `User.js`: Modelo de usuarios administradores
- `index.js`: Define relaciones entre modelos

#### **Controladores** (`controllers/`)
- `authController.js`: Login, registro, verificación de token
- `brandsController.js`: CRUD de marcas
- `perfumesController.js`: CRUD de perfumes
- `decantsController.js`: CRUD de decants

#### **Rutas** (`routes/`)
- `auth.js`: `/api/auth/*` - Autenticación
- `brands.js`: `/api/brands/*` - Marcas
- `perfumes.js`: `/api/perfumes/*` - Perfumes
- `decants.js`: `/api/decants/*` - Decants

#### **Middleware** (`middleware/`)
- `auth.js`: 
  - `authenticateToken`: Verifica token JWT
  - `requireAdmin`: Verifica que el usuario sea admin

### Variables de Entorno

Archivo: `backend/.env`

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu-secret-key-segura
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Scripts Disponibles

```bash
npm start      # Iniciar servidor en producción
npm run dev    # Iniciar servidor en desarrollo (con watch)
npm run seed   # Poblar base de datos con datos iniciales
```

---

## 🎨 Frontend

### Estructura

#### **Páginas Públicas** (`pages/`)
- `Home.jsx`: Página principal con carrusel y lista de perfumes
- `Brands.jsx`: Lista de marcas por categoría
- `BrandDetail.jsx`: Detalle de marca con perfumes
- `Decants.jsx`: Lista de decants
- `Contact.jsx`: Información de contacto

#### **Páginas de Administración** (`pages/admin/`)
- `Dashboard.jsx`: Panel principal de administración
- `BrandsManagement.jsx`: CRUD de marcas
- `PerfumesManagement.jsx`: CRUD de perfumes
- `DecantsManagement.jsx`: CRUD de decants
- `Login.jsx`: Página de login

#### **Componentes** (`components/`)
- `Header.jsx`: Navegación principal
- `Footer.jsx`: Pie de página
- `WhatsAppFloat.jsx`: Botón flotante de WhatsApp
- `PerfumeCard.jsx`: Tarjeta de perfume
- `Carousel.jsx`: Carrusel de imágenes
- `ProtectedRoute.jsx`: Componente para proteger rutas

#### **Servicios** (`services/`)
- `api.js`: Cliente Axios con interceptores y métodos API
- `data.js`: Datos estáticos (legacy, ya no se usa)

### Variables de Entorno

Archivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Scripts Disponibles

```bash
npm run dev     # Iniciar servidor de desarrollo
npm run build   # Compilar para producción
npm run preview # Previsualizar build de producción
```

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

1. **Registro (solo primer usuario)**
   - `POST /api/auth/register`
   - Crea el primer usuario administrador
   - Retorna token JWT

2. **Login**
   - `POST /api/auth/login`
   - Valida credenciales
   - Retorna token JWT y datos del usuario

3. **Verificación**
   - `GET /api/auth/verify`
   - Verifica que el token sea válido
   - Retorna datos del usuario

### Uso del Token

El token se almacena en `localStorage` y se envía en el header:
```
Authorization: Bearer <token>
```

### Rutas Protegidas

Las siguientes rutas requieren autenticación y permisos de admin:

**Backend:**
- `POST /api/brands` - Crear marca
- `PUT /api/brands/:id` - Actualizar marca
- `DELETE /api/brands/:id` - Eliminar marca
- `POST /api/perfumes` - Crear perfume
- `PUT /api/perfumes/:id` - Actualizar perfume
- `DELETE /api/perfumes/:id` - Eliminar perfume
- `POST /api/decants` - Crear decant
- `PUT /api/decants/:id` - Actualizar decant
- `DELETE /api/decants/:id` - Eliminar decant

**Frontend:**
- `/admin/dashboard` - Dashboard principal
- `/admin/brands` - Gestión de marcas
- `/admin/perfumes` - Gestión de perfumes
- `/admin/decants` - Gestión de decants

---

## 🗄️ Base de Datos

### Modelos y Relaciones

#### **Brand (Marcas)**
```sql
- id: INTEGER (PK, auto-increment)
- brand_id: STRING (único, ej: "afnan")
- nombre: STRING
- slug: STRING (único)
- categoria: ENUM('arabes', 'disenador', 'nichos')
- logo_url: STRING
- activo: BOOLEAN (default: true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### **Perfume**
```sql
- id: INTEGER (PK, auto-increment)
- nombre: STRING
- precio: DECIMAL(10,2)
- imagen_url: STRING
- categoria: ENUM('hombre', 'mujer', 'unisex')
- marca_id: INTEGER (FK -> brands.id)
- marca_brand_id: STRING
- activo: BOOLEAN (default: true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Relación:** `Brand` tiene muchos `Perfume` (1:N)

#### **Decant**
```sql
- id: INTEGER (PK, auto-increment)
- nombre: STRING
- imagen: STRING
- precio_2ml: DECIMAL(10,2)
- precio_5ml: DECIMAL(10,2)
- precio_10ml: DECIMAL(10,2)
- activo: BOOLEAN (default: true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### **User (Administradores)**
```sql
- id: INTEGER (PK, auto-increment)
- username: STRING (único)
- email: STRING (único)
- password: STRING (encriptado con bcrypt)
- role: ENUM('admin', 'user') (default: 'admin')
- activo: BOOLEAN (default: true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Índices

- `brands`: slug, categoria, brand_id
- `perfumes`: marca_id, categoria, marca_brand_id, activo
- `users`: username, email

---

## 🌐 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar primer admin | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/verify` | Verificar token | Sí |

### Marcas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/brands` | Obtener todas las marcas | No |
| GET | `/api/brands/:id` | Obtener marca por ID | No |
| GET | `/api/brands/slug/:slug` | Obtener marca por slug (con perfumes) | No |
| POST | `/api/brands` | Crear marca | Sí (Admin) |
| PUT | `/api/brands/:id` | Actualizar marca | Sí (Admin) |
| DELETE | `/api/brands/:id` | Eliminar marca (soft delete) | Sí (Admin) |
| PATCH | `/api/brands/:id/activate` | Activar marca | Sí (Admin) |

**Query Params (GET /api/brands):**
- `categoria`: Filtrar por categoría (arabes, disenador, nichos)
- `search`: Búsqueda por nombre, brandId o slug
- `includeInactive`: Incluir marcas inactivas (true/false)

### Perfumes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfumes` | Obtener perfumes (paginado) | No |
| GET | `/api/perfumes/:id` | Obtener perfume por ID | No |
| POST | `/api/perfumes` | Crear perfume | Sí (Admin) |
| PUT | `/api/perfumes/:id` | Actualizar perfume | Sí (Admin) |
| DELETE | `/api/perfumes/:id` | Eliminar perfume (soft delete) | Sí (Admin) |
| PATCH | `/api/perfumes/:id/activate` | Activar perfume | Sí (Admin) |

**Query Params (GET /api/perfumes):**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 12)
- `categoria`: Filtrar por categoría (hombre, mujer, unisex)
- `marcaId`: Filtrar por marca
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `search`: Búsqueda por nombre
- `includeInactive`: Incluir perfumes inactivos (true/false)

### Decants

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/decants` | Obtener todos los decants | No |
| GET | `/api/decants/:id` | Obtener decant por ID | No |
| POST | `/api/decants` | Crear decant | Sí (Admin) |
| PUT | `/api/decants/:id` | Actualizar decant | Sí (Admin) |
| DELETE | `/api/decants/:id` | Eliminar decant (soft delete) | Sí (Admin) |
| PATCH | `/api/decants/:id/activate` | Activar decant | Sí (Admin) |

**Query Params (GET /api/decants):**
- `search`: Búsqueda por nombre
- `includeInactive`: Incluir decants inactivos (true/false)

### Imágenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/images/upload` | Subir imagen | Sí (Admin) |
| GET | `/api/images/list` | Listar imágenes de carpeta | Sí (Admin) |
| GET | `/api/images/folders` | Listar carpetas disponibles | Sí (Admin) |
| DELETE | `/api/images/:filename` | Eliminar imagen | Sí (Admin) |

**Query Params (GET /api/images/list):**
- `folder`: Nombre de la carpeta (ej: `uploads`, `armaf`)

**Query Params (DELETE /api/images/:filename):**
- `folder`: Carpeta donde está la imagen

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del servidor |

---

## 🖼️ Sistema de Gestión de Imágenes

### Características

El sistema incluye gestión completa de imágenes:

✅ **Upload de imágenes**: Subir archivos directamente  
✅ **Galería de imágenes**: Ver todas las imágenes  
✅ **Drag & Drop**: Arrastrar y soltar  
✅ **Compresión automática**: Optimiza hasta 500KB  
✅ **Recorte de imágenes**: Editar antes de guardar  
✅ **Preview en tiempo real**: Ver antes de guardar  

### Componentes Frontend

#### ImageManager
Componente principal que integra upload y galería.

#### ImageUploader
- Drag & Drop
- Compresión automática con `browser-image-compression`
- Validación de tipo y tamaño
- Progress bar

#### ImageGallery
- Navegación por carpetas
- Grid de imágenes con lazy loading
- Preview de imagen seleccionada
- Eliminación de imágenes

#### ImageCropper
- Recorte con `react-image-crop`
- Proporciones predefinidas: 1:1, 3:2, 16:9, etc.
- Preview en tiempo real

### Backend

#### Configuración (config/upload.js)
- Multer para manejo de uploads
- Almacenamiento en `frontend/public/img/uploads`
- Validación de tipo y tamaño
- Sanitización de nombres

#### Controlador (controllers/imagesController.js)
- `uploadImage`: Subir imagen
- `listImages`: Listar imágenes de carpeta
- `listFolders`: Listar carpetas disponibles
- `deleteImage`: Eliminar imagen

### Integración

Disponible en todos los formularios:
- Perfumes Management
- Brands Management
- Decants Management

Botón "🖼️ Galería" junto al campo de URL.

### Documentación Detallada

- Frontend: `frontend/IMAGE_SYSTEM_GUIDE.md`
- Backend: `backend/API_IMAGES.md`

---

## 🚀 Guía de Desarrollo

### Configuración Inicial

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd react-landing-perfume
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run seed  # Poblar base de datos
npm run dev   # Iniciar servidor
```

3. **Frontend**
```bash
cd frontend
npm install
npm run dev   # Iniciar servidor de desarrollo
```

### Crear Primer Usuario Admin

1. Ir a `http://localhost:5173/admin/login`
2. Click en "¿Primera vez? Crear administrador"
3. Completar formulario:
   - Email
   - Usuario
   - Contraseña (mínimo 6 caracteres)
4. Click en "Registrar"

### Flujo de Trabajo

#### **Agregar Nueva Marca**
1. Login en `/admin/login`
2. Ir a "Gestionar Marcas"
3. Click en "+ Nueva Marca"
4. Completar formulario:
   - ID (slug): ej. "nueva-marca"
   - Nombre: ej. "Nueva Marca"
   - Categoría: Seleccionar
   - URL del Logo (opcional)
5. Click en "Crear"

#### **Agregar Nuevo Perfume**
1. Ir a "Gestionar Perfumes"
2. Click en "+ Nuevo Perfume"
3. Completar formulario:
   - Nombre
   - Precio
   - URL de Imagen
   - Categoría (hombre/mujer/unisex)
   - Marca (ID o slug de la marca)
4. Click en "Crear"

#### **Editar Precio de Perfume**
1. Ir a "Gestionar Perfumes"
2. Buscar el perfume en la tabla
3. Click en "Editar"
4. Modificar el precio
5. Click en "Actualizar"

### Convenciones de Código

- **Nombres de archivos**: PascalCase para componentes (ej: `BrandDetail.jsx`)
- **Variables**: camelCase (ej: `perfumesList`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`)
- **Componentes**: PascalCase (ej: `PerfumeCard`)

### Estructura de Commits

```
feat: Agregar nueva funcionalidad
fix: Corregir bug
docs: Actualizar documentación
style: Cambios de formato
refactor: Refactorizar código
test: Agregar tests
chore: Tareas de mantenimiento
```

---

## 📦 Despliegue

### Backend

1. **Variables de entorno en producción:**
```env
NODE_ENV=production
DB_HOST=tu-host-postgresql
DB_NAME=oasis_deluxe
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña_segura
JWT_SECRET=secret-key-muy-segura-y-larga
FRONTEND_URL=https://tu-dominio.com
```

2. **Iniciar servidor:**
```bash
npm start
```

### Frontend

1. **Build para producción:**
```bash
npm run build
```

2. **Los archivos estarán en `frontend/dist/`**

3. **Servir con cualquier servidor estático:**
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - GitHub Pages

### Consideraciones de Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Validación de datos en backend
- ✅ CORS configurado
- ✅ Rutas protegidas con middleware
- ⚠️ Cambiar `JWT_SECRET` en producción
- ⚠️ Usar HTTPS en producción
- ⚠️ Configurar rate limiting
- ⚠️ Validar y sanitizar inputs

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

### Error: "password authentication failed"
- Verificar credenciales en `.env`
- Verificar que PostgreSQL esté corriendo

### Error: "Token inválido"
- Verificar que el token esté en `localStorage`
- Hacer logout y login nuevamente

### Error: "relation does not exist"
```bash
cd backend
npm run seed
```

---

## 📝 Notas Adicionales

- El proyecto usa **soft delete** para perfumes y decants (marca `activo: false`)
- Las marcas se eliminan permanentemente (hard delete)
- El registro de usuarios está deshabilitado después del primer usuario
- Las imágenes deben estar en `/public/img/` o rutas absolutas desde la raíz

---

## 👥 Contribución

Para contribuir al proyecto:

1. Crear una rama desde `main`
2. Hacer cambios
3. Commit con mensajes descriptivos
4. Push y crear Pull Request

---

## 📄 Licencia

© 2025 Perfumería Oasis Deluxe

---

**Última actualización:** Noviembre 2025

