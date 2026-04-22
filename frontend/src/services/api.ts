import axios from 'axios';
import type { Evidence, DashboardStats, UploadResponse, VerifyResponse, EvidenceHistory } from '../types/evidence';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

// Error parser
export const parseApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data?.message || error.response.data?.error || `Server Error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'Network Error: No response from server. Is the backend running?';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected error occurred';
  }
};

export const api = {
  uploadEvidence: async (formData: FormData): Promise<UploadResponse> => {
    const response = await apiClient.post<UploadResponse>('/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  verifyEvidence: async (formData: FormData): Promise<VerifyResponse> => {
    const response = await apiClient.post<VerifyResponse>('/evidence/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  transferCustody: async (evidenceId: string | number, newOwner: string) => {
    const response = await apiClient.post('/evidence/transfer', {
      evidenceId,
      newOwner,
    });
    return response.data;
  },

  getEvidenceById: async (id: string | number): Promise<Evidence> => {
    const response = await apiClient.get<Evidence>(`/evidence/${id}`);
    return response.data;
  },

  getEvidenceCount: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<{ count: number }>('/evidence/count');
    return { totalEvidence: response.data.count };
  },

  getEvidenceHistory: async (id: string | number): Promise<EvidenceHistory> => {
    const response = await apiClient.get<EvidenceHistory>(`/evidence/history/${id}`);
    return response.data;
  },

  getEvidenceByHash: async (hash: string): Promise<Evidence> => {
    const response = await apiClient.get<Evidence>(`/evidence/hash/${hash}`);
    return response.data;
  },
};
