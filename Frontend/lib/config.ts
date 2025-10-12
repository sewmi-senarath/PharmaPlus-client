/**
 * API Configuration
 * Set EXPO_PUBLIC_API_BASE_URL in .env to override these defaults
 * 
 * Examples:
 * - Android Emulator: http://10.0.2.2:5000
 * - iOS Simulator: http://localhost:5000
 * - Physical Device: http://192.168.1.x:5000
 */

const DEFAULT_API = process.env.EXPO_PUBLIC_API_BASE_URL ||  "http://192.168.1.10:5000/api";

// Base API URL without trailing slash
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_API;

// Full medicine module base (all medicine routes are under /api/medicine)
export const MEDICINE_API = `${API_BASE}/medicine`;

// Common headers for all requests
export const defaultHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

// Re-export pharmacy ID for components that need it
export const PHARMACY_ID = process.env.EXPO_PUBLIC_PHARMACY_ID || "";
