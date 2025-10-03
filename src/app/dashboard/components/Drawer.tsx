import { Select, Text, Upload } from "@hdfclife-insurance/one-x-ui";
import React from "react";
import { usePartnerContext } from "../../../context/partners";

export default function CustomDrawer() {
  const {
    partnerList,
    fetchPartners,
    partnerLoaderConfigList,
    fetchPartnerLoaderConfig,
    activePartnerId,
    rawLoaderFile,
    setRawLoaderFile,
    firstRawLoaderFile,
    setFirstRawLoaderFile
  } = usePartnerContext();

  return (
    <div className="w-full h-full p-4">
      <Text fontWeight="semibold" className="text-accent-secondary" size="lg">
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
            items={partnerList.map((p) => p.name)}
            disabled={!!firstRawLoaderFile}
            onChange={(event) => {
              const target = event.target as HTMLSelectElement;
              const selectedValue = target.value;
              const partner = partnerList.find((p) => p.name === selectedValue);
              if (partner) {
                console.log("Partner selected:", partner);
                fetchPartnerLoaderConfig(partner);
              }
            }}
            name="partner"
          />
        </div>

        <div className="relative">
          <Select valuePlaceholder="Loader Type" items={["a", "b", "c"]} />
        </div>

        <div>

        
        <Upload 
          key={rawLoaderFile ? rawLoaderFile.name : 'empty-rawloader'}
          variant="extended" 
          label="RawLoader"
          disabled={!!firstRawLoaderFile}
          // accept=".xlsx,.xls,.csv"
          onFileChange={(details) => {
              console.log("rawLoader upload event:", details);
              if (details?.acceptedFiles && details.acceptedFiles.length > 0) {
                // Clear firstRawLoader file when rawLoader is used (mutual exclusivity)
                setFirstRawLoaderFile(null);
                setRawLoaderFile(details.acceptedFiles[0]);
                console.log("rawLoader file ready:", details.acceptedFiles[0]);
              } else {
                setRawLoaderFile(null);
                console.log("rawLoader file not uploaded");
              }
            }}
        />
          {rawLoaderFile && (
            <div className="text-sm text-green-600 font-medium">
              ✓ rawLoader ready: {rawLoaderFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
