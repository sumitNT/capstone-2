"use client";

import { 
  Text,
  Table,
  Button
} from "@hdfclife-insurance/one-x-ui";
import { useState } from "react";
import Link from "next/link";

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

export default function ViewPartner() {
  // Sample data - in a real app, this would come from an API
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
              Partner List
            </h1>
            <p className="text-lg text-gray-600 font-poppins">
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
              <Table.Th className="font-semibold text-gray-700 px-4 py-3 text-left font-poppins min-w-[80px]">
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
                  <Link 
                    href={`/dashboard/new-business/view-partner/edit/${partner.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium font-poppins leading-5 hover:underline"
                  >
                    Edit
                  </Link>
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
            <Link href="/dashboard/new-business/register-partner">
              <Button variant="primary" color="primary" size="sm" className="font-poppins">
                Register First Partner
              </Button>
            </Link>
          </div>
        )}
          </div>

          {/* Add Partner Button */}
          {partners.length > 0 && (
            <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
              <Link href="/dashboard/new-business/register-partner">
                <Button 
                  variant="primary" 
                  color="primary" 
                  size="lg"
                  className="min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white font-poppins font-semibold py-3 px-10 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
                >
                  + Add New Partner
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
