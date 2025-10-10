import { defaultHeaders } from "./config";
import { medicineRoutes, ApiMedicine, ApiResponse } from "./routes";

/**
 * Generic HTTP helpers with error handling
 */
async function http<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: defaultHeaders,
    ...init
  });

  // Always try to parse response as JSON
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`Failed to parse response: ${res.status} ${res.statusText}`);
  }

  // Handle API error responses
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

/**
 * Medicine API Client
 */
export const medicineApi = {
  // List all medicines
  list: async () => {
    const url = medicineRoutes.list();
    const response = await http<ApiResponse<ApiMedicine[]>>(url);
    return response;
  },

  // Search master medicines
  searchMaster: async (query: string) => {
    const url = medicineRoutes.masterSearch(query);
    const response = await http<ApiResponse<ApiMedicine[]>>(url);
    return (response as any).results || [];
  },

  // Pharmacy specific operations
  pharmacy: {
    // List medicines for a pharmacy
    list: async (pharmacyId: string) => {
      const url = medicineRoutes.pharmacy.list(pharmacyId);
      const response = await http<ApiResponse<ApiMedicine[]>>(url);
      return (response as any).medicines || [];
    },

    // Add medicine to pharmacy
    add: async (pharmacyId: string, medicine: Partial<ApiMedicine>) => {
      const url = medicineRoutes.pharmacy.add(pharmacyId);
      return http<ApiResponse<ApiMedicine>>(url, {
        method: "POST",
        body: JSON.stringify(medicine)
      });
    },

    // Scan barcode
    scan: async (pharmacyId: string, barcode: string) => {
      const url = medicineRoutes.pharmacy.scan(pharmacyId);
      return http<ApiResponse<ApiMedicine>>(url, {
        method: "POST",
        body: JSON.stringify({ barcode })
      });
    }
  }
};

// Types needed by components
export type { ApiMedicine };
