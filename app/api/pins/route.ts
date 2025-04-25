// app/api/pins/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, userEmail, lat, lon, conversationId } = body;

    if (!name || !address || !userEmail || !lat || !lon || !conversationId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log('Received body:', body);
    //try
    // Check if the user exists
    const pinned = await prisma.pinnedLocation.create({
      data: {
        name,
        address,
        userEmail,
        lat,
        lon,
        conversationId
      },
    });
    console.log('Pinned location created:', pinned);



    return NextResponse.json({ success: true, pinned }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating pinned location:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
  }

  try {
    const pins = await prisma.pinnedLocation.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pins }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pins:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Delete from DB using Prisma
    await prisma.pinnedLocation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pinned location:", error);
    return NextResponse.json(
      { success: false, error: "Could not delete pinned location." },
      { status: 500 }
    );
  }
}
