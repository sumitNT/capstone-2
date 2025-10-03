import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8765/partnerservice/api";

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Getting partner list...');
    
    const response = await fetch(`${API_BASE_URL}/partners/name`, {
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
    console.log('API Route: Partners fetched successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route - Proxy error:', error);
    
    // Return mock data if backend is unreachable
    const mockData = {
      partners: [
        { id: "1", name: "Partner 1" },
        { id: "2", name: "Partner 2" },
        { id: "3", name: "Partner 3" }
      ]
    };
    
    console.log('API Route: Returning mock data due to backend error');
    return NextResponse.json(mockData);
  }
}
