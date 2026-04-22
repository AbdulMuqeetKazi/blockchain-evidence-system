import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getHealth, getEvidenceCount } from '../../services/api';
import { useAuth } from './AuthContext';

interface EvidenceContextType {
  totalCount: number;
  loadingCount: boolean;
  isConnected: boolean; // Simulating backend/blockchain connection status
  network: string;
  refreshCount: () => Promise<void>;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export const EvidenceProvider = ({ children }: { children: ReactNode }) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>("Unknown");
  const { user } = useAuth(); // Depend on auth if needed

  const refreshCount = async () => {
    try {
      console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

      const healthRes = await getHealth();
      if (healthRes.success) {
        setIsConnected(true);
        setNetwork(healthRes.network || "Sepolia");
      }

      const countRes = await getEvidenceCount();
      console.log("Evidence count response:", countRes);
      // The backend returns {"success":true,"data":{"count":"34"}}
      setTotalCount(Number(countRes.data.count));
    } catch (error) {
      console.error('Failed to fetch evidence count:', error);
      setIsConnected(false);
      setNetwork("Disconnected");
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
        network,
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
