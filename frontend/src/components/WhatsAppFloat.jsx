import '../styles/global.css';

function WhatsAppFloat() {
  const whatsappNumber = '50687683732';
  const message = encodeURIComponent('Hola, quiero más información');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
      />
    </a>
  );
}

export default WhatsAppFloat;



