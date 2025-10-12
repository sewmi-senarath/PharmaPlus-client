import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DEFAULT_API = "http://10.0.2.2:5000";

// Base API URL without trailing slash
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_API;

// Update line 4 to match your backend
const API_BASE_URL = `${API_BASE}`; // ✅ Correct
// const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000/api'; // For mobile device testing


//const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.10:5000/api' ; 


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