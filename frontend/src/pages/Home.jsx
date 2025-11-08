import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import PerfumeCard from '../components/PerfumeCard';
import { perfumesApi } from '../services/api';
import '../styles/global.css';

// Datos del carrusel
const carouselSlides = [
  {
    image: '/img/lattafa/hombre/1.jpg',
    alt: 'Fragancias nicho con acordes orientales y vainilla',
    title: 'Fragancias Árabes',
    description: 'Selección exclusiva para quienes buscan algo único.',
    link: '#perfumes',
    linkText: 'Ver perfumes'
  },
  {
    image: '/img/lattafa/hombre/6.jpg',
    alt: 'Decants para probar antes de comprar',
    title: 'Decants',
    description: 'Prueba el aroma perfecto sin compromiso.',
    link: '/decants',
    linkText: 'Ver decants'
  },
  {
    image: '/img/carolinaherrera/mujer/6.jpg',
    alt: 'Clásicos de diseñador para toda ocasión',
    title: 'Diseñador',
    description: 'Clásicos que nunca pasan de moda.',
    link: '/marcas',
    linkText: 'Ver marcas'
  },
  {
    image: '/img/marly/hombre/1.jpg',
    alt: 'Fragancias nicho con acordes orientales y vainilla',
    title: 'Fragancias Nicho',
    description: 'Selección exclusiva para quienes buscan algo único.',
    link: '/marcas',
    linkText: 'Ver nichos'
  },
  {
    image: '/img/dior/mujer/1.jpg',
    alt: 'Clásicos de diseñador para toda ocasión',
    title: 'Diseñador',
    description: 'Clásicos que nunca pasan de moda.',
    link: '/marcas',
    linkText: 'Ver marcas'
  },
  {
    image: '/img/marly/hombre/2.jpg',
    alt: 'Fragancias nicho con acordes orientales y vainilla',
    title: 'Fragancias Nicho',
    description: 'Selección exclusiva para quienes buscan algo único.',
    link: '/marcas',
    linkText: 'Ver nichos'
  },
  {
    image: '/img/jeanpaulgaultier/hombre/1.jpg',
    alt: 'Clásicos de diseñador para toda ocasión',
    title: 'Diseñador',
    description: 'Clásicos que nunca pasan de moda.',
    link: '/marcas',
    linkText: 'Ver marcas'
  }
];

function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const perfumesPerPage = 12;

  useEffect(() => {
    loadPerfumes();
  }, [currentPage]);

  const loadPerfumes = async () => {
    try {
      setLoading(true);
      const response = await perfumesApi.getAll({ 
        page: currentPage, 
        limit: perfumesPerPage 
      });
      
      // Transformar datos de la API al formato esperado
      const perfumesData = response.data.perfumes.map(perfume => ({
        ...perfume,
        marca: perfume.marca?.nombre || '',
        marcaId: perfume.marca?.brandId || perfume.marcaBrandId,
        id: perfume.id
      }));
      
      setPerfumes(perfumesData);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error cargando perfumes:', error);
      setPerfumes([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToPerfumes = () => {
    const element = document.getElementById('perfumes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className="main-section">
        {/* Hero SOLO móvil: texto primero y luego carrusel */}
        <section className="mobile-hero d-none-desk">
          <h3 className="banner-heading">¿Y si tu aroma ideal está aquí?</h3>
          <span className="banner-description">
            Oasis de Luxe: perfumes originales, nuevos y sellados.<br />
            Explora nuestra exclusiva selección de fragancias de diseñador y nicho, cuidadosamente
            elegidas por su elegancia y carácter.<br />
            Además, disfruta de nuestros sofisticados decants, perfectos para probar y descubrir tu
            aroma ideal sin compromiso.<br />
            ✨ Haz tu pedido hoy y lleva el lujo contigo a donde vayas.
          </span>
          <div className="banner-button-wrapper">
            <Link to="#perfumes" className="banner-button" onClick={scrollToPerfumes}>
              DESCUBRE
            </Link>
          </div>
        </section>

        {/* Carruseles */}
        <Carousel slides={carouselSlides} className="d-none-desk" id="destacados" />
        <Carousel slides={carouselSlides} className="d-none" id="destacados-desktop" />

        {/* Overlay SOLO desktop (oculto en móvil) */}
        <div className="desktop-hero-overlay d-none">
          <div className="banner-item-wrapper banner-item-large-img banner-item-border show-item" data-animate="effect_1">
            <div className="banner-item">
              <div className="content-box content-box-absolute content-box-center text-center">
                <h3 className="banner-heading">
                  ¿Y si tu aroma ideal está aquí?
                </h3>
                <span className="banner-description">
                  Oasis de Luxe: perfumes originales, nuevos y sellados.<br />
                  Explora nuestra exclusiva selección de fragancias de diseñador y nicho, cuidadosamente
                  elegidas por su elegancia y carácter.<br />
                  Además, disfruta de nuestros sofisticados decants, perfectos para probar y descubrir tu
                  aroma ideal sin compromiso.<br />
                  ✨ Haz tu pedido hoy y lleva el lujo contigo a donde vayas.
                </span>
                <Link to="#perfumes" className="banner-button animated-banner-button" onClick={scrollToPerfumes}>
                  <span>Descubre</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="perfumes" className="perfumes-section">
        <h2>Todos los Perfumes</h2>
        {loading ? (
          <p>Cargando perfumes...</p>
        ) : (
          <>
            <div className="perfumes-grid">
              {perfumes.map((perfume) => (
                <PerfumeCard 
                  key={perfume.id || `${perfume.marcaId}-${perfume.nombre}`}
                  perfume={perfume}
                  marcaNombre={perfume.marca}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {currentPage > 1 && (
                  <button onClick={() => {
                    setCurrentPage(currentPage - 1);
                    scrollToPerfumes();
                  }}>
                    ←
                  </button>
                )}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? 'active' : ''}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        scrollToPerfumes();
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <button onClick={() => {
                    setCurrentPage(currentPage + 1);
                    scrollToPerfumes();
                  }}>
                    →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Home;

