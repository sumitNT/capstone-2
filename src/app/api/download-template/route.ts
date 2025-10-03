import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8765/partnerservice/api";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');
    const partnerId = searchParams.get('partnerId');

    if (!configId || !partnerId) {
      return NextResponse.json(
        { error: 'configId and partnerId are required' },
        { status: 400 }
      );
    }

    console.log('API Route: Downloading template for configId:', configId, 'partnerId:', partnerId);
    
    // Build the backend URL for downloading the template
    const backendUrl = `${API_BASE_URL}/partners/download-template?configId=${configId}&partnerId=${partnerId}`;
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout for file downloads
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the file blob from the response
    const fileBlob = await response.blob();
    
    // Get filename from Content-Disposition header or use a default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `template_${configId}.xlsx`; // default filename
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Create response with the file
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    return new NextResponse(fileBlob, { headers });
    
  } catch (error) {
    console.error('API Route - Download error:', error);
    
    // Return a mock Excel file or error response
    return NextResponse.json(
      { 
        error: 'Failed to download template',
        message: 'Backend service unavailable. Please try again later.',
        configId: request.nextUrl.searchParams.get('configId')
      },
      { status: 500 }
    );
  }
}
