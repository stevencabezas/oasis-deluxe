import { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';
import './ImageManager.css';

function ImageManager({ onSelectImage, currentImageUrl, onClose }) {
  const [view, setView] = useState('gallery'); // 'gallery' o 'upload'

  const handleImageUploaded = (data) => {
    // Cuando se sube una imagen, automáticamente la seleccionamos
    if (onSelectImage) {
      onSelectImage(data.imageUrl);
    }
    // Opcional: cambiar a galería para ver la imagen subida
    // setView('gallery');
  };

  return (
    <div className="image-manager-overlay">
      <div className="image-manager">
        <div className="manager-tabs">
          <button
            className={`tab ${view === 'gallery' ? 'active' : ''}`}
            onClick={() => setView('gallery')}
          >
            📁 Galería
          </button>
          <button
            className={`tab ${view === 'upload' ? 'active' : ''}`}
            onClick={() => setView('upload')}
          >
            📤 Subir Nueva
          </button>
        </div>

        <div className="manager-content">
          {view === 'gallery' ? (
            <ImageGallery
              onSelectImage={onSelectImage}
              onClose={onClose}
            />
          ) : (
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageManager;

