# Frontend - Perfumería Oasis Deluxe

Aplicación React para la perfumería Oasis Deluxe, migrada desde HTML/CSS/JS vanilla.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── img/          # Imágenes del proyecto
├── src/
│   ├── components/  # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── WhatsAppFloat.jsx
│   │   ├── PerfumeCard.jsx
│   │   └── Carousel.jsx
│   ├── pages/       # Páginas/rutas
│   │   ├── Home.jsx
│   │   ├── Brands.jsx
│   │   ├── BrandDetail.jsx
│   │   ├── Decants.jsx
│   │   └── Contact.jsx
│   ├── services/     # Servicios y API
│   │   ├── api.js
│   │   └── data.js
│   ├── styles/      # Estilos globales
│   │   └── global.css
│   ├── App.jsx      # Componente principal
│   └── main.jsx     # Punto de entrada
└── package.json
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **React Router** - Enrutamiento
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP (preparado para backend)

## 📝 Estado del Proyecto

### ✅ Completado

- [x] Estructura del proyecto React
- [x] Migración de estilos CSS
- [x] Componentes base (Header, Footer, WhatsApp)
- [x] Componente Carousel con funcionalidad completa
- [x] Componente PerfumeCard
- [x] Página Home con carrusel y lista de perfumes
- [x] Página Brands con grid de marcas
- [x] Página BrandDetail para ver perfumes de una marca
- [x] Página Decants
- [x] Página Contact
- [x] React Router configurado
- [x] Datos temporales desde data.js

### 🔄 Pendiente

- [ ] Conectar con backend API
- [ ] Reemplazar datos estáticos por llamadas API
- [ ] Implementar panel de administración
- [ ] Optimización de imágenes
- [ ] SEO con React Helmet
- [ ] Testing

## 🔌 Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Características

- ✨ Diseño responsive
- 🎠 Carrusel interactivo con swipe
- 🔍 Paginación de perfumes
- 📱 Navegación móvil con menú hamburguesa
- 💬 Integración con WhatsApp
- 🎨 Estilos consistentes con el diseño original

## 🚧 Próximos Pasos

1. Conectar con el backend cuando esté listo
2. Implementar autenticación para el panel admin
3. Agregar búsqueda de perfumes
4. Implementar filtros por categoría/precio
5. Optimizar performance con lazy loading

## 📄 Licencia

© 2025 Perfumería Oasis Deluxe
