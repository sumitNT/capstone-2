"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_URLS } from "../app/api/api";
import axios from "axios";

// Partner interface
interface Partner {
  id: string;
  name: string;
}

// partnerLoaderConfig interface
interface PartnerLoaderConfig {
    date: Date;
    loaderId: string;
    templateName: string;
    loaderType: string;
    uploadedBy: string;
    action: File;
}

// Context type definition
interface PartnerContextType {
  partnerList: Partner[];
  setPartnerList: React.Dispatch<React.SetStateAction<Partner[]>>;
  fetchPartners: () => Promise<void>;
  loading: boolean;
  error: string | null;
  partnerLoaderConfigList: PartnerLoaderConfig[];
  setPartnerLoaderConfigList: React.Dispatch<React.SetStateAction<PartnerLoaderConfig[]>>;
  fetchPartnerLoaderConfig: (partner: Partner) => Promise<void>;
  activePartnerId: string | null;
  setActivePartnerId: React.Dispatch<React.SetStateAction<string | null>>;
  activeConfig: PartnerLoaderConfig | null;
  setActiveConfig: React.Dispatch<React.SetStateAction<PartnerLoaderConfig | null>>;
  isUploading: boolean;
  uploadError: string | null;
  handleQuickSubmit: () => void;
}

// Create the context
const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

// Provider component props
interface PartnerProviderProps {
  children: ReactNode;
}

// Provider component
export const PartnerProvider: React.FC<PartnerProviderProps> = ({
  children,
}) => {
  const [partnerList, setPartnerList] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerLoaderConfigList, setPartnerLoaderConfigList] = useState<PartnerLoaderConfig[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activeConfig, setActiveConfig] = useState<PartnerLoaderConfig | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const partners = await API_URLS.getPartnerList();
      setPartnerList(partners);
    } catch (error) {
      console.error("Failed to fetch partner list:", error);
      setError("Failed to fetch partner list");
      setPartnerList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerLoaderConfig = async (partner: Partner) => {
    setLoading(true);
    setError(null);
    setActivePartnerId(partner.id); // Store the active partner ID
    try {
      const config = await API_URLS.getPartnerLoaderConfigList(partner.id);
      setPartnerLoaderConfigList(config);
      console.log("Fetching partner loader config for:", partner);
    } catch (error) {
      console.error("Failed to fetch partner loader config:", error);
      setError("Failed to fetch partner loader config");
      setPartnerLoaderConfigList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = () => {
    // Validate that partner and loader config are selected
    if (!activePartnerId) {
      alert('Please select a partner first from the dropdown menu.');
      return;
    }

    if (!activeConfig) {
      alert('Please select a loader configuration from the table first.');
      return;
    }

    // Create a hidden file input for Excel files
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.multiple = false;
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      setUploadError(null);

      try {
        const result = await API_URLS.uploadExcelFile(activePartnerId, activeConfig.loaderId, file);
        
        console.log('Upload successful:', result);
        alert(`File "${file.name}" uploaded successfully!\nPartner ID: ${activePartnerId}\nLoader Config: ${activeConfig.templateName}`);
        
      } catch (error: any) {
        console.error('Error uploading file:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
        setUploadError(errorMessage);
        alert(`Error uploading file: ${errorMessage}\nPlease try again.`);
      } finally {
        setIsUploading(false);
      }
    };
    
    fileInput.click();
  };

  const value: PartnerContextType = {
    partnerList,
    setPartnerList,
    fetchPartners,
    loading,
    error,
    partnerLoaderConfigList,
    setPartnerLoaderConfigList,
    fetchPartnerLoaderConfig,
    activePartnerId,
    setActivePartnerId,
    activeConfig,
    setActiveConfig,
    isUploading,
    uploadError,
    handleQuickSubmit,
  };

  return (
    <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>
  );
};

// Custom hook to use the context
export const usePartnerContext = (): PartnerContextType => {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error("usePartnerContext must be used within a PartnerProvider");
  }
  return context;
};
