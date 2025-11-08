# API de Imágenes - Documentación

## Endpoints

Todos los endpoints requieren autenticación de admin.

### 1. Subir Imagen

**POST** `/api/images/upload`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
image: File
```

**Response:**
```json
{
  "message": "Imagen subida correctamente",
  "imageUrl": "/img/uploads/perfume-123456789.jpg",
  "filename": "perfume-123456789.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

**Errores:**
- `400`: No se proporcionó imagen
- `401`: No autorizado
- `500`: Error del servidor

---

### 2. Listar Imágenes

**GET** `/api/images/list?folder=uploads`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `folder` (opcional): Nombre de la carpeta (`uploads`, `armaf`, etc.)

**Response:**
```json
{
  "folder": "uploads",
  "count": 15,
  "images": [
    {
      "filename": "perfume-123456789.jpg",
      "path": "perfume-123456789.jpg",
      "url": "/img/uploads/perfume-123456789.jpg",
      "size": 245678,
      "created": "2025-11-07T10:30:00.000Z",
      "modified": "2025-11-07T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Listar Carpetas

**GET** `/api/images/folders`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "count": 5,
  "folders": [
    {
      "name": "uploads",
      "path": "/img/uploads",
      "imageCount": 15,
      "modified": "2025-11-07T10:30:00.000Z"
    },
    {
      "name": "armaf",
      "path": "/img/armaf",
      "imageCount": 42,
      "modified": "2025-11-05T15:20:00.000Z"
    }
  ]
}
```

---

### 4. Eliminar Imagen

**DELETE** `/api/images/:filename?folder=uploads`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `folder` (opcional): Carpeta donde está la imagen

**Response:**
```json
{
  "message": "Imagen eliminada correctamente"
}
```

**Errores:**
- `404`: Imagen no encontrada
- `401`: No autorizado
- `500`: Error del servidor

---

## Configuración

### Multer

Archivo: `backend/config/upload.js`

**Configuración:**
- **Destino**: `frontend/public/img/uploads`
- **Tamaño máximo**: 5MB
- **Tipos permitidos**: image/jpeg, image/jpg, image/png, image/gif, image/webp
- **Nombre de archivo**: Sanitizado automáticamente

**Formato de nombre:**
```
{nombre-sanitizado}-{timestamp}-{random}.{ext}
```

Ejemplo: `club-de-nuit-1699356789123-987654321.jpg`

---

## Seguridad

### Autenticación

Todos los endpoints requieren:
1. Token JWT válido
2. Usuario con rol `admin`

### Validación de Archivos

- Solo imágenes permitidas
- Tamaño máximo: 5MB
- Nombres sanitizados
- Extensiones verificadas

### Rutas Protegidas

```javascript
router.use(authenticateToken);
router.use(requireAdmin);
```

---

## Almacenamiento

### Estructura

```
frontend/public/img/
└── uploads/
    ├── perfume-1-1699356789123.jpg
    ├── logo-marca-1699356790456.png
    └── decant-1699356791789.webp
```

### Creación Automática

La carpeta `/uploads/` se crea automáticamente si no existe.

---

## Manejo de Errores

### Errores Comunes

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | No se proporcionó ninguna imagen | FormData vacío |
| 400 | Tipo de archivo no permitido | Archivo no es imagen |
| 401 | No autorizado | Token inválido |
| 403 | Forbidden | Usuario no es admin |
| 404 | Imagen no encontrada | Archivo no existe |
| 413 | Payload Too Large | Archivo > 5MB |
| 500 | Error del servidor | Error interno |

---

## Ejemplos de Uso

### JavaScript/Axios

**Subir imagen:**
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await axios.post('/api/images/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});

console.log(response.data.imageUrl); // /img/uploads/perfume-xxx.jpg
```

**Listar imágenes:**
```javascript
const response = await axios.get('/api/images/list', {
  params: { folder: 'uploads' },
  headers: { 'Authorization': `Bearer ${token}` }
});

console.log(response.data.images);
```

**Eliminar imagen:**
```javascript
await axios.delete(`/api/images/${filename}`, {
  params: { folder: 'uploads' },
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Testing

### Con cURL

**Subir imagen:**
```bash
curl -X POST http://localhost:5000/api/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

**Listar imágenes:**
```bash
curl -X GET "http://localhost:5000/api/images/list?folder=uploads" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Performance

### Optimizaciones

- Las imágenes no se procesan en el servidor (solo almacenamiento)
- La compresión se hace en el cliente (frontend)
- Lectura de directorios optimizada
- Sin base de datos (archivos directos)

### Límites

- **Upload**: 5MB por archivo
- **Folders**: Sin límite
- **Images**: Sin límite por carpeta

---

## Logs

El controlador registra:
- Subidas exitosas
- Errores al subir
- Listados de carpetas
- Eliminaciones

Ejemplo:
```
Error listando imágenes: [Error details]
Error eliminando imagen: [Error details]
```

---

**Última actualización**: Noviembre 2025

