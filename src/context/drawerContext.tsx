"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Drawer context type definition
interface DrawerContextType {
  isDrawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDrawerToggle: (pressed: boolean) => void;
}

// Create the context
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

// Provider component props
interface DrawerProviderProps {
  children: ReactNode;
}

// Provider component
export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = (pressed: boolean) => {
    setDrawerOpen(pressed);
  };

  const value: DrawerContextType = {
    isDrawerOpen,
    setDrawerOpen,
    handleDrawerToggle,
  };

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
};

// Custom hook to use the context
export const useDrawerContext = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }
  return context;
};
