import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/app/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pinId, voteType, userEmail } = req.body;

  if (!pinId || !voteType || !userEmail)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const pin = await prisma.pinnedLocation.findUnique({ where: { id: pinId } });

    if (!pin) return res.status(404).json({ error: "Pin not found" });

    let updateData: any = {};

    if (voteType === "upvote") {
      if (pin.upvotedBy.includes(userEmail)) {
        return res.status(400).json({ error: "Already upvoted" });
      }

      updateData = {
        upvotes: pin.upvotes + 1,
        upvotedBy: [...pin.upvotedBy, userEmail],
        // Optionally remove from downvotes if previously downvoted
        downvotedBy: pin.downvotedBy.filter((email) => email !== userEmail),
        downvotes: pin.downvotedBy.includes(userEmail) ? pin.downvotes - 1 : pin.downvotes,
      };
    } else if (voteType === "downvote") {
      if (pin.downvotedBy.includes(userEmail)) {
        return res.status(400).json({ error: "Already downvoted" });
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

    res.status(200).json({ updatedPin });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
