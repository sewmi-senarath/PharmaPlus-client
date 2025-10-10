export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  count?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ApiMedicine {
  _id: string;
  pharmacyId: {
    _id: string;
    pharmacyName: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      district: string;
      postalCode: string;
    }
  };
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
  batches: Array<{
    batchNo: string;
    expiry: string;
    qty: number;
    manufacturingDate: string;
  }>;
  lowStock: boolean;
  soonToExpire: boolean;
  isOnDiscount: boolean;
  discountPct: number;
}