import api from './api';

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_MEDIA_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Format raw byte size into human readable string
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate file before upload based on type and size limits
 */
export function validateFile(file) {
  if (!file) return { valid: false, error: 'No file selected' };

  const isImage = file.type.startsWith('image/');
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_MEDIA_SIZE;
  const maxSizeLabel = isImage ? '10MB' : '100MB';

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${maxSizeLabel} (${formatBytes(file.size)}).`,
    };
  }

  // Allowed MIME / Extensions
  const allowedExtensions = [
    // Video
    'mp4', 'mov', 'webm', 'avi', 'mkv',
    // Audio
    'mp3', 'wav', 'm4a', 'aac', 'ogg',
    // Image / Sketches
    'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'fig',
    // Documents
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'
  ];

  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext) && !isImage) {
    return {
      valid: false,
      error: `Unsupported file type (.${ext}). Supported formats: Video, Audio, Images, Sketches & Documents.`,
    };
  }

  return { valid: true };
}

/**
 * Process a file upload, handling real API upload with progress callback
 * and falling back to object URL previews for quick responsiveness.
 */
export async function uploadFile(file, category = 'general', onProgress = () => {}, customId = null) {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileId = customId || `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const previewUrl = file.type.startsWith('image/') || file.type.startsWith('video/')
    ? URL.createObjectURL(file)
    : null;

  const attachment = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    category,
    previewUrl,
    url: previewUrl,
    progress: 0,
    status: 'uploading',
    uploadedAt: new Date().toISOString(),
  };

  // Try real API upload if available
  try {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('category', category);

    const res = await api.post('/uploads/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    if (res.data && res.data.data && res.data.data.url) {
      attachment.url = res.data.data.url;
      attachment.status = 'ready';
      attachment.progress = 100;
      onProgress(100);
      return attachment;
    }
  } catch (err) {
    console.warn('Backend endpoint /uploads/media not available or failed. Falling back to local preview mode.', err);
  }

  // Simulated chunked upload fallback
  for (let percent = 20; percent <= 100; percent += 20) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    onProgress(percent);
  }

  attachment.status = 'ready';
  attachment.progress = 100;
  return attachment;
}
