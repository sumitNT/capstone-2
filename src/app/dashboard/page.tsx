"use client";

import { Button, Select, Upload, Text, IconButton } from "@hdfclife-insurance/one-x-ui";
import React from "react";
import CustomTable from "./components/Table";
import CustomDrawer from "./components/Drawer";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { usePartnerContext } from "../../context/partners";
import { useDrawerContext } from "../../context/drawerContext";
import { useTableContext } from "../../context/tableContext";
import clsx from "clsx";


export default function Dashboard() {
  const { 
    partnerList, 
    fetchPartners, 
    partnerLoaderConfigList, 
    fetchPartnerLoaderConfig, 
    activeConfig, 
    setActiveConfig,
    setActivePartnerId,
    setPartnerList,
    setPartnerLoaderConfigList,
    firstRawLoaderFile,
    setFirstRawLoaderFile,
    rawLoaderFile,
    setRawLoaderFile
  } = usePartnerContext();
  const { isDrawerOpen, handleDrawerToggle } = useDrawerContext();
  const { resetSorting } = useTableContext();


  
  return (
    <div className="flex flex-col gap-[24px] relative">
      {/* Drawer Toggle Button */}
      <div className="flex justify-end  pr-2">
        <IconButton
          variant="tertiary"
          size="sm"
          onClick={() => handleDrawerToggle(!isDrawerOpen)}
          className="text-gray-600 hover:text-gray-800"
          aria-label={isDrawerOpen ? "Close drawer" : "Open drawer"}
        >
          {isDrawerOpen ? <CaretRight /> : <CaretLeft />}
        </IconButton>
      </div>
      
      <div className="flex flex-col gap-[24px] border border-gray-300 rounded-[8px] p-4 bg-white">
        <form className="space-y-1">
          <div className="grid lg:grid-cols-4 gap-4 items-end">
            <Select
              valuePlaceholder="Partner"
              items={partnerList.map((p) => p.name)}
              onClick={fetchPartners} // you can comment-out
              onChange={(event) => {
                const target = event.target as HTMLSelectElement;
                const selectedValue = target.value;
                const partner = partnerList.find(p => p.name === selectedValue);
                if (partner) {
                  console.log("Partner selected:", partner);
                  fetchPartnerLoaderConfig(partner);
                }
              }}
              name="partner"
            />
            <Select
              valuePlaceholder="MFI | SG"
              items={["All policies"]}
              name="policies"
            />
            <Button 
              data-color="secondary" 
              variant="tertiary" 
              type="button"
              onClick={() => {
                // Reset everything to initial state
                setFirstRawLoaderFile(null);
                setRawLoaderFile(null);
                setActiveConfig(null);
                setActivePartnerId(null);
                setPartnerList([]);
                setPartnerLoaderConfigList([]);
                resetSorting(); // Reset table sorting
                handleDrawerToggle(false); // Close drawer on reset
                console.log("Complete form reset - cleared both files, active config, partner ID, partner list, loader config list, table sorting, and closed drawer");
              }}
            >
              Reset
            </Button>
          </div>
        </form>
        <div className="flex flex-col gap-2">
          <Upload 
            key={firstRawLoaderFile ? firstRawLoaderFile.name : 'firstrawloader-reset'}
            size="lg" 
            variant="extended" 
            label="firstRawLoader"
            disabled={!!rawLoaderFile}
            // accept=".xlsx,.xls,.csv,.XLTS"
            onFileChange={(details) => {
              console.log("firstRawLoader upload event:", details);
              if (details?.acceptedFiles && details.acceptedFiles.length > 0) {
                // Clear rawLoader file when firstRawLoader is used (mutual exclusivity)
                setRawLoaderFile(null);
                setFirstRawLoaderFile(details.acceptedFiles[0]);
                console.log("firstRawLoader file ready:", details.acceptedFiles[0]);
              } else {
                setFirstRawLoaderFile(null);
                console.log("firstRawLoader file not uploaded");
              }
            }}
          />
          {firstRawLoaderFile && (
            <div className="text-sm text-green-600 font-medium">
              ✓ firstRawLoader ready: {firstRawLoaderFile.name}
            </div>
          )}
          
        </div>
      </div>

      {activeConfig && (
        <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Loader ID:</span>
              <span className="ml-2 text-blue-700">{activeConfig.configId}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Template:</span>
              <span className="ml-2 text-blue-700">{activeConfig.configName}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Type:</span>
              <span className="ml-2 text-blue-700">{activeConfig.loaderType}</span>
            </div>
          </div>
        </div>
      )}

      <CustomTable />
      
      {/* Right Drawer - Only render when open */}
      {isDrawerOpen && (
        <aside
          className={clsx(
            "fixed right-10 top-0 bottom-0 pt-[var(--header-height)] z-[2]",
            "bg-white border-l border-gray-200 shadow-lg",
            "transition-all duration-300 w-[300px]",
            "animate-in slide-in-from-right"
          )}
        >
          <div className="h-full w-full overflow-y-auto p-4">
            <CustomDrawer />
          </div>
        </aside>
      )}



    </div>
  );
}
