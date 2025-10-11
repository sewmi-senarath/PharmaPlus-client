import { MEDICINE_API } from "./config";

export interface PharmacyAddress {
  line1: string;
  line2: string;
  city: string;
  district: string;
  postalCode: string;
  geo?: {
    type: string;
    coordinates: number[];
  };
}

export interface Pharmacy {
  _id: string;
  pharmacyName: string;
  address: PharmacyAddress;
}

export interface ApiBatch {
  batchNo: string;
  expiry: string;
  qty: number;
  manufacturingDate: string;
}

export interface StorageInstructions {
  temperature: string;
  lightProtection: boolean;
  moistureProtection: boolean;
  specialInstructions: string;
  shelfLife: string;
}

export interface ApiMedicine {
  _id: string;
  pharmacyId: Pharmacy;
  masterMedicineId: string | null;
  medicineName: string;
  dosage: string;
  drugCode: string;
  manufacturer: string;
  strength: string;
  doseForm: string;
  route: string;
  category: string;
  genericName: string;
  brandName: string;
  skuCode: string;
  price: number;
  stockQty: number;
  batches: ApiBatch[];
  minQty: number;
  discountPct: number;
  discountReason: string;
  barcodes: string[];
  gtin: string;
  images: string[];
  storageInstructions: StorageInstructions;
  requiresPrescription: boolean;
  prescriptionOnly: boolean;
  unitsPerPack: number;
  isActive: boolean;
  isDeleted: boolean;
  lowStock: boolean;
  soonToExpire: boolean;
  isOnDiscount: boolean;
  entryMethod: string;
  lastRestocked: string;
  totalSold: number;
  viewCount: number;
  medicineId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response envelopes
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  count?: number;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  data?: never;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// All medicine routes centralized here
export const medicineRoutes = {
  // List all medicines
  list: () => `${MEDICINE_API}/all`,

  // Search master medicines
  masterSearch: (query: string) => 
    `${MEDICINE_API}/master/search?q=${encodeURIComponent(query)}`,

  // Pharmacy specific routes
  pharmacy: {
    list: (pharmacyId: string) => 
      `${MEDICINE_API}/pharmacies/${pharmacyId}/medicines`,
    
    add: (pharmacyId: string) => 
      `${MEDICINE_API}/pharmacies/${pharmacyId}/add`,
    
    scan: (pharmacyId: string) => 
      `${MEDICINE_API}/pharmacies/${pharmacyId}/scan`,
  },

  // Master medicine management
  master: {
    import: () => `${MEDICINE_API}/master/import`,
  }
};
