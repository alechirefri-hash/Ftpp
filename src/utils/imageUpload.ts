/**
 * Utility to process user-uploaded images for avatars and profile banners.
 * - Handles drag-and-drop & manual file selection.
 * - Scales and compresses high-resolution images via HTML5 Canvas to optimize performance
 *   and avoid browser storage quota exhaustion.
 * - Supports JPG, PNG, WEBP, and GIF.
 */

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSizeBytes?: number;
}

export async function processUploadedImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.86,
    maxFileSizeBytes = 15 * 1024 * 1024, // 15MB input limit
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida (PNG, JPG, WEBP o GIF).');
  }

  if (file.size > maxFileSizeBytes) {
    const mbLimit = Math.round(maxFileSizeBytes / (1024 * 1024));
    throw new Error(`El archivo supera el tamaño máximo permitido de ${mbLimit} MB.`);
  }

  // Preserve animated GIFs directly if under 4MB to maintain animations
  if (file.type === 'image/gif') {
    if (file.size > 4 * 1024 * 1024) {
      throw new Error('El GIF animado excede el límite de 4 MB para almacenamiento local.');
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer el archivo GIF.'));
      reader.readAsDataURL(file);
    });
  }

  // Process standard images using Canvas scaling and compression
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen seleccionada.'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale if needed
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // For PNG with transparency, use image/png, otherwise image/jpeg or image/webp
          const isPng = file.type === 'image/png';
          // Using JPEG for non-PNG for maximum compression and compatibility
          const exportMime = isPng ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(exportMime, quality);
          resolve(compressed);
        } catch {
          // Fallback to raw data url if canvas has any issue
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
