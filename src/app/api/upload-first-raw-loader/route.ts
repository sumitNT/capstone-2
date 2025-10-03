import { NextRequest, NextResponse } from 'next/server';

const CONFIG_GENERATION_API_BASE_URL = `${process.env.API_BASE_URL || "http://localhost:8765"}/config-generation-service/config-service/api`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const partnerId = formData.get('partnerId') as string;
    const file = formData.get('file') as File;

    // Validate required fields
    if (!partnerId || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: partnerId or file' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('FirstRawLoader file upload request:', {
      partnerId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Convert File to Buffer for backend transmission
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadResult;
    
    try {
      // Create FormData to send to backend
      const backendFormData = new FormData();
      backendFormData.append('partnerId', partnerId);
      backendFormData.append('file', new Blob([buffer]), file.name);

      // Send to actual backend for firstRawLoader using config-generation-service
      const backendResponse = await fetch(`${CONFIG_GENERATION_API_BASE_URL}/partners/${partnerId}/loader-transformation-configs/upload`, {
        method: 'POST',
        body: backendFormData,
      });
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        // Return the actual backend response
        uploadResult = backendData;
      } else {
        // Handle backend error responses
        try {
          const errorData = await backendResponse.json();
          uploadResult = errorData; // Return the error response from backend
        } catch (parseError) {
          uploadResult = {
            success: false,
            message: `FirstRawLoader upload failed with status ${backendResponse.status}`,
            errorCount: 0,
            successCount: 0
          };
        }
      }
    } catch (backendError) {
      console.error('Backend firstRawLoader upload error:', backendError);
      // Return error response if backend is not available
      uploadResult = {
        success: false,
        message: 'Backend service unavailable. Please try again later.',
        errorCount: 0,
        successCount: 0,
        error: 'Connection failed'
      };
    }

    return NextResponse.json(uploadResult, { status: 200 });

  } catch (error) {
    console.error('FirstRawLoader upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during firstRawLoader file upload' },
      { status: 500 }
    );
  }
}
