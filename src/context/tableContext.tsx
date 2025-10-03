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
  sortData: <T extends Record<string, any>>(data: T[]) => T[];
  resetSorting: () => void;
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

  const sortData = <T extends Record<string, any>>(data: T[]): T[] => {
    // Find which column is being sorted
    const sortColumn = Object.keys(sortConfig).find(
      (key) => sortConfig[key as keyof SortConfig] !== "default"
    ) as keyof SortConfig | undefined;

    if (!sortColumn || sortConfig[sortColumn] === "default") {
      return [...data]; // Return original order if no sorting
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle different data types
      let comparison = 0;

      if (sortColumn === "localDateTime") {
        // Sort dates
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        comparison = dateA - dateB;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        // Sort strings alphabetically
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        // Sort numbers
        comparison = aValue - bValue;
      } else {
        // Fallback to string comparison
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      // Apply ascending or descending order
      return sortConfig[sortColumn] === "ascending" ? comparison : -comparison;
    });

    return sortedData;
  };

  const resetSorting = () => {
    setSortConfig({
      localDateTime: "default",
      configId: "default",
      configName: "default",
      loaderType: "default",
    });
  };

  const value = {sortConfig, handleSortToggle, sortData, resetSorting};

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
