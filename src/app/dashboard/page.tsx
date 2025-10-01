"use client";

import { Button, Select, Upload, Text } from "@hdfclife-insurance/one-x-ui";
import React from "react";
import CustomTable from "./components/Table";
import data from "./components/table-data.json";
import Link from "next/link";

export default function Dashboard() {
  const partnerData = data.partnerItems;
  
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[24px] border border-gray-300 rounded-[8px] p-4 bg-white">
        <form className="space-y-1">
          <div className="grid lg:grid-cols-4 gap-4 items-end">
            <Select
              valuePlaceholder="Partner"
              
              items={[...partnerData]}
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

      <CustomTable />
    </div>
  );
}
