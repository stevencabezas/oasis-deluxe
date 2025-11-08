import { useState, useEffect } from 'react';
import { imagesApi } from '../services/api';
import ImageCropper from './ImageCropper';
import './ImageGallery.css';

function ImageGallery({ onSelectImage, onClose }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('uploads');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      loadImages(selectedFolder);
    }
  }, [selectedFolder]);

  const loadFolders = async () => {
    try {
      const response = await imagesApi.listFolders();
      setFolders(response.data.folders);
    } catch (error) {
      console.error('Error cargando carpetas:', error);
    }
  };

  const loadImages = async (folder) => {
    try {
      setLoading(true);
      const response = await imagesApi.list(folder);
      setImages(response.data.images);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  const handleUseImage = () => {
    if (selectedImage && onSelectImage) {
      onSelectImage(selectedImage.url);
      if (onClose) onClose();
    }
  };

  const handleCropImage = () => {
    if (selectedImage) {
      setImageToCrop(selectedImage);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImageUrl) => {
    if (onSelectImage) {
      onSelectImage(croppedImageUrl);
      if (onClose) onClose();
    }
  };

  const handleDeleteImage = async (image, e) => {
    e.stopPropagation();
    
    if (!window.confirm(`¿Estás seguro de eliminar "${image.filename}"?`)) {
      return;
    }

    try {
      await imagesApi.delete(image.filename, selectedFolder);
      loadImages(selectedFolder);
      if (selectedImage?.filename === image.filename) {
        setSelectedImage(null);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar imagen');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (showCropper && imageToCrop) {
    return (
      <ImageCropper
        imageUrl={imageToCrop.url}
        onCropComplete={handleCropComplete}
        onCancel={() => setShowCropper(false)}
      />
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h3>Galería de Imágenes</h3>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        )}
      </div>

      <div className="gallery-folders">
        {folders.map((folder) => (
          <button
            key={folder.name}
            className={`folder-button ${selectedFolder === folder.name ? 'active' : ''}`}
            onClick={() => setSelectedFolder(folder.name)}
          >
            📁 {folder.name}
            <span className="folder-count">{folder.imageCount}</span>
          </button>
        ))}
      </div>

      <div className="gallery-content">
        <div className="gallery-grid">
          {loading ? (
            <div className="gallery-loading">Cargando imágenes...</div>
          ) : images.length === 0 ? (
            <div className="gallery-empty">
              No hay imágenes en esta carpeta
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.url}
                className={`gallery-item ${selectedImage?.url === image.url ? 'selected' : ''}`}
                onClick={() => handleSelectImage(image)}
              >
                <img src={image.url} alt={image.filename} loading="lazy" />
                <div className="image-info">
                  <p className="image-name" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="image-size">{formatFileSize(image.size)}</p>
                </div>
                <button
                  className="delete-image-button"
                  onClick={(e) => handleDeleteImage(image, e)}
                  title="Eliminar imagen"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {selectedImage && (
          <div className="gallery-preview">
            <div className="preview-image">
              <img src={selectedImage.url} alt={selectedImage.filename} />
            </div>
            <div className="preview-details">
              <h4>Imagen seleccionada</h4>
              <p><strong>Nombre:</strong> {selectedImage.filename}</p>
              <p><strong>Tamaño:</strong> {formatFileSize(selectedImage.size)}</p>
              <p><strong>URL:</strong> <code>{selectedImage.url}</code></p>
              
              <div className="preview-actions">
                <button onClick={handleUseImage} className="use-button">
                  Usar esta imagen
                </button>
                <button onClick={handleCropImage} className="crop-button">
                  Recortar
                </button>
                <button onClick={() => setSelectedImage(null)} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;

