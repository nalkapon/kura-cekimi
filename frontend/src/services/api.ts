import axios from 'axios';

// Use Vite env variable when deployed; fallback to localhost for local dev
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Draw API
export const drawAPI = {
  swiss: async () => {
    const response = await api.post('/draw/swiss');
    return response.data;
  },
  getResult: async () => {
    const response = await api.get('/draw/result');
    return response.data;
  },
};

// Playoff API
// Playoff API removed (legacy)

// Bracket API
// Bracket API removed (legacy 32-team)

export default api;
