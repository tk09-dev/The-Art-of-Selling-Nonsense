import axios from 'axios';

const api = axios.create({
  baseURL: 'https://the-art-of-selling-nonsense-backend.onrender.com',
});

export default api;
