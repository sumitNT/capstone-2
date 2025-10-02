"use client";

import { Button, Select, Upload, Text, IconButton } from "@hdfclife-insurance/one-x-ui";
import React from "react";
import CustomTable from "./components/Table";
import CustomDrawer from "./components/Drawer";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// import data from "./components/table-data.json" 
import { usePartnerContext } from "../../context/partners";
import { useDrawerContext } from "../../context/drawerContext";
import clsx from "clsx";


export default function Dashboard() {
  const { partnerList, fetchPartners, partnerLoaderConfigList, fetchPartnerLoaderConfig, activeConfig } = usePartnerContext();
  const { isDrawerOpen, handleDrawerToggle } = useDrawerContext();


  
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
              onClick={fetchPartners}
              items={partnerList.map((p) => ({
                value: p.id,
                label: p.name,
                onClick: () => fetchPartnerLoaderConfig(p),
              }))}
             
              name="partner"
            />
            <Select
              valuePlaceholder="MFI | SG"
              items={["All policies"]}
              name="policies"
            />
            <Button data-color="secondary" variant="tertiary" type="reset">
              Reset
            </Button>
          </div>
        </form>
        <Upload size="lg" variant="extended" />
      </div>

      {activeConfig && (
        <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Loader ID:</span>
              <span className="ml-2 text-blue-700">{activeConfig.loaderId}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Template:</span>
              <span className="ml-2 text-blue-700">{activeConfig.templateName}</span>
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
