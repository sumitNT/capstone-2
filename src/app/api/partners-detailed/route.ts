import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = `${process.env.API_BASE_URL || "http://localhost:8765"}/partnerservice/api`;

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Getting detailed partner list...');
    
    const response = await fetch(`${API_BASE_URL}/all/partners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Route: Detailed partners fetched successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route - Proxy error:', error);
    
    // Return mock data if backend is unreachable
    const mockData = [
      {
        id: 1,
        partnerName: "Axis Corp",
        type: "CORPORATE",
        email: "soham34@acme.com",
        mobile: "9872543210",
        contactNumber: "0221284567",
        pan: "ABCDE8534F",
        gst: "27ABCDA1234F3Z5",
        dateOfAgreement: "2025-09-29",
        address: "Bandra",
        createdAt: "2025-10-01T13:30:14.364911",
        updatedAt: "2025-10-01T13:30:14.364939"
      },
      {
        id: 2,
        partnerName: "HDFC Corp",
        type: "CORPORATE",
        email: "hdfc4@acme.com",
        mobile: "9873543210",
        contactNumber: "0221283567",
        pan: "ABCDE2534F",
        gst: "27ABCDA1224F3Z5",
        dateOfAgreement: "2025-09-19",
        address: "Bandra",
        createdAt: "2025-10-01T13:30:47.232159",
        updatedAt: "2025-10-01T13:30:47.232248"
      }
    ];
    
    console.log('API Route: Returning mock data due to backend error');
    return NextResponse.json(mockData);
  }
}
