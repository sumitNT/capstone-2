"use client";

import { 
  Button, 
  Text
} from "@hdfclife-insurance/one-x-ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URLS } from "../../../../../api/api";

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

interface EditPartnerProps {
  params: {
    id: string;
  };
}

export default function EditPartner({ params }: EditPartnerProps) {
  const router = useRouter();
  const { id } = params;

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
  const [loading, setLoading] = useState(true);

  // Load partner data from API
  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        // Fetch detailed partners and find the specific partner by id
        const response = await fetch('/api/partners-detailed');
        if (response.ok) {
          const partners = await response.json();
          const partner = partners.find((p: any) => p.id.toString() === id);
          
          if (partner) {
            setFormData({
              partnerName: partner.partnerName,
              type: partner.type,
              email: partner.email,
              mobile: partner.mobile,
              contactNumber: partner.contactNumber,
              pan: partner.pan,
              gst: partner.gst,
              dateOfAgreement: partner.dateOfAgreement,
              address: partner.address,
            });
          } else {
            console.error('Partner not found');
            alert('Partner not found');
          }
        } else {
          throw new Error('Failed to fetch partner data');
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
        alert('Failed to load partner data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [id]);

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

    // Only validate editable fields: email, mobile, contactNumber
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Only send editable fields: email, mobile, contactNumber
        const updateData = {
          email: formData.email,
          mobile: formData.mobile,
          contactNumber: formData.contactNumber,
        };

        await API_URLS.updatePartner(id, updateData);
        
        alert("Partner updated successfully!");
        router.push("/dashboard/new-business/view-partner");
        
      } catch (error) {
        console.error('Error updating partner:', error);
        alert(`Failed to update partner: ${error instanceof Error ? error.message : 'Please try again.'}`);
      }
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/new-business/view-partner");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Text>Loading partner data...</Text>
      </div>
    );
  }

  const inputClassName = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-poppins";
  const labelClassName = "block text-base font-medium text-gray-800 mb-3 font-poppins";
  const selectClassName = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-poppins";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
              Edit Partner
            </h1>
            <p className="text-lg text-gray-600 font-poppins">
              Update partner information below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Partner Name - Not Editable */}
        <div>
          <label className={labelClassName}>
            Partner Name (Not Editable)
          </label>
          <input
            type="text"
            value={formData.partnerName}
            className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Partner name cannot be modified after registration
          </p>
        </div>

        {/* Partner Type - Not Editable */}
        <div>
          <label className={labelClassName}>
            Partner Type (Not Editable)
          </label>
          <input
            type="text"
            value={formData.type}
            className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Partner type cannot be modified after registration
          </p>
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

        {/* PAN Number - Disabled as it shouldn't be editable */}
        <div>
          <label className={labelClassName}>
            PAN Number (Not Editable)
          </label>
          <input
            type="text"
            value={formData.pan}
            className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            PAN number cannot be modified after registration
          </p>
        </div>

        {/* GST Number - Disabled as it shouldn't be editable */}
        <div>
          <label className={labelClassName}>
            GST Number (Not Editable)
          </label>
          <input
            type="text"
            value={formData.gst}
            className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            GST number cannot be modified after registration
          </p>
        </div>

        {/* Address - Not Editable */}
        <div>
          <label className={labelClassName}>
            Address (Not Editable)
          </label>
          <textarea
            value={formData.address}
            className={`${inputClassName} min-h-[120px] resize-vertical bg-gray-100 cursor-not-allowed`}
            rows={5}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Address cannot be modified after registration
          </p>
        </div>

        {/* Date of Agreement - Not Editable */}
        <div>
          <label className={labelClassName}>
            Date of Agreement (Not Editable)
          </label>
          <input
            type="date"
            value={formData.dateOfAgreement}
            className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Date of agreement cannot be modified after registration
          </p>
        </div>

        {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                color="gray"
                size="lg"
                onClick={handleCancel}
                className="min-w-[120px] px-8 py-3 font-poppins font-semibold rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                color="primary"
                size="lg"
                className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-10 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
              >
                Update Partner
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
