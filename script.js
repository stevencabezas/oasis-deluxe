import { marcasData } from './data.js';

function toggleMenu() {
    const navbar = document.querySelector('header .navbar');
    navbar.classList.toggle('active');
}


window.toggleMenu = toggleMenu;

function redirectToWhatsApp(brand, product, price, imageUrl) {
    const message = `Hola, estoy interesado en el perfume ${product} de ${brand}, que tiene un precio de ${price}. 
    ${imageUrl}`;

    const phoneNumber = '+50687683732';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');  // Abre el enlace en una nueva pestaña
}

document.addEventListener('DOMContentLoaded', () => {
    // Agregar el efecto de desplazamiento suave
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            // Evitar el comportamiento por defecto
            event.preventDefault();

            // Obtener el destino del enlace (el id de la sección)
            const targetId = link.getAttribute("href").substring(1); // Eliminar el '#' del href
            const targetElement = document.getElementById(targetId);

            // Realizar el desplazamiento suave
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: "smooth"
            });
        });
    });

    // Animación de marcas
    const marcas = document.querySelectorAll('.marca');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.2 // 20% del elemento visible activa la animación
    });

    marcas.forEach(marca => observer.observe(marca));
});

document.querySelectorAll('.marca').forEach(marca => {
    marca.addEventListener('click', () => {
        const marcaId = marca.getAttribute('data-id');
        if (!marcaId) return; // ⛔ Si no tiene data-id, no hace nada
        window.location.href = `marca.html?marca=${marcaId}`; // Redirige a la página de la marca
    });
});

(() => {
    const carousels = document.querySelectorAll('.carousel');
    if (!carousels.length) return;

    carousels.forEach(initCarousel);

    function initCarousel(root) {
        const track = root.querySelector('.carousel-track');
        const slides = Array.from(root.querySelectorAll('.carousel-slide'));
        const prevBtn = root.querySelector('.carousel-btn.prev');
        const nextBtn = root.querySelector('.carousel-btn.next');
        const dotsList = root.querySelector('.carousel-dots');

        if (!track || !slides.length || !dotsList) return;

        let index = 0;
        let autoplayMs = 5000;
        let timerId = null;
        let isPointerDown = false;
        let startX = 0;
        let deltaX = 0;

        // Dots
        dotsList.innerHTML = '';
        slides.forEach((_, i) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.role = 'tab';
            btn.ariaLabel = `Ir a la diapositiva ${i + 1}`;
            btn.addEventListener('click', () => goTo(i, true));
            li.appendChild(btn);
            dotsList.appendChild(li);
        });
        const dots = Array.from(dotsList.querySelectorAll('button'));

        function updateUI() {
            track.style.transform = `translateX(${-index * 100}%)`;
            dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
            slides.forEach((sl, i) => sl.setAttribute('aria-hidden', String(i !== index)));
        }

        function goTo(i, user = false) {
            const len = slides.length;
            index = (i + len) % len;
            updateUI();
            if (user) restartAutoplay();
        }
        const next = (user = false) => goTo(index + 1, user);
        const prev = (user = false) => goTo(index - 1, user);

        // Solo autoplay si el carrusel está visible (no display:none)
        const isVisible = () =>
            root.offsetParent !== null &&
            getComputedStyle(root).display !== 'none' &&
            root.clientWidth > 0 && root.clientHeight > 0;

        function startAutoplay() {
            if (timerId || !isVisible()) return;
            timerId = setInterval(() => next(false), autoplayMs);
        }
        function stopAutoplay() { if (timerId) { clearInterval(timerId); timerId = null; } }
        function restartAutoplay() { stopAutoplay(); startAutoplay(); }

        // Controles
        nextBtn?.addEventListener('click', () => next(true));
        prevBtn?.addEventListener('click', () => prev(true));

        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', startAutoplay);
        root.addEventListener('focusin', stopAutoplay);
        root.addEventListener('focusout', startAutoplay);

        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopAutoplay() : startAutoplay();
        });

        // dentro de initCarousel(root)…
        let moved = false;              // <— nuevo

        track.addEventListener('pointerdown', (e) => {
            isPointerDown = true;
            moved = false;
            startX = e.clientX;
            deltaX = 0;
            stopAutoplay();
            // ¡No capturar aquí! (no setPointerCapture todavía)
        });

        track.addEventListener('pointermove', (e) => {
            if (!isPointerDown) return;
            deltaX = e.clientX - startX;

            // Si empieza a moverse más de 6px, ahora sí tratamos como swipe
            if (!moved && Math.abs(deltaX) > 6) {
                moved = true;
                track.style.transition = 'none';
                track.setPointerCapture?.(e.pointerId);
            }
            if (moved) {
                const percent = (deltaX / root.clientWidth) * 100;
                track.style.transform = `translateX(${-(index * 100) + percent}%)`;
            }
        });

        track.addEventListener('pointerup', (e) => {
            if (!isPointerDown) return;
            isPointerDown = false;

            // Si NO hubo movimiento real, era un click — no toques nada
            if (!moved) {
                startAutoplay();
                return;
            }

            // Finalizar swipe
            track.style.transition = '';
            const threshold = root.clientWidth * 0.15;
            if (Math.abs(deltaX) > threshold) {
                deltaX < 0 ? next(true) : prev(true);
            } else {
                updateUI();
            }
            track.releasePointerCapture?.(e.pointerId);
            startAutoplay();
        });


        // Reaccionar a cambios de breakpoint (por si alternas mobile/desktop)
        const mq = matchMedia('(min-width: 992px)');
        mq.addEventListener?.('change', restartAutoplay);

        // Init
        goTo(0);
        startAutoplay();
        root.setAttribute('tabindex', '0');
    }
})();


