import api from './api';

export const authService = {
  // Login
  login: async (email: string, password: string, role: string) => {
    try {
      console.log('�� Sending to backend:', { email, password: '***', role });
      
      const response = await api.post('/users/login', {
        email,
        password,
        role: role, // Role already converted before calling this function
      });
      
      console.log('✅ Backend response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Backend error:', error.response?.data);
      throw error.response?.data?.message || 'Login failed';
    }
  },
  

  // Sign up
  signup: async (userData: any) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Signup failed';
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Logout failed';
    }
  },
};