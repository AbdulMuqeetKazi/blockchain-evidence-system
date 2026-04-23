import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

export const normalizeEvidence = (data: any) => {
  if (!data) return null;
  return {
    id: data.id ?? data.evidenceId ?? "",
    evidenceId: data.id ?? data.evidenceId ?? "",
    caseName: data.caseName ?? data.caseId ?? "",
    description: data.description ?? "",
    evidenceType: data.evidenceType ?? data.type ?? "",
    location: data.location ?? "",
    suspectName: data.suspectName ?? data.suspect ?? "",
    dateCollected: data.dateCollected ?? data.date ?? "",
    fileName: data.fileName ?? "",
    fileHash: data.fileHash ?? "",
    blockchainHash: data.blockchainHash ?? data.hash ?? "",
    transactionHash: data.transactionHash ?? data.txHash ?? "",
    blockNumber: data.blockNumber ?? "",
    ipfsCid: data.ipfsCid ?? data.fileCID ?? data.fileCid ?? "",
    metadataCid: data.metadataCid ?? data.metadataCID ?? "",
    owner: data.owner ?? "",
    uploadedBy: data.uploadedBy ?? "",
    timestamp: data.timestamp ?? 0,
    registeredAt: data.registeredAt ?? "",
    hash: data.hash ?? data.blockchainHash ?? "",
    isValid: data.isValid,
  };
};

export const uploadEvidence = async (formData: FormData) => {
  const response = await api.post("/evidence/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getEvidenceCount = async () => {
  const response = await api.get("/evidence/count");
  return response.data;
};
export const getHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};
export const getAllEvidence = async () => {
  const response = await api.get("/evidence/all");
  if (response.data && response.data.data) {
    if (Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(normalizeEvidence);
    } else if (Array.isArray(response.data.data.data)) {
      response.data.data.data = response.data.data.data.map(normalizeEvidence);
    }
  } else if (Array.isArray(response.data)) {
      response.data = response.data.map(normalizeEvidence);
  }
  return response.data;
};
export const getEvidenceById = async (id: string | number) => {
  const response = await api.get(`/evidence/${id}`);
  if (response.data && response.data.data) {
    response.data.data = normalizeEvidence(response.data.data);
  }
  return response.data;
};
export const getEvidenceByHash = async (hash: string) => {
  const response = await api.get(`/evidence/hash/${hash}`);
  if (response.data && response.data.data) {
    response.data.data = normalizeEvidence(response.data.data);
  }
  return response.data;
};
export const getEvidenceHistory = async (id: string | number) => {
  const response = await api.get(`/evidence/history/${id}`);
  // History might be a timeline object, if it returns evidence data, we normalize it.
  return response.data;
};
export const verifyEvidence = async (formData: FormData) => {
  const response = await api.post("/evidence/verify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export function parseApiError(error: any): string {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "Unknown API error"
  );
}

export const getVerificationStats = async () => {
  const response = await api.get("/verification/stats");
  return response.data;
};
