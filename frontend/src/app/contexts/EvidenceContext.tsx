import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../services/api';
import { useAuth } from './AuthContext';

interface EvidenceContextType {
  totalCount: number;
  loadingCount: boolean;
  isConnected: boolean; // Simulating backend/blockchain connection status
  refreshCount: () => Promise<void>;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export const EvidenceProvider = ({ children }: { children: ReactNode }) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth(); // Depend on auth if needed

  const refreshCount = async () => {
    try {
      const stats = await api.getEvidenceCount();
      setTotalCount(stats.totalEvidence);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch evidence count:', error);
      setIsConnected(false);
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshCount();

    // Poll every 10 seconds
    const interval = setInterval(() => {
      refreshCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <EvidenceContext.Provider
      value={{
        totalCount,
        loadingCount,
        isConnected,
        refreshCount,
      }}
    >
      {children}
    </EvidenceContext.Provider>
  );
};

export const useEvidence = () => {
  const context = useContext(EvidenceContext);
  if (context === undefined) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
};
