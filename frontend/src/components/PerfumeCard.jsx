import '../styles/global.css';

const API_BASE =
  (import.meta.env.VITE_API_URL || import.meta.env.VITE_ASSET_BASE || '')
    .replace(/\/api\/?$/,'') ||
  (typeof window !== 'undefined' ? window.location.origin : '');

function resolveImageUrl(u) {
  if (!u) return '/img/logooasis.png';

  // 🔧 Arreglo de datos corruptos: "/img/http://..."
  u = u.replace(/^\/img\/(https?:\/\/)/i, '$1');

  if (/^https?:\/\//i.test(u)) return u;                  // absoluta (backend Opción B)
  if (u.startsWith('/uploads/')) return `${API_BASE}${u}`; // relativa del backend
  if (u.startsWith('/')) return u;                         // absoluta mismo origen
  if (u.startsWith('./')) return u.replace('./img/','/img/');
  return `/img/${u}`;                                      // carpeta del frontend
}

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

  // const imageSrc = perfume.imagenUrl || perfume.src || '';
  // const finalSrc = imageSrc.startsWith('/') ? imageSrc : imageSrc.startsWith('./') 
  //   ? imageSrc.replace('./img/', '/img/') 
  //   : `/img/${imageSrc}`;

  const imageSrc = resolveImageUrl(perfume.imagenUrl || perfume.src || '');

  return (
    <div className="perfumery-item">
      <img 
        src={imageSrc} 
        alt={`${perfume.nombre || 'Perfume'} - ${marcaNombre}`}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/img/logooasis.png'; // Imagen por defecto
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

