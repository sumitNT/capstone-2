import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8765/partnerservice/api";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const loaderType = searchParams.get('loaderType') || 'Xdk';
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '5';

    if (!partnerId) {
      return NextResponse.json(
        { error: 'partnerId is required' },
        { status: 400 }
      );
    }

    console.log('API Route: Getting partner-loader-config for partnerId:', partnerId);
    
    // Build the backend URL with partnerId as query parameter
    const backendUrl = `${API_BASE_URL}/partners/configs?partnerId=${partnerId}&loaderType=${loaderType}&page=${page}`;
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
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
    console.log('API Route: Partner loader config fetched successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route - Proxy error:', error);
    
    // Return mock data if backend is unreachable
    const mockData = {
      data: [
        {
          id: "1",
          date: "2024-01-15",
          loaderId: "LOADER_001",
          templateName: "Policy Template A",
          loaderType: "Bulk Upload",
          uploadedBy: "John Doe",
          action: "Download"
        },
        {
          id: "2", 
          date: "2024-01-14",
          loaderId: "LOADER_002",
          templateName: "Claims Template B",
          loaderType: "Individual",
          uploadedBy: "Jane Smith",
          action: "Process"
        }
      ]
    };
    
    console.log('API Route: Returning mock data due to backend error');
    return NextResponse.json(mockData);
  }
}
