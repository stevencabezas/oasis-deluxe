# Backend - Perfumería Oasis Deluxe

API REST para la perfumería Oasis Deluxe construida con Node.js, Express y PostgreSQL.

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- PostgreSQL 12+ (local o en la nube)
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Instalar y configurar PostgreSQL:**

**Opción A: PostgreSQL Local**
```bash
# Windows (con Chocolatey)
choco install postgresql

# macOS (con Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Opción B: PostgreSQL en la nube (recomendado para desarrollo)**
- [ElephantSQL](https://www.elephantsql.com/) - Gratis hasta 20MB
- [Supabase](https://supabase.com/) - Gratis hasta 500MB
- [Neon](https://neon.tech/) - Gratis hasta 3GB

3. **Crear la base de datos:**
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE oasis_deluxe;

# Salir
\q
```

4. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oasis_deluxe
DB_USER=postgres
DB_PASSWORD=tu_contraseña
FRONTEND_URL=http://localhost:5173
```

5. **Poblar la base de datos:**
```bash
npm run seed
```

6. **Iniciar el servidor:**
```bash
# Desarrollo (con watch mode)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
backend/
├── config/          # Configuración de base de datos
│   └── database.js
├── controllers/     # Controladores de las rutas
│   ├── brandsController.js
│   ├── perfumesController.js
│   └── decantsController.js
├── models/          # Modelos de Sequelize
│   ├── Brand.js
│   ├── Perfume.js
│   └── Decant.js
├── routes/          # Rutas de Express
│   ├── brands.js
│   ├── perfumes.js
│   └── decants.js
├── scripts/         # Scripts de utilidad
│   └── seedDatabase.js
├── server.js        # Archivo principal
├── package.json
└── README.md
```

## 🔌 Endpoints de la API

### Health Check
- `GET /api/health` - Verificar estado del servidor

### Brands (Marcas)
- `GET /api/brands` - Obtener todas las marcas
  - Query params: `categoria` (arabes, disenador, nichos)
- `GET /api/brands/:id` - Obtener marca por ID
- `GET /api/brands/slug/:slug` - Obtener marca por slug (incluye perfumes)
- `POST /api/brands` - Crear nueva marca (admin)

### Perfumes
- `GET /api/perfumes` - Obtener todos los perfumes
  - Query params:
    - `page` - Número de página (default: 1)
    - `limit` - Items por página (default: 12)
    - `categoria` - Filtrar por categoría (hombre, mujer, unisex)
    - `marcaId` - Filtrar por marca
    - `minPrice` - Precio mínimo
    - `maxPrice` - Precio máximo
    - `search` - Búsqueda por nombre
- `GET /api/perfumes/:id` - Obtener perfume por ID
- `POST /api/perfumes` - Crear nuevo perfume (admin)

### Decants
- `GET /api/decants` - Obtener todos los decants
- `GET /api/decants/:id` - Obtener decant por ID
- `POST /api/decants` - Crear nuevo decant (admin)

## 📝 Ejemplos de Uso

### Obtener todas las marcas árabes
```bash
curl http://localhost:5000/api/brands?categoria=arabes
```

### Obtener perfumes con paginación
```bash
curl http://localhost:5000/api/perfumes?page=1&limit=12
```

### Obtener marca con perfumes
```bash
curl http://localhost:5000/api/brands/slug/afnan
```

### Buscar perfumes
```bash
curl http://localhost:5000/api/perfumes?search=kharmah
```

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para PostgreSQL
- **CORS** - Middleware para permitir requests cross-origin
- **dotenv** - Gestión de variables de entorno

## 🔄 Scripts Disponibles

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar servidor en modo desarrollo (con watch)
- `npm run seed` - Poblar la base de datos con datos iniciales

## 📦 Modelos de Datos

### Brand (Marca)
```javascript
{
  id: Integer (auto-increment),
  brandId: String (único, ej: "afnan"),
  nombre: String,
  slug: String (único),
  categoria: 'arabes' | 'disenador' | 'nichos',
  logoUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Perfume
```javascript
{
  id: Integer (auto-increment),
  nombre: String,
  precio: Decimal(10,2),
  imagenUrl: String,
  categoria: 'hombre' | 'mujer' | 'unisex',
  marcaId: Integer (foreign key -> Brand.id),
  marcaBrandId: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Decant
```javascript
{
  id: Integer (auto-increment),
  nombre: String,
  imagen: String,
  precio2ml: Decimal(10,2),
  precio5ml: Decimal(10,2),
  precio10ml: Decimal(10,2),
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 Relaciones

- **Brand** tiene muchos **Perfume** (1:N)
- **Perfume** pertenece a **Brand** (N:1)
- **Decant** es independiente (sin relaciones)

## 🐛 Solución de Problemas

### Error: "relation does not exist"
```bash
# Asegúrate de que las tablas se hayan creado
npm run seed
```

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica las credenciales en `.env`
- Verifica que la base de datos exista: `psql -U postgres -l`

### Error: "password authentication failed"
- Verifica el usuario y contraseña en `.env`
- En PostgreSQL local, puede necesitar cambiar la configuración de autenticación en `pg_hba.conf`

## 🚧 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar validación de datos con Joi o express-validator
- [ ] Implementar panel de administración
- [ ] Agregar tests unitarios e integración
- [ ] Implementar rate limiting
- [ ] Agregar logging con Winston
- [ ] Optimizar consultas con índices
- [ ] Implementar caché con Redis
- [ ] Agregar migraciones de base de datos

## 📄 Licencia

© 2025 Perfumería Oasis Deluxe
