import { http } from './http';
import type { Medicine, UpsertMedicine, Order, Availability, PharmacyInfo, PharmacyProfile, NotificationSettings } from '@/modules/pharmacy/types';
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const PharmacyAPI = {
  // Inventory
  listInventory(): Promise<Medicine[]> {
    return http('/pharmacy/inventory');
  },
  createMedicine(input: UpsertMedicine): Promise<Medicine> {
    return http('/pharmacy/inventory', { method: 'POST', body: JSON.stringify(input) });
  },
  updateMedicine(id: string, input: UpsertMedicine): Promise<Medicine> {
    return http(`/pharmacy/inventory/${id}`, { method: 'PUT', body: JSON.stringify(input) });
  },
  deleteMedicine(id: string): Promise<{ ok: true }> {
    return http(`/pharmacy/inventory/${id}`, { method: 'DELETE' });
  },
  nearExpiry(days = 30): Promise<Medicine[]> {
    return http(`/pharmacy/inventory/near-expiry?days=${days}`);
  },
  applyDiscount(id: string, pct: number): Promise<Medicine> {
    return http(`/pharmacy/inventory/${id}/discount`, { method: 'POST', body: JSON.stringify({ pct }) });
  },

  // Availability (pharmacy hours)
  getAvailability(): Promise<Availability> {
    return http(`/pharmacy/availability`);
  },
  saveAvailability(payload: Availability): Promise<{ ok: true }> {
    return http(`/pharmacy/availability`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  // Orders
  listOrders(): Promise<Order[]> {
    return http(`/pharmacy/orders`);
  },
  updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return http(`/pharmacy/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  },

  // Notifications
  listNotifications(): Promise<any[]> {
    return http(`/pharmacy/notifications`);
  },
  markNotificationRead(id: string): Promise<{ ok: true }> {
    return http(`/pharmacy/notifications/${id}/read`, { method: 'PUT' });
  },

  //Pharmacy
  async registerPharmacy(data: any) {
    const response = await fetch(`${API_BASE}/pharmacy/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  },

  getInfo(): Promise<PharmacyInfo> {
    // backend route: adjust if your API uses a different path
    return http('/pharmacy/info');
  },

  // Profile Management
  getProfile(pharmacyId: string): Promise<PharmacyProfile> {
    return http(`/pharmacy/${pharmacyId}/profile`);
  },

  updateProfile(pharmacyId: string, profileData: Partial<PharmacyProfile>): Promise<PharmacyProfile> {
    return http(`/pharmacy/${pharmacyId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Notification Settings
  getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return http(`/pharmacy/${userId}/notifications/settings`);
  },

  updateNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings> {
    return http(`/pharmacy/${userId}/notifications/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Get pharmacy by ID (for detailed info)
  getPharmacyById(pharmacyId: string): Promise<any> {
    return http(`/pharmacy/get/${pharmacyId}`);
  },

  // Update pharmacy (full update)
  updatePharmacy(pharmacyId: string, data: any): Promise<any> {
    return http(`/pharmacy/update/${pharmacyId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
 
};