// Configuración
const perfumesPerPage = 12;
let currentPage = 1;
let allPerfumes = [];

// Extraer todos los perfumes de todas las marcas
function collectAllPerfumes() {
    allPerfumes = [];
    marcasData.forEach(marca => {
        const { hombres, mujeres, unixes } = marca.perfumes;
        [...hombres, ...mujeres, ...unixes].forEach(perfume => {
            allPerfumes.push({
                ...perfume,
                marca: marca.nombre
            });
        });
    });
}

// Crear item con estructura igual a marca.html
function createPerfumeItemGlobal(p) {
    const wrap = document.createElement('div');
    wrap.className = 'perfumery-item';

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = `${p.nombre} - ${p.marca}`;
    wrap.appendChild(img);

    const name = document.createElement('div');
    name.className = 'perfume-name';
    name.textContent = p.nombre;
    wrap.appendChild(name);

    const price = document.createElement('div');
    price.className = 'perfume-price';
    price.textContent = p.precio != null
        ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(p.precio)
        : 'Consultar';
    wrap.appendChild(price);

    const actions = document.createElement('div');
    actions.className = 'perfume-actions';

    const a = document.createElement('a');
    a.className = 'btn-get-info';
    a.href = `https://wa.me/50687683732?text=${encodeURIComponent(`Hola, me interesa ${p.marca} - ${p.nombre} (${price.textContent}).`)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Comprar por WhatsApp';

    actions.appendChild(a);
    wrap.appendChild(actions);

    return wrap;
}

// Renderizar perfumes en la página actual
function renderPerfumes(page = 1) {
    const grid = document.getElementById("perfumes-grid");
    if (!grid) return; // ⛔ si no existe, salir de la función
    grid.innerHTML = "";

    const start = (page - 1) * perfumesPerPage;
    const end = start + perfumesPerPage;
    const perfumesToShow = allPerfumes.slice(start, end);

    perfumesToShow.forEach(p => grid.appendChild(createPerfumeItemGlobal(p)));

    renderPagination();
}

// Renderizar botones de paginación
function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return; // ⛔ evitar error si no existe
    pagination.innerHTML = "";
    const totalPages = Math.ceil(allPerfumes.length / perfumesPerPage);

    const maxVisible = 4; // cantidad de números visibles
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    // Botón "anterior"
    if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "←";
        prevBtn.addEventListener("click", () => {
            currentPage--;
            renderPerfumes(currentPage);
            document.getElementById("perfumes").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
        pagination.appendChild(prevBtn);
    }

    // Botones numéricos
    for (let i = start; i <= end; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.toggle("active", i === currentPage);
        btn.addEventListener("click", () => {
            currentPage = i;
            renderPerfumes(currentPage);
            document.getElementById("perfumes").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
        pagination.appendChild(btn);
    }

    // Botón "siguiente"
    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "→";
        nextBtn.addEventListener("click", () => {
            currentPage++;
            renderPerfumes(currentPage);
            document.getElementById("perfumes").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
        pagination.appendChild(nextBtn);
    }
}


// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    collectAllPerfumes();
    renderPerfumes();
});

