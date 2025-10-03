"use client";

import { 
  Button, 
  Text
} from "@hdfclife-insurance/one-x-ui";
import { useState } from "react";

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

export default function RegisterPartner() {
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

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PartnerFormData> = {};

    if (!formData.partnerName.trim()) {
      newErrors.partnerName = "Partner name is required";
    }

    if (!formData.type) {
      newErrors.type = "Partner type is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10,12}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    if (!formData.pan.trim()) {
      newErrors.pan = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Please enter a valid PAN number";
    }

    if (!formData.gst.trim()) {
      newErrors.gst = "GST number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
      newErrors.gst = "Please enter a valid GST number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.dateOfAgreement) {
      newErrors.dateOfAgreement = "Date of agreement is required";
    } else if (new Date(formData.dateOfAgreement) > new Date()) {
      newErrors.dateOfAgreement = "Date of agreement cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Send raw form data to backend API (backend handles hashing)
        const payload = {
          partnerName: formData.partnerName,
          type: formData.type.toUpperCase(),
          email: formData.email,
          mobile: formData.mobile,
          contactNumber: formData.contactNumber,
          pan: formData.pan,
          gst: formData.gst,
          dateOfAgreement: formData.dateOfAgreement,
          address: formData.address
        };

        // Send data to backend API
        const response = await fetch('http://localhost:8080/api/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
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
          
          alert("Partner registered successfully!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Failed to register partner'}`);
        }
      } catch (error) {
        console.error('Error registering partner:', error);
        alert('Failed to register partner. Please try again.');
      }
    }
  };

  const inputClassName = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins";
  const labelClassName = "block text-base font-medium text-gray-800 mb-3 font-poppins";
  const selectClassName = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-poppins";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
              Partner Registration
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Partner Name */}
        <div>
          <label className={labelClassName}>
            Partner Name
          </label>
          <input
            type="text"
            value={formData.partnerName}
            onChange={(e) => handleInputChange("partnerName", e.target.value)}
            placeholder="Enter partner name"
            className={inputClassName}
          />
          {errors.partnerName && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.partnerName}
            </Text>
          )}
        </div>

        {/* Partner Type */}
        <div>
          <label className={labelClassName}>
            Partner Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className={selectClassName}
          >
            <option value="">Select partner type</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="CORPORATE">Corporate</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="TRUST">Trust</option>
            <option value="SOCIETY">Society</option>
          </select>
          {errors.type && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.type}
            </Text>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className={labelClassName}>
            Mobile Number
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            placeholder="Enter mobile number"
            className={inputClassName}
            maxLength={10}
          />
          {errors.mobile && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.mobile}
            </Text>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClassName}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            className={inputClassName}
          />
          {errors.email && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.email}
            </Text>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className={labelClassName}>
            Contact Number
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            placeholder="Enter contact number"
            className={inputClassName}
            maxLength={10}
          />
          {errors.contactNumber && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.contactNumber}
            </Text>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <label className={labelClassName}>
            PAN Number *
          </label>
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
            placeholder="Enter PAN number"
            className={inputClassName}
            maxLength={10}
          />
          {errors.pan && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.pan}
            </Text>
          )}
        </div>

        {/* GST Number */}
        <div>
          <label className={labelClassName}>
            GST Number *
          </label>
          <input
            type="text"
            value={formData.gst}
            onChange={(e) => handleInputChange("gst", e.target.value.toUpperCase())}
            placeholder="Enter GST number"
            className={inputClassName}
            maxLength={15}
          />
          {errors.gst && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.gst}
            </Text>
          )}
        </div>

        {/* Address */}
        <div>
          <label className={labelClassName}>
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter address"
            className={`${inputClassName} min-h-[120px] resize-vertical`}
            rows={5}
          />
          {errors.address && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.address}
            </Text>
          )}
        </div>

        {/* Date of Agreement */}
        <div>
          <label className={labelClassName}>
            Date of Agreement
          </label>
          <input
            type="date"
            value={formData.dateOfAgreement}
            onChange={(e) => handleInputChange("dateOfAgreement", e.target.value)}
            className={inputClassName}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOfAgreement && (
            <Text size="sm" className="text-red-600 mt-2">
              {errors.dateOfAgreement}
            </Text>
          )}
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Date cannot be in the future
          </p>
        </div>

        {/* Submit Button */}
                <div className="flex flex-col space-y-8">
          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              color="primary"
              size="lg"
              onClick={handleSubmit}
              className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-10 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
            >
              Register Partner
            </Button>
          </div>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
}
