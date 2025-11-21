import { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageCropper.css';

function ImageCropper({ imageUrl, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const imgRef = useRef(null);

  const generateCroppedImage = () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convertir a blob y crear URL
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }

      // Crear URL temporal para la imagen recortada
      const croppedImageUrl = URL.createObjectURL(blob);
      
      if (onCropComplete) {
        // En una implementación real, aquí subirías la imagen recortada al servidor
        // Por ahora, retornamos la URL del blob
        onCropComplete(croppedImageUrl);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleAspectChange = (value) => {
    if (value === 'free') {
      setAspectRatio(undefined);
      setCrop({ ...crop, aspect: undefined });
    } else {
      const ratio = parseFloat(value);
      setAspectRatio(ratio);
      setCrop({ ...crop, aspect: ratio });
    }
  };

  return (
    <div className="image-cropper">
      <div className="cropper-header">
        <h3>Recortar Imagen</h3>
        {onCancel && (
          <button onClick={onCancel} className="close-button">
            ✕
          </button>
        )}
      </div>

      <div className="cropper-controls">
        <label>
          Proporción:
          <select onChange={(e) => handleAspectChange(e.target.value)} value={aspectRatio || 'free'}>
            <option value="free">Libre</option>
            <option value="1">Cuadrado (1:1)</option>
            <option value="1.5">Vertical (3:2)</option>
            <option value="0.666">Horizontal (2:3)</option>
            <option value="1.777">Panorámico (16:9)</option>
          </select>
        </label>
      </div>

      <div className="cropper-content">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop"
            style={{ maxWidth: '100%', maxHeight: '60vh' }}
          />
        </ReactCrop>
      </div>

      <div className="cropper-actions">
        <button onClick={generateCroppedImage} className="crop-save-button">
          Guardar recorte
        </button>
        {onCancel && (
          <button onClick={onCancel} className="crop-cancel-button">
            Cancelar
          </button>
        )}
      </div>

      <div className="cropper-info">
        <p>
          <strong>Instrucciones:</strong> Arrastra para ajustar el área de recorte. 
          Las esquinas y bordes se pueden arrastrar para cambiar el tamaño.
        </p>
      </div>
    </div>
  );
}

export default ImageCropper;

