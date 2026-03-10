import axios from 'axios';

const API_URL = '/api';

export const fetchNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`);
  return response.data;
};

export const createNote = async (formData) => {
  const response = await axios.post(`${API_URL}/notes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath;
};
