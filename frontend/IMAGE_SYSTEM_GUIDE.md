# 🖼️ Sistema de Gestión de Imágenes - Guía Completa

## ✨ Características Implementadas

✅ **Upload de imágenes**: Subir archivos directamente desde el dashboard  
✅ **Galería de imágenes**: Ver todas las imágenes disponibles  
✅ **Drag & Drop**: Arrastrar y soltar imágenes  
✅ **Compresión automática**: Optimizar imágenes al subirlas (hasta 500KB)  
✅ **Recorte de imágenes**: Editar imágenes antes de guardar  
✅ **Preview en tiempo real**: Ver la imagen antes de guardar  
✅ **Organización por carpetas**: Navegar entre diferentes carpetas  
✅ **Eliminación de imágenes**: Eliminar imágenes directamente desde la galería  

---

## 🚀 Cómo Usar el Sistema

### 1. Acceder al Gestor de Imágenes

En cualquier formulario de **Perfumes**, **Marcas** o **Decants**, verás un botón **🖼️ Galería** junto al campo de URL de imagen.

### 2. Subir una Nueva Imagen

**Opción A: Drag & Drop**
1. Click en el botón "🖼️ Galería"
2. Ir a la pestaña "📤 Subir Nueva"
3. Arrastra y suelta tu imagen en el área indicada
4. La imagen se comprimirá automáticamente
5. ¡Listo! La imagen se guardará en `/img/uploads/`

**Opción B: Seleccionar archivo**
1. Click en el botón "🖼️ Galería"
2. Ir a la pestaña "📤 Subir Nueva"
3. Click en el área de subida
4. Selecciona el archivo desde tu computadora
5. La imagen se subirá automáticamente

### 3. Seleccionar una Imagen Existente

1. Click en el botón "🖼️ Galería"
2. En la pestaña "📁 Galería", verás carpetas disponibles:
   - `uploads`: Imágenes subidas desde el dashboard
   - `armaf`, `lattafa`, etc.: Carpetas existentes con imágenes
3. Click en una carpeta para ver sus imágenes
4. Click en una imagen para seleccionarla
5. Click en "Usar esta imagen"

### 4. Recortar una Imagen

1. Selecciona una imagen de la galería
2. Click en el botón "Recortar"
3. Ajusta el área de recorte:
   - Arrastra las esquinas para cambiar el tamaño
   - Arrastra el centro para mover el recorte
   - Selecciona una proporción: Cuadrado (1:1), Vertical (3:2), etc.
4. Click en "Guardar recorte"

---

## 📂 Estructura de Carpetas

```
frontend/public/img/
├── uploads/                 # Imágenes subidas desde el dashboard
│   ├── imagen1-timestamp.jpg
│   └── imagen2-timestamp.png
│
├── armaf/                  # Imágenes de Armaf
│   ├── hombre/
│   └── mujer/
│
├── lattafa/                # Imágenes de Lattafa
│   ├── hombre/
│   └── mujer/
│
└── decants/                # Imágenes de decants
    └── decant1.jpg
```

---

## 🔧 Características Técnicas

### Compresión Automática

Todas las imágenes subidas se comprimen automáticamente:
- **Tamaño máximo**: 500KB
- **Dimensiones máximas**: 1920px
- **Calidad**: Optimizada para web
- **Formatos soportados**: JPG, PNG, GIF, WebP

### Seguridad

- ✅ Solo usuarios admin pueden subir/eliminar imágenes
- ✅ Validación de tipo de archivo
- ✅ Límite de tamaño de 10MB antes de compresión
- ✅ Nombres de archivo seguros (sanitizados)

### Performance

- ✅ Carga lazy de imágenes en la galería
- ✅ Navegación rápida entre carpetas
- ✅ Preview instantáneo sin recargar

---

## 📝 Flujo de Trabajo Recomendado

### Para Perfumes Nuevos

1. **Preparar la imagen**:
   - Toma/descarga la imagen del perfume
   - No te preocupes por el tamaño, se optimizará automáticamente

2. **Subir al dashboard**:
   - Abre el formulario de "Nuevo Perfume"
   - Click en "🖼️ Galería"
   - Arrastra la imagen o selecciónala
   - Espera a que se comprima y suba

3. **Opcional: Recortar**:
   - Si necesitas ajustar la imagen, usa el recorte
   - Selecciona proporción cuadrada (1:1) para mejor visualización

4. **Completar el formulario**:
   - La URL se llenará automáticamente
   - Completa nombre, precio, etc.
   - Guarda el perfume

