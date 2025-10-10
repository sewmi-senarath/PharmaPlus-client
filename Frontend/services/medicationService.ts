import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Medication {
  id?: string;
  _id?: string;
  userId?: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  notificationId?: string;
  isActive?: boolean;
}

export const medicationService = {
  // Get all medications for user
  getAll: async () => {
    try {
      const response = await api.get('/medications');
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch medications';
    }
  },

  // Get single medication
  getById: async (id: string) => {
    try {
      const response = await api.get(`/medications/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch medication';
    }
  },

  // Create new medication
  create: async (medicationData: Partial<Medication>) => {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to create medication';
    }
  },

  // Update medication
  update: async (id: string, medicationData: Partial<Medication>) => {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data.data || response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update medication';
    }
  },

  // Delete medication
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/medications/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to delete medication';
    }
  },

  // Mark medication as taken
  markAsTaken: async (id: string, takenAt: Date) => {
    try {
      const response = await api.post(`/medications/${id}/taken`, { takenAt });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to mark as taken';
    }
  },
};

