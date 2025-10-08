export type Medicine = {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQty: number;
  expiryDate: string; // ISO
  status?: 'active'|'low-stock'|'expiring-soon'|'out-of-stock';
  discounted?: boolean;
  storageAdvice?: string;
  imageUrl?: string;
};

export type UpsertMedicine = {
  id?: string;
  name: string;
  category: string;
  price: number;
  stockQty: number;
  expiryDate: string;
  storageAdvice?: string;
  imageBase64?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending'|'accepted'|'in-progress'|'completed';
  items: { name: string; qty: number; price: number }[];
};

export type Availability = {
  isOpen: boolean;
  is24h: boolean;
  opening: string;  // '08:00'
  closing: string;  // '22:00'
  days: Record<string, boolean>;
};

export type PharmacyInfo = {
  id: string;
  name: string;
};