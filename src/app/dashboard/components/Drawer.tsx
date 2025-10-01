import {
  Select,
  Text,
  Upload,
} from "@hdfclife-insurance/one-x-ui";
import React from "react";

export default function CustomDrawer() {
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
          valuePlaceholder="Loader Type"
            items={[
              "Aadhar Card",
              "PAN Card",
              "Voter ID",
              "Passport", 
              "Driving License",
            ]}
          />
        </div>

        <Upload variant="extended" buttonLabel="Browse" />
      </div>
    </div>
  );
}
