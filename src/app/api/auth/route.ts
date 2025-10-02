import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Auth endpoint' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Auth logic here
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
