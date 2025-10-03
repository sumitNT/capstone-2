"use client";
import { createContext, useState, ReactNode, useContext } from "react";

type SortState = "default" | "ascending" | "descending";

interface SortConfig {
  localDateTime: SortState;
  configId: SortState;
  configName: SortState;
  loaderType: SortState;
}

interface TableContextType {
  sortConfig: SortConfig;
  handleSortToggle: (column: keyof SortConfig) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableProviderProps {
  children: ReactNode;
}

export function TableProvider({ children }: TableProviderProps) {
  

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    localDateTime: "default",
    configId: "default",
    configName: "default",
    loaderType: "default",
  });

  const handleSortToggle = (column: keyof SortConfig) => {
    setSortConfig((prev) => {
      const currentState = prev[column];
      let newState: SortState;

      if (currentState === "default") {
        newState = "ascending";
      } else if (currentState === "ascending") {
        newState = "descending";
      } else {
        newState = "default";
      }

      // Reset all other columns to default when one column changes
      return {
        localDateTime: column === "localDateTime" ? newState : "default",
        configId: column === "configId" ? newState : "default",
        configName: column === "configName" ? newState : "default",
        loaderType: column === "loaderType" ? newState : "default",
      };
    });
  };

  const value = {sortConfig, handleSortToggle};

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);

  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }

  return context;
}
