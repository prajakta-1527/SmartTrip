import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pinId, voteType, userEmail } = body;

    if (!pinId || !voteType || !userEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pin = await prisma.pinnedLocation.findUnique({
      where: { id: pinId },
    });
    console.log("Pin found:", pin);
    if (!pin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 });
    }

    let updateData: any = {};

    if (voteType === "upvote") {
      if (pin.upvotedBy?.includes(userEmail)) {
        return NextResponse.json({ error: "Already upvoted" }, { status: 400 });
      }

      updateData = {
        upvotes: pin.upvotes + 1,
        upvotedBy: [...pin.upvotedBy, userEmail],
        downvotedBy: pin.downvotedBy.filter((email) => email !== userEmail),
        downvotes: pin.downvotedBy.includes(userEmail) ? pin.downvotes - 1 : pin.downvotes,
      };
    } else if (voteType === "downvote") {
      if (pin.downvotedBy.includes(userEmail)) {
        return NextResponse.json({ error: "Already downvoted" }, { status: 400 });
      }

      updateData = {
        downvotes: pin.downvotes + 1,
        downvotedBy: [...pin.downvotedBy, userEmail],
        upvotedBy: pin.upvotedBy.filter((email) => email !== userEmail),
        upvotes: pin.upvotedBy.includes(userEmail) ? pin.upvotes - 1 : pin.upvotes,
      };
    }

    const updatedPin = await prisma.pinnedLocation.update({
      where: { id: pinId },
      data: updateData,
    });

    console.log("Pin updated:", updatedPin);
    return NextResponse.json({ updatedPin }, { status: 200 });

  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
