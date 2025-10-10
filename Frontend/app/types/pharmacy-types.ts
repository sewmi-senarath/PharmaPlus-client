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

export type Coordinates = {
  lng: number;
  lat: number;
};

export type Address = {
  line1: string;
  line2: string;
  city: string;
  district: string;
  postalCode: string;
  coordinates: Coordinates;
};

export type OpeningHour = {
  day: number;
  open: string;
  close: string;
  closed: boolean;
};

export type DocumentFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
} | null;

export type PharmacyFormData = {
  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  pharmacyLicenseNumber: string;
  address: Address;
  openingHours: OpeningHour[];
  isAvailable: boolean;
  is24x7: boolean;
  pharmacyServices: string[];
  deliveryRadiusKm: number;
  registrationDocument: DocumentFile;
};

export type PharmacyProfile = {
  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  address: string;
  city?: string;
  district?: string;
  postalCode?: string;
  licenseNumber?: string;
};

export type NotificationSettings = {
  lowStock: boolean;
  expiry: boolean;
  newOrders: boolean;
  deliveryUpdates: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'low_stock' | 'expiry_alert' | 'new_order' | 'delivery_update';
  metadata?: any;
};

export type UserPreferences = {
  language: string;
  languageCode: string;
  largeFontMode: boolean;
  voiceCommands: boolean;
  theme?: 'light' | 'dark';
};