import axios from 'axios';

export const uploadToFolder = async (file: File, folder: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  formData.append('timestamp', Math.round((new Date()).getTime()/1000).toString());

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 30000
      }
    );
    
    if (!response.data.secure_url) {
      throw new Error('Upload succeeded but no URL returned');
    }
    
    return response.data.secure_url;
  } catch (error: any) {
    console.error('Full upload error:', {
      config: error.config,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.error?.message || 'Upload failed');
  }
};