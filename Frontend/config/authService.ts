import api from './api';

export const authService = {
  // Login
  login: async (email: string, password: string, role: string) => {
    try {
      console.log('🔐 Sending to backend:', { email, password: '***', role });
      
      const response = await api.post('/users/login', {
        email,
        password,
        role: role, // Role already converted before calling this function
      });
      
      console.log('✅ Backend response:', response.data);
      
      // Return the actual data object containing tokens
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Backend error:', error.response?.data || error.message);
      
      // Throw a proper error with message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  },
  
  // Sign up - FIXED: Changed from /signup to /register
  signup: async (userData: any) => {
    try {
      console.log('📝 Signing up user:', { ...userData, password: '***' });
      
      // Use /register endpoint to match backend
      const response = await api.post('/users/register', userData);
      
      console.log('✅ Signup successful:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Signup error:', error.response?.data || error.message);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Signup failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.get('/users/logout');
      return response.data;
    } catch (error: any) {
      console.error('❌ Logout error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },
};