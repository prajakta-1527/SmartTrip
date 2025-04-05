import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string;
}

export async function DELETE(request: Request, props: { params: Promise<IParams> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // find the existing conversation
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    // check existing conversation
    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // delete the conversation
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:delete',
          existingConversation
        );
      }
    });

    // return the deleted conversation
    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION DELETE');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


// const prisma = new PrismaClient();

import { NextRequest } from "next/server";
// import { PrismaClient } from "@prisma/client";
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: "Hurray" }, { status: 200 });
// }

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  console.log("HIII")
  if (!conversationId) {
    return NextResponse.json({ message: "Missing conversation ID" }, { status: 400 });
  }

  try {
    // const conversation = await prisma.conversation.findUnique({
    //   where: { id: conversationId },
    //   // include: { users: { select: { email: true } } }, // Fetch users' emails
    // });
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    console.log("SelectedConv", conversation);
    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 402 });
    }

    // const users = conversation.users.map(user => user.email);
    // console.log("users", users);
    const users = conversation.users.map((user) => ({
      email: user.email,
      avatar: user.image || "/default-avatar.png", // Use default if no avatar
    }));
    return NextResponse.json({"message": "Success", "Conversation": conversation }, { status: 200 });
    // return NextResponse.json({"message": "Success", "users": conversation.users.map(user => user.email) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversation users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}