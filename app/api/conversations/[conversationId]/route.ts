import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params; // Get conversationId from params
    const currentUser = await getCurrentUser();

    // Check if user is authenticated and conversationId is valid
    if (!currentUser?.id || !conversationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the conversation from the database
    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    // Check if the conversation exists
    if (!existingConversation) {
      return new NextResponse("Invalid conversation ID", { status: 400 });
    }

    // Check if the current user is part of the conversation
    if (!existingConversation.userIds.includes(currentUser.id)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the conversation
    const deleteConversation = await db.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    existingConversation.users.forEach((user)=>{
      if(user.email){
        pusherServer.trigger(user.email,"conversation:remove",existingConversation);
      }
    })

    return NextResponse.json(deleteConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
