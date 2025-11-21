import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

// Configurar Cloudinary usando variables de entorno
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL?.split('@')?.[1] || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

async function uploadToCloudinaryBuffer(buffer, folder = 'uploads') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: 'image', overwrite: false },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function listResources(prefix = 'uploads', max_results = 100) {
  // prefix ejemplo: 'uploads'
  const options = {
    type: 'upload',
    prefix,
    max_results
  };
  return cloudinary.v2.api.resources(options);
}

export { cloudinary, uploadToCloudinaryBuffer, listResources };
