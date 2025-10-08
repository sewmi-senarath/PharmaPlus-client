import { http } from './http';
import type { Medicine, UpsertMedicine, Order, Availability, PharmacyInfo } from '@/modules/pharmacy/types';

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

  getInfo(): Promise<PharmacyInfo> {
    // backend route: adjust if your API uses a different path
    return http('/pharmacy/info');
  },
};