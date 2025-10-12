import api from '../config/api';

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  preferred_language?: string;
  avatar?: string;
  // Additional fields that might be in the response
  [key: string]: any;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  preferred_language?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get user details
  getUserDetails: async () => {
    try {
      const response = await api.get('/users/user-details');
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch user details';
    }
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData) => {
    try {
      const response = await api.put('/users/update-profile', profileData);
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  // Update password
  updatePassword: async (passwordData: UpdatePasswordData) => {
    try {
      const response = await api.put('/users/update-password', passwordData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update password';
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.get('/users/logout');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to logout';
    }
  },
};

