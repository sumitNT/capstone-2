import {
  Select,
  Text,
  Upload,
} from "@hdfclife-insurance/one-x-ui";
import React from "react";
import { usePartnerContext } from "../../../context/partners";

export default function CustomDrawer() {
    const { partnerList, fetchPartners, partnerLoaderConfigList, fetchPartnerLoaderConfig, activePartnerId } = usePartnerContext();
  
  return (
    <div className="w-full h-full p-4">
      <Text
        fontWeight="semibold"
        className="text-accent-secondary"
        size="lg"
      >
        Upload
      </Text>


      <div className="mt-6 space-y-6">
        <div className="relative">
          <Select 
            valuePlaceholder="New Business"
            items={[
              "Aadhar Card",
              "PAN Card", 
              "Voter ID",
              "Passport",
              "Driving License",
            ]}
          />
        </div>
        
        <div className="relative">
          <Select
            valuePlaceholder="Partner"
            onClick={fetchPartners}
            items={partnerList.map((p) => ({
              value: p.id,
              label: p.name,
              onClick: () => fetchPartnerLoaderConfig(p),
            }))}
          />
        </div>

        <div className="relative">
          <Select
            valuePlaceholder="Loader Type"
            items={["a", "b", "c"]}
          />
        </div>

        <Upload variant="extended" buttonLabel="Browse" />
      </div>
    </div>
  );
}
