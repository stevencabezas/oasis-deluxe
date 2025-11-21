import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

function Carousel({ slides, autoplayMs = 5000, className = '', id }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const trackRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);
  const movedRef = useRef(false);

  const goToSlide = (index) => {
    const newIndex = (index + slides.length) % slides.length;
    setCurrentIndex(newIndex);
  };

  const next = () => goToSlide(currentIndex + 1);
  const prev = () => goToSlide(currentIndex - 1);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    intervalRef.current = setInterval(() => {
      next();
    }, autoplayMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isPaused, autoplayMs, slides.length]);

  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    deltaXRef.current = 0;
    setIsPaused(true);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    
    deltaXRef.current = e.clientX - startXRef.current;

    if (!movedRef.current && Math.abs(deltaXRef.current) > 6) {
      movedRef.current = true;
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
      }
    }

    if (movedRef.current && trackRef.current) {
      const percent = (deltaXRef.current / trackRef.current.parentElement.clientWidth) * 100;
      trackRef.current.style.transform = `translateX(${-(currentIndex * 100) + percent}%)`;
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    
    isPointerDownRef.current = false;

    if (!movedRef.current) {
      setIsPaused(false);
      return;
    }

    if (trackRef.current) {
      trackRef.current.style.transition = '';
      const threshold = trackRef.current.parentElement.clientWidth * 0.15;
      
      if (Math.abs(deltaXRef.current) > threshold) {
        if (deltaXRef.current < 0) {
          next();
        } else {
          prev();
        }
      } else {
        trackRef.current.style.transform = `translateX(${-currentIndex * 100}%)`;
      }
    }

    movedRef.current = false;
    setIsPaused(false);
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (slides.length === 0) return null;

  return (
    <section id={id} className={`carousel ${className}`} aria-label="Carrusel de destacados">
      <div className="carousel-viewport">
        <div 
          ref={trackRef}
          className="carousel-track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {slides.map((slide, index) => (
            <figure 
              key={index}
              className="carousel-slide"
              aria-hidden={index !== currentIndex}
            >
              <img 
                src={slide.image} 
                alt={slide.alt} 
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
              <figcaption className="carousel-caption">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                {slide.link && (
                  <Link to={slide.link} className="carousel-cta">
                    {slide.linkText || 'Ver más'}
                  </Link>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <button 
        className="carousel-btn prev" 
        aria-label="Anterior" 
        type="button"
        onClick={() => {
          prev();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 3000);
        }}
      >
        ‹
      </button>
      <button 
        className="carousel-btn next" 
        aria-label="Siguiente" 
        type="button"
        onClick={() => {
          next();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 3000);
        }}
      >
        ›
      </button>

      <ul className="carousel-dots" role="tablist" aria-label="Seleccionar diapositiva">
        {slides.map((_, index) => (
          <li key={index}>
            <button
              type="button"
              role="tab"
              aria-label={`Ir a la diapositiva ${index + 1}`}
              aria-selected={index === currentIndex}
              onClick={() => {
                goToSlide(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 3000);
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Carousel;



