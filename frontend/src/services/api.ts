import axios from 'axios';

// In production (GitHub Pages), point to the live Render backend.
// In development, the Vite proxy forwards /api → localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// ─── Tool functions (Agent-callable) ─────────────────────────────────────────
export const getAssets = () => api.get('/assets').then(r => r.data);
export const getAssetDetails = (id: string) => api.get(`/assets/${id}`).then(r => r.data);
export const getWeatherForecast = () => api.get('/weather').then(r => r.data);
export const getCurrentWeather = () => api.get('/weather/current').then(r => r.data);
export const getGenerationHistory = () => api.get('/generation/history').then(r => r.data);
export const getGenerationForecast = () => api.get('/generation/forecast').then(r => r.data);
export const getMaintenanceRisk = () => api.get('/maintenance').then(r => r.data);
export const getGridStatus = () => api.get('/grid').then(r => r.data);
export const getAlerts = () => api.get('/alerts').then(r => r.data);
export const getAgents = () => api.get('/agents').then(r => r.data);
export const sendChatMessage = (message: string) => api.post('/ai/chat', { message }).then(r => r.data);
export const checkHealth = () => api.get('/health').then(r => r.data);

export default api;
