import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

export function parseApiError(error: any): string {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "Unknown API error"
  );
}
