import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = `${process.env.API_BASE_URL || "http://localhost:8765"}/partnerservice/api`;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const partnerData = await request.json();
    
    console.log('API Route: Updating partner with ID:', id, 'data:', partnerData);
    
    // Validate that only allowed fields are being updated
    const allowedFields = ['email', 'mobile', 'contactNumber'];
    const updateData: any = {};
    
    allowedFields.forEach(field => {
      if (partnerData[field] !== undefined) {
        updateData[field] = partnerData[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update. Only email, mobile, and contactNumber are allowed.' },
        { status: 400 }
      );
    }

    console.log('API Route: Filtered update data:', updateData);

    // Send to backend API - Note: Using PATCH method for partial update
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Route: Partner update failed:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to update partner' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('API Route: Partner updated successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully',
      data: result
    });
    
  } catch (error) {
    console.error('API Route - Partner update error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update partner',
        message: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}
