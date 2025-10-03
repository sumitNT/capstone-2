"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { API_URLS } from "../app/api/api";
import axios from "axios";

// Partner interface
interface Partner {
  id: string;
  name: string;
}

// partnerLoaderConfig interface - Updated to match API response
interface PartnerLoaderConfig {
    id: number;
    configId: string;
    configName: string;
    localDateTime: string;
    loaderType: string;
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
  // Separate file states for both loaders
  firstRawLoaderFile: File | null;
  setFirstRawLoaderFile: React.Dispatch<React.SetStateAction<File | null>>;
  rawLoaderFile: File | null;
  setRawLoaderFile: React.Dispatch<React.SetStateAction<File | null>>;
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
  // Separate file states for both loaders
  const [firstRawLoaderFile, setFirstRawLoaderFile] = useState<File | null>(null);
  const [rawLoaderFile, setRawLoaderFile] = useState<File | null>(null);

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

  // Load partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartnerLoaderConfig = async (partner: Partner) => {
    console.log("HII")
    setLoading(true);
    setError(null);
    setActivePartnerId(partner.id); // Store the active partner ID
    try {
      const config = await API_URLS.getPartnerLoaderConfigList(partner.id);
      console.log(config)
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

  const handleQuickSubmit = async () => {
    // Determine which file to use and validation requirements
    const currentFile = firstRawLoaderFile || rawLoaderFile;
    const isFirstRawLoader = !!firstRawLoaderFile;
    
    // Validate partner selection
    if (!activePartnerId) {
      alert('Please select a partner first from the dropdown menu.');
      return;
    }

    // For rawLoader, also check activeConfig; for firstRawLoader, config is optional
    if (!isFirstRawLoader && !activeConfig) {
      alert('Please select a loader configuration from the table first.');
      return;
    }

    // Check if file is uploaded
    if (!currentFile) {
      alert('Please upload a file using either firstRawLoader or RawLoader.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      let result;
      
      if (isFirstRawLoader) {
        // Use uploadFirstRawLoaderFile for firstRawLoader uploads
        result = await API_URLS.uploadFirstRawLoaderFile(activePartnerId, currentFile);
      } else {
        // Use uploadExcelFile for rawLoader uploads (requires config)
        const configId = activeConfig?.configId || activePartnerId;
        result = await API_URLS.uploadExcelFile(activePartnerId, configId, currentFile);
      }
      
      console.log('Upload result:', result);
      
      // Handle the response based on success/failure from backend
      if (result.success) {
        // Success response - show detailed results
        const loaderType = isFirstRawLoader ? 'firstRawLoader' : 'rawLoader';
        const configInfo = activeConfig ? `\nLoader Config: ${activeConfig.configName}` : '';
        
        let message = `File "${currentFile.name}" processed!\nLoader Type: ${loaderType}\nPartner ID: ${activePartnerId}${configInfo}\n\n`;
        message += `Result: ${result.message}\n`;
        
        if (result.successCount !== undefined) {
          message += `Successful Records: ${result.successCount}\n`;
        }
        if (result.errorCount !== undefined) {
          message += `Failed Records: ${result.errorCount}`;
        }
        
        alert(message);
        
        // Clear the uploaded file after processing
        if (isFirstRawLoader) {
          setFirstRawLoaderFile(null);
        } else {
          setRawLoaderFile(null);
        }
      } else {
        // Error response from backend
        let errorMessage = `Upload failed: ${result.message || 'Unknown error'}\n`;
        
        if (result.errorFilePath) {
          errorMessage += `Error file: ${result.errorFilePath}\n`;
        }
        if (result.errorCount !== undefined) {
          errorMessage += `Failed Records: ${result.errorCount}\n`;
        }
        if (result.successCount !== undefined) {
          errorMessage += `Successful Records: ${result.successCount}`;
        }
        
        setUploadError(result.message || 'Upload failed');
        alert(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // Handle different types of errors
      let errorMessage = 'Upload failed';
      
      if (error.response?.data) {
        // Backend returned an error response
        const backendError = error.response.data;
        errorMessage = backendError.message || backendError.error || 'Backend error';
        
        if (backendError.errorFilePath) {
          errorMessage += `\nError file: ${backendError.errorFilePath}`;
        }
        if (backendError.errorCount !== undefined) {
          errorMessage += `\nFailed Records: ${backendError.errorCount}`;
        }
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      alert(`Error uploading file: ${errorMessage}\nPlease try again.`);
    } finally {
      setIsUploading(false);
    }
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
    firstRawLoaderFile,
    setFirstRawLoaderFile,
    rawLoaderFile,
    setRawLoaderFile,
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
