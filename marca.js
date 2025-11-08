import { marcasData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const $ = (sel) => document.querySelector(sel);

    // Obtener ID de la marca desde la URL (?marca=afnan)
    const marcaId = new URLSearchParams(window.location.search).get('marca');

    // Buscar la marca
    const marca = marcasData.find(m => m.id === marcaId);
    if (!marca) {
        window.location.href = 'index.html';
        return;
    }

    // Formato CRC
    const formatCRC = (n) =>
        new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            maximumFractionDigits: 0
        }).format(n);

    // Permitir items como string (src) o como objeto { src, nombre, precio, sku, stock }
    const normalizeItem = (item) => {
        if (typeof item === 'string') return { src: item, nombre: null, precio: null };
        const precio = (item.precio ?? item.precio === 0) ? Number(item.precio) : null;
        return {
            src: item.src,
            nombre: item.nombre ?? null,
            precio: Number.isFinite(precio) ? precio : null,
            sku: item.sku ?? null,
            stock: item.stock ?? null
        };
    };

    const makeWhatsAppLink = (marcaNombre, item) => {
        const namePart = item.nombre ? ` - ${item.nombre}` : '';
        const pricePart = item.precio != null ? ` (${formatCRC(item.precio)})` : '';
        const text = `Hola, me interesa ${marcaNombre}${namePart}${pricePart}.`;
        return `https://wa.me/50687683732?text=${encodeURIComponent(text)}`;
    };

    // Crea el "card" de perfume respetando tu grid e imagen ya estilizada
    const createPerfumeItem = (marcaNombre, raw) => {
        const item = normalizeItem(raw);

        const wrap = document.createElement('div');
        wrap.className = 'perfumery-item';

        // Imagen (ya hereda tus estilos desde .perfumery-images img {...})
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.nombre ? `${item.nombre} - ${marcaNombre}` : `${marcaNombre}`;
        wrap.appendChild(img);

        // Nombre (si hay)
        if (item.nombre) {
            const name = document.createElement('div');
            name.className = 'perfume-name';
            name.textContent = item.nombre;
            wrap.appendChild(name);
        }

        // Precio o "Consultar"
        const price = document.createElement('div');
        price.className = 'perfume-price';
        price.textContent = item.precio != null ? formatCRC(item.precio) : 'Consultar';
        wrap.appendChild(price);

        // CTA: reutilizamos tu .btn-get-info
        const actions = document.createElement('div');
        actions.className = 'perfume-actions';

        const a = document.createElement('a');
        a.className = 'btn-get-info';
        a.href = makeWhatsAppLink(marcaNombre, item);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Comprar por WhatsApp';
        actions.appendChild(a);

        wrap.appendChild(actions);
        return wrap;
    };

    const renderList = (container, lista) => {
        container.innerHTML = '';
        if (!Array.isArray(lista) || lista.length === 0) {
            container.parentElement.classList.add('d-none');
            return;
        }
        container.parentElement.classList.remove('d-none');
        lista.forEach(item => container.appendChild(createPerfumeItem(marca.nombre, item)));
    };

    // Pintar título y secciones
    $('#marcaNombre').textContent = marca.nombre;
    renderList($('#hombres'), marca.perfumes.hombres);
    renderList($('#mujeres'), marca.perfumes.mujeres);
    renderList($('#unixes'), marca.perfumes.unixes);
});
