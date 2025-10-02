"use client";

import { Button, Select, Upload, Text, Table } from "@hdfclife-insurance/one-x-ui";
import React, { useState, useEffect } from "react";
import CustomTable from "./components/Table";
import { API_URLS } from "../api/api";

// import data from "./components/table-data.json" 
import { usePartnerContext } from "../../context/partners";

// Hashing function for sensitive data
const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

interface PartnerFormData {
  partnerName: string;
  type: string;
  email: string;
  mobile: string;
  contactNumber: string;
  pan: string;
  gst: string;
  dateOfAgreement: string;
  address: string;
}

interface Partner {
  id: string;
  partnerName: string;
  type: string;
  email: string;
  mobile: string;
  contactNumber: string;
  dateOfAgreement: string;
  pan: string;
  gst: string;
}

export default function Dashboard() {
  const { partnerList, fetchPartners, partnerLoaderConfigList, fetchPartnerLoaderConfig, activeConfig } = usePartnerContext();
  const [activeView, setActiveView] = useState<'dashboard' | 'register' | 'view' | 'edit'>('dashboard');
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  
  // Register Partner Form State
  const [formData, setFormData] = useState<PartnerFormData>({
    partnerName: "",
    type: "",
    email: "",
    mobile: "",
    contactNumber: "",
    pan: "",
    gst: "",
    dateOfAgreement: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<PartnerFormData>>({});

  // View Partner Data (sample data - in real app would come from API)
  const [partners] = useState<Partner[]>([
    {
      id: "1",
      partnerName: "John Smith",
      type: "INDIVIDUAL",
      email: "john.smith@example.com",
      mobile: "9876543210",
      contactNumber: "0221234567",
      dateOfAgreement: "2024-04-10",
      pan: "ABCDE1234F",
      gst: "22AAAAA0000A1Z5",
    },
    {
      id: "2",
      partnerName: "Acme Corporation",
      type: "CORPORATE",
      email: "contact@acme.example.com",
      mobile: "9986776655",
      contactNumber: "0224567890",
      dateOfAgreement: "2024-04-08",
      pan: "FGHIJ5678K",
      gst: "27AAAAA0000A1Z6",
    },
    {
      id: "3",
      partnerName: "Jane Doe",
      type: "INDIVIDUAL",
      email: "jane.doe@example.com",
      mobile: "9123456789",
      contactNumber: "0221098765",
      dateOfAgreement: "2024-04-05",
      pan: "KLMNO9012P",
      gst: "29AAAAA0000A1Z7",
    },
    {
      id: "4",
      partnerName: "Global Industries",
      type: "CORPORATE",
      email: "info@global.example.com",
      mobile: "9234557890",
      contactNumber: "0223456789",
      dateOfAgreement: "2024-04-02",
      pan: "QRSTU3456V",
      gst: "24AAAAA0000A1Z8",
    },
  ]);

  // Listen for hash changes from sidebar navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#register-partner') {
        setActiveView('register');
        setEditingPartner(null); // Clear editing state
      } else if (hash === '#view-partner') {
        setActiveView('view');
        setEditingPartner(null); // Clear editing state
      } else if (hash.startsWith('#edit-partner')) {
        const partnerId = hash.split('/')[1]; // Get ID from hash like #edit-partner/1
        const partner = partners.find(p => p.id === partnerId);
        if (partner) {
          setEditingPartner(partner);
          setFormData({
            partnerName: partner.partnerName,
            type: partner.type,
            email: partner.email,
            mobile: partner.mobile,
            contactNumber: partner.contactNumber,
            pan: partner.pan,
            gst: partner.gst,
            dateOfAgreement: partner.dateOfAgreement,
            address: '' // Address not in partner data, so keep empty
          });
          setActiveView('edit');
        }
      } else if (hash === '#dashboard' || hash === '') {
        setActiveView('dashboard');
        setEditingPartner(null); // Clear editing state
      }
    };

    // Check initial hash on load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Form handlers for Register Partner
  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PartnerFormData> = {};

    if (!formData.partnerName.trim()) newErrors.partnerName = "Partner name is required";
    if (!formData.type) newErrors.type = "Partner type is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.pan.trim()) newErrors.pan = "PAN is required";
    if (!formData.gst.trim()) newErrors.gst = "GST number is required";
    if (!formData.dateOfAgreement) newErrors.dateOfAgreement = "Date of agreement is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile number validation
    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // PAN validation
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Please enter a valid PAN (e.g., ABCDE1234F)";
    }

    // GST validation
    if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
      newErrors.gst = "Please enter a valid GST number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Hash sensitive data
      const hashedPayload = {
        partnerName: formData.partnerName,
        type: formData.type,
        email: await hashData(formData.email),
        mobile: await hashData(formData.mobile),
        contactNumber: await hashData(formData.contactNumber),
        pan: await hashData(formData.pan),
        gst: await hashData(formData.gst),
        dateOfAgreement: formData.dateOfAgreement,
        address: await hashData(formData.address)
      };

      // Send data to backend API (simulated for now since backend is not running)
      console.log('Partner registration data:', hashedPayload);
      
      // Simulate successful API response
      const success = true; // In real app: const response = await API_URLS.registerPartner(hashedPayload);

      if (success) {
        // Reset form after successful submission
        setFormData({
          partnerName: "",
          type: "",
          email: "",
          mobile: "",
          contactNumber: "",
          pan: "",
          gst: "",
          dateOfAgreement: "",
          address: "",
        });
        
        if (activeView === 'edit') {
          alert("Partner updated successfully!");
        } else {
          alert("Partner registered successfully!");
        }
        window.location.hash = '#view-partner'; // Switch to view tab to see the partner
      } else {
        // Handle API error (when real backend is implemented)
        alert('Failed to register partner. Please try again.');
      }
    } catch (error) {
      console.error('Error registering partner:', error);
      alert('Failed to register partner. Please try again.');
    }
  };

  // Handle direct button clicks for switching views
  const handleSwitchToRegister = () => {
    window.location.hash = '#register-partner';
  };

  const handleSwitchToView = () => {
    window.location.hash = '#view-partner';
  };
  
  return (
    <div className="flex flex-col gap-[24px]">
      {/* Default Dashboard Content */}
      {activeView === 'dashboard' && (
        <>
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
        </>
      )}

      {/* Register Partner Content */}
      {activeView === 'register' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
              Register New Partner
            </h2>
            <p className="text-gray-600 font-poppins">
              Add a new partner to the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Partner Name */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Partner Name *
                </label>
                <input
                  type="text"
                  value={formData.partnerName}
                  onChange={(e) => handleInputChange('partnerName', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter partner name"
                />
                {errors.partnerName && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.partnerName}</p>}
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Partner Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-poppins"
                >
                  <option value="">Select partner type</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.type}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.mobile}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter contact number"
                />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.contactNumber}</p>}
              </div>

              {/* PAN */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  PAN Number *
                </label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="e.g., ABCDE1234F"
                  maxLength={10}
                />
                {errors.pan && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.pan}</p>}
              </div>

              {/* GST */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={formData.gst}
                  onChange={(e) => handleInputChange('gst', e.target.value.toUpperCase())}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="e.g., 22AAAAA0000A1Z5"
                  maxLength={15}
                />
                {errors.gst && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.gst}</p>}
              </div>

              {/* Date of Agreement */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Date of Agreement *
                </label>
                <input
                  type="date"
                  value={formData.dateOfAgreement}
                  onChange={(e) => handleInputChange('dateOfAgreement', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                />
                {errors.dateOfAgreement && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.dateOfAgreement}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter complete address"
                  rows={4}
                />
                {errors.address && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.address}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit"
                variant="primary" 
                color="primary" 
                size="lg"
                className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-8 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
              >
                Register Partner
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* View Partners Content */}
      {activeView === 'view' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
              Partner List
            </h2>
            <p className="text-gray-600 font-poppins">
              View and manage all registered partners
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
            <Table withTableBorder highlightOnHover className="w-full table-auto">
              <Table.Head>
                <Table.Row className="bg-gray-50">
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[150px]">
                    Partner Name
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[100px]">
                    Type
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[180px]">
                    Email
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[120px]">
                    Mobile
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[130px]">
                    Contact Number
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[140px]">
                    Date of Agreement
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[120px]">
                    PAN
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[150px]">
                    GST
                  </Table.Th>
                  <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[100px]">
                    Actions
                  </Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {partners.map((partner) => (
                  <Table.Row key={partner.id} className="hover:bg-gray-50">
                    <Table.Cell className="px-4 py-3">
                      <div className="font-poppins text-gray-900 font-medium text-sm leading-5 break-words">
                        {partner.partnerName}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5">
                        {partner.type}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5 break-words">
                        {partner.email}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5">
                        {partner.mobile}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5">
                        {partner.contactNumber}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5">
                        {new Date(partner.dateOfAgreement).toLocaleDateString()}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5 font-mono tracking-wide">
                        {partner.pan}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="text-gray-600 font-poppins text-sm leading-5 font-mono tracking-wide">
                        {partner.gst}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <Button 
                        variant="primary" 
                        color="primary" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={() => {
                          window.location.hash = `#edit-partner/${partner.id}`;
                        }}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {/* Empty state */}
            {partners.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4 font-poppins">
                  No partners registered yet.
                </p>
                <Button 
                  variant="primary" 
                  color="primary" 
                  size="sm" 
                  className="font-poppins"
                  onClick={handleSwitchToRegister}
                >
                  Register First Partner
                </Button>
              </div>
            )}
          </div>

          {/* Add Partner Button */}
          {partners.length > 0 && (
            <div className="flex justify-end border-t border-gray-200 pt-6">
              <Button 
                variant="primary" 
                color="primary" 
                size="lg"
                className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-10 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                onClick={handleSwitchToRegister}
              >
                + Add New Partner
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Partner Content */}
      {activeView === 'edit' && editingPartner && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
              Edit Partner
            </h2>
            <p className="text-gray-600 font-poppins">
              Update partner information for {editingPartner.partnerName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Partner Name */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Partner Name *
                </label>
                <input
                  type="text"
                  value={formData.partnerName}
                  onChange={(e) => handleInputChange('partnerName', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter partner name"
                />
                {errors.partnerName && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.partnerName}</p>}
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Partner Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-poppins"
                >
                  <option value="">Select partner type</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="CORPORATE">Corporate</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.type}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.mobile}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter contact number"
                />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.contactNumber}</p>}
              </div>

              {/* PAN */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  PAN Number *
                </label>
                <input
                  type="text"
                  value={formData.pan}
                  readOnly
                  disabled
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-poppins"
                  placeholder="e.g., ABCDE1234F"
                />
                <p className="text-gray-500 text-sm mt-2 font-poppins">PAN number cannot be changed</p>
              </div>

              {/* GST */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={formData.gst}
                  readOnly
                  disabled
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-poppins"
                  placeholder="e.g., 22AAAAA0000A1Z5"
                />
                <p className="text-gray-500 text-sm mt-2 font-poppins">GST number cannot be changed</p>
              </div>

              {/* Date of Agreement */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Date of Agreement *
                </label>
                <input
                  type="date"
                  value={formData.dateOfAgreement}
                  onChange={(e) => handleInputChange('dateOfAgreement', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                />
                {errors.dateOfAgreement && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.dateOfAgreement}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3 font-poppins">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins"
                  placeholder="Enter complete address"
                  rows={4}
                />
                {errors.address && <p className="text-red-500 text-sm mt-2 font-poppins">{errors.address}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                type="button"
                variant="secondary" 
                color="gray" 
                size="lg"
                className="min-w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-700 font-poppins font-semibold py-3 px-8 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => {
                  window.location.hash = '#view-partner';
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary" 
                color="primary" 
                size="lg"
                className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-8 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
              >
                Update Partner
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
