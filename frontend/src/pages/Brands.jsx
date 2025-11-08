import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsApi } from '../services/api';
import '../styles/global.css';

function Brands() {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const marcasRef = useRef([]);

  useEffect(() => {
    loadMarcas();
  }, []);

  const loadMarcas = async () => {
    try {
      // Cargar todas las marcas
      const [arabesRes, disenadorRes, nichosRes] = await Promise.all([
        brandsApi.getAll({ categoria: 'arabes' }),
        brandsApi.getAll({ categoria: 'disenador' }),
        brandsApi.getAll({ categoria: 'nichos' })
      ]);

      const arabes = arabesRes.data.map(m => ({ ...m, id: m.brandId || m.slug }));
      const disenador = disenadorRes.data.map(m => ({ ...m, id: m.brandId || m.slug }));
      const nichos = nichosRes.data.map(m => ({ ...m, id: m.brandId || m.slug }));

      setMarcas({ arabes, disenador, nichos });
      marcasRef.current = [...arabes, ...disenador, ...nichos];
      
      // Animación de entrada
      setTimeout(() => {
        marcasRef.current.forEach((marca, index) => {
          const element = document.querySelector(`[data-id="${marca.id}"]`);
          if (element) {
            setTimeout(() => {
              element.classList.add('visible');
            }, index * 50);
          }
        });
      }, 100);
    } catch (error) {
      console.error('Error cargando marcas:', error);
    }
  };

  const handleMarcaClick = (marcaId) => {
    if (marcaId) {
      navigate(`/marca/${marcaId}`);
    }
  };

  const getLogoPath = (marca) => {
    // Si la marca tiene logoUrl desde la base de datos, usarlo
    if (marca.logoUrl && marca.logoUrl.trim() !== '') {
      return marca.logoUrl;
    }
    
    // Mapeo de IDs de marcas a sus logos (legacy - para marcas antiguas sin logoUrl)
    const logoMap = {
      'afnan': 'LOGO_AFNAN.png',
      'alharamain': 'Al Haramain.png',
      'armaf': 'Armaf2.png',
      'bharara': 'bhahara.jpg',
      'dumont': 'dunont.jpg',
      'frenchavenue': 'french.png',
      'jomilano': 'Jo Milano1.jpg',
      'lattafa': 'Lattafa.png',
      'maisonalhambra': 'Maison Alhambra.jpg',
      'orientica': 'Orientica.jpg',
      'rasasi': 'Rasasi1.jpg',
      'rave': 'RAVE.jpg',
      'antoniobanderas': 'Antonio Banderas.png',
      'ariana': 'ariana.png',
      'azzaro': 'Azzaro.jpg',
      'burberry': 'Burberry.jpg',
      'bvlgari': 'Bvlgari.png',
      'carolinaherrera': 'Carolina Herrera.jpg',
      'chanel': 'Chanel.png',
      'clinique': 'Clinique-Emblem.png',
      'dior': 'Dior.jpg',
      'dolcegabbana': 'Dolce&Gabbana.jpg',
      'giorgioarmani': 'Giorgio Armani.png',
      'givenchy': 'Givenchy.png',
      'guerlain': 'Guerlain.png',
      'hallowen': 'Halloween.png',
      'hermes': 'Hermès.png',
      'hugoboss': 'Hugo Boss.png',
      'isseymiyake': 'Issey Miyake.png',
      'jeanpaulgaultier': 'Jean Paul Gaultier.png',
      'kenzo': 'Kenzo.jpg',
      'lacoste': 'Lacoste Fragrances.jpg',
      'lancome': 'lancome.png',
      'loewe': 'Loewe.jpg',
      'louisvuitton': 'Louis Vuitton.jpg',
      'moschino': 'Moschino.png',
      'nautica': 'Nautica.png',
      'pacorabanne': 'Paco Rabanne.jpg',
      'prada': 'Prada.jpg',
      'ralphlauren': 'Ralph Lauren.png',
      'tomford': 'Tom Ford.png',
      'valentino': 'Valentino.png',
      'versace': 'Versace.jpg',
      'viktorrolf': 'Viktor&Rolf.jpg',
      'yvessaintlaurent': 'Yves Saint Laurent.jpg',
      'creed': 'creed.jpg',
      'initio': 'Initio.jpg',
      'lelabo': 'LeLabo.png',
      'maisonfranciskurkdjian': 'maison-francis.jpg',
      'maisonmargiela': 'Maison-margiela.jpg',
      'mancera': 'MANCERA.jpg',
      'marly': 'marly.jpg',
      'montale': 'Montale.jpg',
      'nishane': 'Nishane.jpg',
      'ortoparisi': 'OrtoParisi.jpg',
      'rojadove': 'RojaDove.jpg',
      'shl777': 'SHL777.png',
      'xerjoff': 'Xerjoff.png'
    };
    
    return logoMap[marca.id] ? `/img/${logoMap[marca.id]}` : '/img/logooasis.png';
  };

  const MarcaCard = ({ marca }) => (
    <div
      className="marca"
      data-id={marca.id || null}
      onClick={() => handleMarcaClick(marca.id)}
      style={marca.id ? { cursor: 'pointer' } : { cursor: 'no-drop' }}
    >
      <img 
        src={getLogoPath(marca)} 
        alt={marca.nombre}
        onError={(e) => {
          e.target.src = '/img/logooasis.png';
        }}
      />
      <p>{marca.nombre}</p>
    </div>
  );

  return (
    <div>
      <section id="marcas" className="marcas">
        <h2>Nuestras Marcas Árabes</h2>
        <div className="marcas-grid">
          {marcas.arabes?.map((marca) => (
            <MarcaCard key={marca.id} marca={marca} />
          ))}
        </div>
      </section>

      <section id="marcas-diseno" className="marcas designer">
        <h2>Marcas Diseñador</h2>
        <div className="marcas-grid">
          {marcas.disenador?.map((marca) => (
            <MarcaCard key={marca.id} marca={marca} />
          ))}
        </div>
      </section>

      <section id="marcas-nichos" className="marcas">
        <h2>Nichos</h2>
        <div className="marcas-grid">
          {marcas.nichos?.map((marca) => (
            <MarcaCard key={marca.id} marca={marca} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Brands;