### Para Organizar Imágenes

**Opción 1: Carpeta uploads (Recomendado)**
- Deja que el sistema guarde en `/img/uploads/`
- Es más simple y rápido
- Perfecto para empezar

**Opción 2: Organizar manualmente**
- Sube las imágenes primero
- Luego, manualmente mueve los archivos a carpetas específicas:
  - `frontend/public/img/armaf/hombre/`
  - `frontend/public/img/lattafa/mujer/`
- Actualiza la URL en el formulario

---

## 🎨 Recorte de Imágenes

### Proporciones Disponibles

| Proporción | Uso Recomendado |
|------------|-----------------|
| Libre | Cuando necesitas control total |
| Cuadrado (1:1) | **Perfumes** (mejor visualización) |
| Vertical (3:2) | Imágenes de detalle |
| Horizontal (2:3) | Banners |
| Panorámico (16:9) | Imágenes anchas |

### Consejos para Recortar

- Para perfumes, usa **proporción cuadrada (1:1)**
- Centra el producto en el recorte
- Evita recortar demasiado cerca de los bordes
- El recorte se guarda como una nueva imagen

---

## ⚠️ Solución de Problemas

### La imagen no se sube

**Posibles causas:**
- Archivo muy grande (máx. 10MB)
- Formato no soportado (solo JPG, PNG, GIF, WebP)
- No estás autenticado como admin

**Solución:**
1. Verifica el formato del archivo
2. Reduce el tamaño si es necesario
3. Refresca la página y vuelve a intentar

### La galería no muestra imágenes

**Posibles causas:**
- La carpeta está vacía
- No tienes permisos
- Error de conexión con el servidor

**Solución:**
1. Verifica que el backend esté corriendo
2. Recarga la página
3. Sube una imagen primero

### El recorte no funciona

**Posibles causas:**
- Imagen muy grande
- Navegador antiguo

**Solución:**
1. Usa un navegador moderno (Chrome, Firefox, Edge)
2. Comprime la imagen primero
3. Refresca la página

---

## 🔐 Permisos

### Usuarios Admin

✅ Subir imágenes  
✅ Ver todas las carpetas  
✅ Eliminar imágenes  
✅ Recortar imágenes  

### Usuarios Públicos

❌ No tienen acceso al gestor de imágenes  
✅ Solo ven las imágenes en los productos  

---

## 💡 Tips y Mejores Prácticas

### Al Subir Imágenes

1. **Usa nombres descriptivos**: `armaf-club-de-nuit.jpg` en lugar de `img001.jpg`
2. **Calidad adecuada**: No subas imágenes de más de 2-3MB
3. **Formato recomendado**: JPG para fotos, PNG para logos
4. **Evita espacios**: Usa guiones: `mi-perfume.jpg` en lugar de `mi perfume.jpg`

### Organización

1. **Carpeta uploads**: Para pruebas o imágenes temporales
2. **Carpetas por marca**: Para organización a largo plazo
3. **Elimina imágenes no usadas**: Mantén la galería limpia

### Performance

1. **Comprime antes de subir**: Aunque hay compresión automática, es más rápido
2. **Usa el recorte sabiamente**: Solo cuando sea necesario
3. **Elimina duplicados**: Evita tener la misma imagen múltiples veces

---

## 📊 Estadísticas y Monitoreo

### Información Visible

En cada carpeta verás:
- **Nombre de la carpeta**
- **Cantidad de imágenes**
- **Última modificación**

En cada imagen verás:
- **Nombre del archivo**
- **Tamaño en KB/MB**
- **Fecha de creación**

---

## 🆘 Soporte

Si encuentras problemas:

1. Verifica la consola del navegador (F12)
2. Verifica que el backend esté corriendo
3. Verifica los permisos de la carpeta `/img/uploads/`

### Logs del Backend

El servidor muestra logs cuando:
- Se sube una imagen
- Se lista una carpeta
- Se elimina una imagen

---

## 🚀 Próximas Mejoras (Opcionales)

Si necesitas estas funcionalidades, házmelo saber:

- [ ] **Mover imágenes entre carpetas**
- [ ] **Renombrar imágenes**
- [ ] **Comprimir imágenes existentes**
- [ ] **Vista en cuadrícula más grande**
- [ ] **Búsqueda de imágenes por nombre**
- [ ] **Filtros por fecha/tamaño**
- [ ] **Subida múltiple (varias imágenes a la vez)**

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0


