import '../styles/global.css';

function Contact() {
  return (
    <section id="contacto" className="contacto">
      <div className="contacto-container">
        <h2>Contáctanos</h2>
        <p>Estamos aquí para ayudarte, si tienes alguna pregunta o necesitas más información, por favor contáctanos directamente.</p>

        <div className="contacto-info">
          <h3>Dirección</h3>
          <p>La Virgen, Sarapiquí, Costa Rica</p>

          <h3>Teléfono</h3>
          <p>+506 8768 3732</p>

          <h3>Correo Electrónico</h3>
          <p>oasisdeluxe2611@gmail.com</p>

          <h3>Síguenos en redes sociales</h3>
          <div className="social-icons">
            <a 
              href="https://www.instagram.com/perfumeria_oasis_deluxe?igsh=YXF2MWV2cmUzNGJy" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png" 
                alt="Instagram" 
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;






