import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update line 4 to match your backend
const API_BASE_URL = 'http://192.168.1.3:5000/api'; // ✅ Correct
// const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api'; // For mobile device testing

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      console.log('Unauthorized - redirect to login');
    }
    return Promise.reject(error);
  }
);

export default api;