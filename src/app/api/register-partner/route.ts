import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = `${process.env.API_BASE_URL || "http://localhost:8765"}/partnerservice/api`;

export async function POST(request: NextRequest) {
  try {
    const partnerData = await request.json();
    
    console.log('API Route: Registering partner with data:', partnerData);
    
    // Prepare payload for backend
    const payload = {
      partnerName: partnerData.partnerName,
      type: partnerData.type.toUpperCase(),
      email: partnerData.email,
      mobile: partnerData.mobile,
      contactNumber: partnerData.contactNumber,
      pan: partnerData.pan,
      gst: partnerData.gst,
      dateOfAgreement: partnerData.dateOfAgreement,
      address: partnerData.address
    };

    // Send to backend API
    const response = await fetch(`${API_BASE_URL}/partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Route: Partner registration failed:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to register partner' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('API Route: Partner registered successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Partner registered successfully',
      data: result
    });
    
  } catch (error) {
    console.error('API Route - Partner registration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to register partner',
        message: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}
