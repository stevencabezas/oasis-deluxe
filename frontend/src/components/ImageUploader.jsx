import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { imagesApi } from '../services/api';
import './ImageUploader.css';

function ImageUploader({ onImageUploaded, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5, // Máximo 500KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (percent) => {
        setProgress(Math.round(percent * 0.5)); // 50% para compresión
      }
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      throw new Error('Error al comprimir la imagen');
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setError('');
      setProgress(0);

      // Comprimir imagen
      const compressedFile = await compressImage(file);
      
      // Crear FormData
      const formData = new FormData();
      formData.append('image', compressedFile, file.name);

      setProgress(50); // Compresión completada

      // Subir al servidor
      const response = await imagesApi.upload(formData);
      
      setProgress(100);

      if (onImageUploaded) {
        onImageUploaded(response.data);
      }

      // Cerrar después de 500ms
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setError(error.response?.data?.error || error.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten imágenes (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 10MB');
      return;
    }

    uploadFile(file);
  };

  return (
    <div className="image-uploader">
      <div className="uploader-header">
        <h3>Subir Imagen</h3>
        {onClose && (
          <button onClick={onClose} className="close-button" disabled={uploading}>
            ✕
          </button>
        )}
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {!uploading && (
          <>
            <div className="drop-icon">📁</div>
            <p className="drop-text">
              Arrastra y suelta una imagen aquí
              <br />
              <span>o haz click para seleccionar</span>
            </p>
            <p className="drop-hint">
              JPG, PNG, GIF o WebP (máx. 10MB)
            </p>
          </>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="spinner"></div>
            <p>Subiendo imagen...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          ⚠️ {error}
        </div>
      )}

      <div className="uploader-info">
        <p>
          <strong>¿Cómo funciona?</strong>
        </p>
        <ul>
          <li>La imagen se comprimirá automáticamente para optimizar el tamaño</li>
          <li>Se guardará en la carpeta <code>/img/uploads/</code></li>
          <li>Después podrás usarla en tus perfumes, marcas o decants</li>
        </ul>
      </div>
    </div>
  );
}

export default ImageUploader;

