import { IconButton, Table } from "@hdfclife-insurance/one-x-ui";
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowsDownUp,
  GearSix,
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import React, { useState, useMemo, useEffect } from "react";
import { useTableContext } from "../../../context/tableContext";
import { usePartnerContext } from "../../../context/partners";
import { API_URLS } from "../../../app/api/api";

export default function CustomTable() {
  const {sortConfig, handleSortToggle} = useTableContext();
  const { partnerLoaderConfigList, setActiveConfig, activeConfig, activePartnerId } = usePartnerContext();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Use only real data from context
  const allTableData = partnerLoaderConfigList;
  
  // Calculate pagination
  const totalItems = allTableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const tableData = allTableData.slice(startIndex, endIndex);
  
  const handleRowClick = (config: any) => {
    setActiveConfig(config);
    console.log("Active config set:", config);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [partnerLoaderConfigList.length]);

  const handleFileDownload = async (config: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row selection when clicking download
    
    try {
      // Use activePartnerId from context
      if (!activePartnerId) {
        alert('Please select a partner first');
        return;
      }
      
      await API_URLS.downloadTemplate(config.configId, activePartnerId);
      
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please check your connection and try again.');
    }
  }
  
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table fixedLayout withTableBorder highlightOnHover className="min-w-full w-full">
          <Table.Head>
            <Table.Row className="">
              <Table.Th className="bg-gray-300 min-w-[120px]">
                <div className="flex items-center gap-[8px]  !font-bold">
                  Date
                  <IconButton
                    color="gray"
                    size="xs"
                    variant="tertiary"
                    onClick={() => handleSortToggle("localDateTime")}
                  >
                    {sortConfig.localDateTime === "ascending" ? (
                      <ArrowUp />
                    ) : sortConfig.localDateTime === "descending" ? (
                      <ArrowDown />
                    ) : (
                      <ArrowsDownUp />
                    )}
                  </IconButton>
                </div>
              </Table.Th>
            <Table.Th className="bg-gray-300 min-w-[140px]">
              <div className="flex items-center gap-[8px]  !font-bold">
                Loader ID
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("configId")}
                >
                  {sortConfig.configId === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.configId === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300 min-w-[180px]">
              <div className="flex items-center gap-[8px]  !font-bold">
                Template Name
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("configName")}
                >
                  {sortConfig.configName === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.configName === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>
            <Table.Th className="bg-gray-300 min-w-[140px]">
              <div className="flex items-center gap-[8px]  !font-bold">
                Loader Type
                <IconButton 
                  color="gray" 
                  size="xs" 
                  variant="tertiary"
                  onClick={() => handleSortToggle("loaderType")}
                >
                  {sortConfig.loaderType === "ascending" ? (
                    <ArrowUp />
                  ) : sortConfig.loaderType === "descending" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowsDownUp />
                  )}
                </IconButton>
              </div>
            </Table.Th>

            <Table.Th className="bg-gray-300 min-w-[140px]">
              <div className="flex items-center gap-[8px]  !font-bold">
                Uploaded By
              </div>
            </Table.Th>

            <Table.Th className="bg-gray-300 min-w-[120px]">
              <div className="flex items-center gap-[8px]  !font-bold">
               Action
              </div>
            </Table.Th>

          </Table.Row>
        </Table.Head>
        <Table.Body> 

          {tableData.map((row, index) => {
            const isActive = activeConfig && activeConfig.configId === row.configId;
            return (
              <Table.Row 
                key={row.id || index}
                onClick={() => handleRowClick(row)}
                className={`cursor-pointer hover:bg-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <Table.Cell className="whitespace-nowrap px-3 py-2 text-sm">
                  {new Date(row.localDateTime).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap px-3 py-2 text-sm">
                  {row.configId}
                </Table.Cell>
                <Table.Cell className="px-3 py-2 text-sm max-w-[200px] truncate">
                  <div className="truncate" title={row.configName}>
                    {row.configName}
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap px-3 py-2 text-sm">
                  {row.loaderType}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                  -
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap px-3 py-2 text-sm">
                  <button 
                    onClick={(event) => handleFileDownload(row, event)} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                  >
                    Download
                  </button>
                </Table.Cell>
              </Table.Row>
            );
          })}

        </Table.Body>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Page info */}
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            {/* First page button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              <CaretDoubleLeft size={16} />
            </button>

            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <CaretLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show current page, first, last, and pages around current
              const showPage = 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 2 && page <= currentPage + 2);
              
              if (!showPage && page === currentPage - 3) {
                return <span key={page} className="px-2 text-gray-500">...</span>;
              }
              if (!showPage && page === currentPage + 3) {
                return <span key={page} className="px-2 text-gray-500">...</span>;
              }
              if (!showPage) return null;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next page button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <CaretRight size={16} />
            </button>

            {/* Last page button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              <CaretDoubleRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
