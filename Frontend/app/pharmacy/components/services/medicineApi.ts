import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =============== TYPES ===============

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Medicine {
  _id: string;
  medicineName: string;
  genericName?: string;
  brandName?: string;
  dosage?: string;
  strength?: string;
  doseForm?: string;
  route?: string;
  category?: string;
  manufacturer?: string;
  price: number;
  stockQty: number;
  minQty?: number;
  isActive: boolean;
  isOnDiscount?: boolean;
  discountPct?: number;
  lowStock?: boolean;
  soonToExpire?: boolean;
}

export interface Analytics {
  overview: {
    totalMedicines: number;
    activeMedicines: number;
    lowStockCount: number;
    expiringCount: number;
    totalInventoryValue: number;
  };
}

// =============== BASE URL CONFIG ===============

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============== INTERCEPTORS ===============

// Attach bearer token to all requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      // Ensure headers is an AxiosHeaders instance
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers as any);
      }
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 (unauthorized)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      console.log("🔒 Token expired, please log in again.");
    }
    return Promise.reject(error);
  }
);

// =============== API METHODS ===============

const medicineApi = {
  // ---------- Master Medicine Search ----------
  searchMaster: async (query: string): Promise<ApiResponse<Medicine[]>> => {
    const res = await apiClient.get<ApiResponse<Medicine[]>>(
      `/api/medicine/master/search`,
      { params: { q: query } }
    );
    return res.data;
  },

  // ---------- Scan Barcode ----------
  scanBarcode: async (
    pharmacyId: string,
    gtin: string,
    createDraft = false
  ): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/api/medicine/pharmacies/${pharmacyId}/scan`,
      { gtin, createDraft }
    );
    return res.data;
  },

  // ---------- Add Medicine ----------
  addMedicine: async (
    pharmacyId: string,
    formData: FormData
  ): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>(
      `/api/medicine/pharmacies/${pharmacyId}/add-with-images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  // ---------- Get Pharmacy Inventory ----------
  getMedicinesByPharmacy: async (
    pharmacyId: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse<Medicine[]>> => {
    const res = await apiClient.get<ApiResponse<Medicine[]>>(
      `/api/medicine/pharmacies/${pharmacyId}/inventory`,
      { params }
    );
    return res.data;
  },

  // ---------- Get Analytics ----------
  getAnalytics: async (
    pharmacyId: string
  ): Promise<ApiResponse<Analytics>> => {
    const res = await apiClient.get<ApiResponse<Analytics>>(
      `/api/medicine/pharmacies/${pharmacyId}/analytics`
    );
    return res.data;
  },

  // ---------- Toggle Availability ----------
  toggleAvailability: async (
    medicineId: string
  ): Promise<ApiResponse<{ isActive: boolean }>> => {
    const res = await apiClient.patch<ApiResponse<{ isActive: boolean }>>(
      `/api/medicine/${medicineId}/toggle-availability`
    );
    return res.data;
  },
};

export default medicineApi;
