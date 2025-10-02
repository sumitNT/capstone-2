"use client";

import { Button, Select, Upload, Text } from "@hdfclife-insurance/one-x-ui";
import React from "react";
import CustomTable from "./components/Table";

// import data from "./components/table-data.json" 
import { usePartnerContext } from "../../context/partners";


export default function Dashboard() {
  const { partnerList, fetchPartners, partnerLoaderConfigList, fetchPartnerLoaderConfig, activeConfig } = usePartnerContext();
  
  return (
    <div className="flex flex-col gap-[24px]">
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
    </div>
  );
}
