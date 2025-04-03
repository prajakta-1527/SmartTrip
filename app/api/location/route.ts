import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import prisma from '@/app/libs/prismadb';

export async function getUserImageByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email:email as string},
      select: { image: true },
    });

    console.log("Db user",user)

    if (!user || !user.image) {
      console.log("User not found or image not set.");
      return null;
    }

    return user.image;
  } catch (error) {
    console.error("Error fetching user image:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
    const { userId, location } = body;
    let image = null
    if (userId!==null){
    image = await getUserImageByEmail(userId);
    console.log("User image:", image);
    }
    
    // if (!userId || !location) {
    //   return NextResponse.json({ message: "Missing userId or location" }, { status: 400 });
    // }
    // location.set('image', image);
    location['image']=image;
    // Uncomment this when you want to trigger the location update
    await pusherServer.trigger("location", "update", { userId, location });

    // console.log("Location update received:", userId, location);
    return NextResponse.json({ message: "Location broadcasted successfully" });
  } catch (error) {
    console.error("Error broadcasting location:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
