import { useState, useEffect } from 'react';
import { decantsApi } from '../services/api';
import '../styles/global.css';

function Decants() {
  const [decants, setDecants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecants();
  }, []);

  const loadDecants = async () => {
    try {
      setLoading(true);
      const response = await decantsApi.getAll();
      setDecants(response.data);
    } catch (error) {
      console.error('Error cargando decants:', error);
      setDecants([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(price);
  };

  const whatsappNumber = '50687683732';

  const createWhatsAppLink = (decant) => {
    const message = encodeURIComponent(`Hola, me interesa ${decant.nombre}.`);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando decants...</div>;
  }

  return (
    <div className="body-decants">
      <section className="decants-section">
        <div className="wrapper-decants">
          {decants.map((decant) => (
            <div key={decant.id} className="item-decant">
              <img src={decant.imagen} alt={decant.nombre} />
              <div className="item-decant-description">
                <h3>{decant.nombre}</h3>
                {decant.precio2ml && (
                  <p>2ml <span>{formatPrice(parseFloat(decant.precio2ml))}</span></p>
                )}
                {decant.precio5ml && (
                  <p>5ml <span>{formatPrice(parseFloat(decant.precio5ml))}</span></p>
                )}
                {decant.precio10ml && (
                  <p>10ml <span>{formatPrice(parseFloat(decant.precio10ml))}</span></p>
                )}
              </div>
              <div className="perfume-actions">
                <a
                  className="btn-get-info"
                  href={createWhatsAppLink(decant)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Comprar por WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Decants;





