import api from '../../../../config/api'; // This imports from config/api.ts (your axios instance)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const pharmacyCheckService = {
  // Check if user has a registered pharmacy
  checkPharmacyExists: async (userId: string) => {
    try {
      console.log('🔍 Checking pharmacy for user:', userId);
      
      const response = await api.get(`/pharmacy/user/${userId}`);
      
      console.log('✅ Pharmacy check response:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('ℹ️ No pharmacy found for user:', error.response?.status);
      
      // If 404, it means no pharmacy exists (which is fine)
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  },

  // Get pharmacy info
  getPharmacyInfo: async (pharmacyId: string) => {
    try {
      const response = await api.get(`/pharmacy/get/${pharmacyId}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error fetching pharmacy:', error);
      throw error;
    }
  },

  // Register new pharmacy with createdBy
  registerPharmacy: async (pharmacyData: any) => {
    try {
      // Get user ID from storage
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      // Add createdBy to pharmacy data
      const payload = {
        ...pharmacyData,
        createdBy: userId,
        updatedBy: userId
      };

      console.log('📝 Registering pharmacy:', payload);

      const response = await api.post('/pharmacy/add', payload);
      
      console.log('✅ Pharmacy registered:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error registering pharmacy:', error);
      throw error;
    }
  },
};