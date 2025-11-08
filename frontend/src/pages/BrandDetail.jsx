import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandsApi } from '../services/api';
import PerfumeCard from '../components/PerfumeCard';
import '../styles/global.css';

function BrandDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [marca, setMarca] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarca();
  }, [slug, navigate]);

  const loadMarca = async () => {
    try {
      setLoading(true);
      const response = await brandsApi.getBySlug(slug);
      const marcaData = response.data;
      
      // Transformar datos al formato esperado
      const marca = {
        id: marcaData.brandId || marcaData.slug,
        nombre: marcaData.nombre,
        perfumes: {
          hombres: marcaData.perfumes?.hombres || [],
          mujeres: marcaData.perfumes?.mujeres || [],
          unixes: marcaData.perfumes?.unixes || []
        }
      };
      
      setMarca(marca);
    } catch (error) {
      console.error('Error cargando marca:', error);
      navigate('/marcas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!marca) {
    return null;
  }

  const formatPrice = (price) => {
    if (price == null) return 'Consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(price);
  };

  const normalizeItem = (item) => {
    if (!item) return { src: '', nombre: null, precio: null };
    const src = item.imagenUrl || item.src || '';
    const normalizedSrc = src.startsWith('/') ? src : src.startsWith('./') 
      ? src.replace('./img/', '/img/') 
      : `/img/${src}`;
    return {
      src: normalizedSrc,
      imagenUrl: normalizedSrc,
      nombre: item.nombre ?? null,
      precio: item.precio ?? null,
    };
  };

  const renderList = (containerId, lista) => {
    if (!Array.isArray(lista) || lista.length === 0) {
      return null;
    }
    return lista.map((item, index) => {
      const normalized = normalizeItem(item);
      return (
        <PerfumeCard
          key={`${containerId}-${index}`}
          perfume={normalized}
          marcaNombre={marca.nombre}
        />
      );
    });
  };

  return (
    <section className="marca-info">
      <h2 id="marcaNombre">{marca.nombre}</h2>
      <div id="perfumery">
        {marca.perfumes.hombres.length > 0 && (
          <div className="perfumery-section">
            <h3>Hombre</h3>
            <div id="hombres" className="perfumery-images">
              {renderList('hombres', marca.perfumes.hombres)}
            </div>
          </div>
        )}
        
        {marca.perfumes.mujeres.length > 0 && (
          <div className="perfumery-section">
            <h3 className="marca-info__mujeres-text">Mujer</h3>
            <div id="mujeres" className="perfumery-images">
              {renderList('mujeres', marca.perfumes.mujeres)}
            </div>
          </div>
        )}
        
        {marca.perfumes.unixes.length > 0 && (
          <div className="perfumery-section">
            <h3>Unisex</h3>
            <div id="unixes" className="perfumery-images">
              {renderList('unixes', marca.perfumes.unixes)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BrandDetail;

