import '../styles/global.css';

function PerfumeCard({ perfume, marcaNombre }) {
  const formatPrice = (price) => {
    if (price == null) return 'Consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(price);
  };

  const whatsappNumber = '50687683732';
  const message = encodeURIComponent(
    `Hola, me interesa ${marcaNombre} - ${perfume.nombre} (${formatPrice(perfume.precio)}).`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const imageSrc = perfume.imagenUrl || perfume.src || '';
  const finalSrc = imageSrc.startsWith('/') ? imageSrc : imageSrc.startsWith('./') 
    ? imageSrc.replace('./img/', '/img/') 
    : `/img/${imageSrc}`;

  return (
    <div className="perfumery-item">
      <img 
        src={finalSrc} 
        alt={`${perfume.nombre || 'Perfume'} - ${marcaNombre}`}
        loading="lazy"
        onError={(e) => {
          e.target.src = '/img/logooasis.png'; // Imagen por defecto
        }}
      />
      {perfume.nombre && (
        <div className="perfume-name">{perfume.nombre}</div>
      )}
      <div className="perfume-price">{formatPrice(perfume.precio)}</div>
      <div className="perfume-actions">
        <a 
          className="btn-get-info"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  );
}

export default PerfumeCard;

