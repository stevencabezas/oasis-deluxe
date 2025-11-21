# Guía de Gestión de Imágenes - Dashboard de Administración

## 📸 Cómo funciona el sistema de imágenes

### Ubicación de las imágenes

Todas las imágenes deben estar en la carpeta:
```
frontend/public/img/
```

**Importante:** La carpeta `public` es servida directamente por el servidor web, por lo que las rutas en el código deben empezar con `/img/`

### Estructura recomendada

```
frontend/public/img/
├── marca1/
│   ├── hombre/
│   │   ├── perfume1.jpg
│   │   └── perfume2.jpg
│   └── mujer/
│       ├── perfume3.jpg
│       └── perfume4.jpg
├── marca2/
│   └── unisex/
│       └── perfume5.jpg
├── decants/
│   ├── decant1.jpg
│   └── decant2.jpg
└── logos/
    ├── logo-marca1.png
    └── logo-marca2.png
```

## 🎨 Nueva funcionalidad: Preview de imágenes

### ¿Qué hace?

Cuando agregas o editas un perfume, marca o decant, ahora verás:

1. **Preview en tiempo real** de la imagen
2. **Validación visual**:
   - ✅ Borde verde = Imagen cargada correctamente
   - ❌ Borde rojo = Imagen no encontrada
3. **Mensajes informativos**:
   - "✓ Imagen cargada correctamente"
   - "⚠️ La imagen no se puede cargar. Verifica la ruta."

### ¿Cómo usar?

1. En el formulario, ingresa la URL de la imagen
2. Automáticamente verás el preview
3. Si la imagen no se carga, verifica la ruta

## 📝 Ejemplos de rutas correctas

### Para perfumes
```
/img/armaf/hombre/club-de-nuit.jpg
/img/lattafa/mujer/khamrah.jpg
/img/afnan/unisex/supremacy.jpg
```

### Para decants
```
/img/decants/creed-aventus.jpg
/img/decants/tom-ford-tobacco.jpg
```

### Para logos de marcas
```
/img/logos/armaf.png
/img/logos/lattafa.png
/img/LOGO_AFNAN.png
```

## ⚠️ ¿Qué pasa si la imagen no existe?

### En el Dashboard (Admin)
- Verás un mensaje de error: "⚠️ La imagen no se puede cargar"
- El preview tendrá un borde rojo
- **Puedes guardar de todos modos**, pero es mejor corregir la ruta primero

### En el sitio web público
- Se mostrará una imagen por defecto: `/img/logooasis.png`
- No se rompe la página, pero la experiencia del usuario no es ideal

## 📋 Checklist antes de agregar un producto

- [ ] La imagen está en la carpeta `frontend/public/img/`
- [ ] La ruta empieza con `/img/`
- [ ] El formato es JPG, PNG o WebP
- [ ] El preview se ve correctamente en el formulario
- [ ] El mensaje dice "✓ Imagen cargada correctamente"

## 🔧 Solución de problemas

### Problema: "La imagen no se puede cargar"

**Causas comunes:**
1. **Ruta incorrecta**: Verifica que empiece con `/img/`
2. **Archivo no existe**: Verifica que el archivo esté en `frontend/public/img/`
3. **Nombre incorrecto**: Verifica mayúsculas/minúsculas y extensión

**Solución:**
```
❌ Mal:  img/marca/perfume.jpg
❌ Mal:  ./img/marca/perfume.jpg
❌ Mal:  /public/img/marca/perfume.jpg
✅ Bien: /img/marca/perfume.jpg
```

### Problema: La imagen se ve en el dashboard pero no en el sitio

**Causa:** El servidor frontend puede estar cacheando la imagen.

**Solución:**
1. Refresca el navegador con `Ctrl+F5`
2. Verifica que el servidor de desarrollo esté corriendo
3. Limpia la caché del navegador

## 📷 Cómo agregar nuevas imágenes

### Opción 1: Manualmente (recomendado)

1. Copia la imagen a `frontend/public/img/[carpeta]/`
2. Anota la ruta completa: `/img/[carpeta]/[nombre].jpg`
3. En el dashboard, ingresa esa ruta en el formulario
4. Verifica que el preview se vea correctamente
5. Guarda el producto

### Opción 2: Estructura organizada por marca

Para perfumes, es recomendable organizarlos por marca y género:

```
frontend/public/img/
└── [nombre-marca]/
    ├── hombre/
    │   └── perfume1.jpg
    ├── mujer/
    │   └── perfume2.jpg
    └── unisex/
        └── perfume3.jpg
```

Ejemplo para Armaf:
```
/img/armaf/hombre/club-de-nuit-intense.jpg
/img/armaf/mujer/club-de-nuit-sillage.jpg
```

## 🚀 Mejoras futuras (opcional)

### Subida de imágenes directamente desde el dashboard

Actualmente las imágenes se agregan manualmente. En el futuro se puede implementar:

1. **Upload directo**: Botón para subir archivos desde el formulario
2. **Drag & Drop**: Arrastrar y soltar imágenes
3. **Compresión automática**: Optimizar imágenes al subirlas
4. **Galería**: Ver todas las imágenes disponibles

Si necesitas esta funcionalidad, házmelo saber.

## 🔐 Buenas prácticas

### Nombres de archivo
- ✅ Usar guiones en lugar de espacios: `club-de-nuit.jpg`
- ✅ Minúsculas: `perfume.jpg` en lugar de `Perfume.JPG`
- ✅ Descriptivos: `armaf-club-de-nuit.jpg` en lugar de `img001.jpg`
- ❌ Evitar caracteres especiales: `perfumé.jpg` → `perfume.jpg`

### Tamaño y formato
- **Formato:** JPG para fotos, PNG para logos con fondo transparente
- **Tamaño:** Máximo 500KB por imagen
- **Dimensiones:** Recomendado 800x800px para perfumes
- **Compresión:** Usar herramientas como TinyPNG antes de subir

### Organización
- Una carpeta por marca
- Subcarpetas por género (hombre, mujer, unisex)
- Nombres consistentes y descriptivos

## 📞 Soporte

Si tienes problemas con las imágenes:
1. Verifica la consola del navegador (F12)
2. Verifica que el servidor esté corriendo
3. Verifica las rutas en el código

---

**Última actualización:** Noviembre 2025

