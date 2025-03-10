import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the request body as URL-encoded form data
  const formData = await request.text(); // Get the raw body as text
  const params = new URLSearchParams(formData); // Parse it using URLSearchParams

  const socket_id = params.get("socket_id");
  const channel_name = params.get("channel_name");

  if (!socket_id || !channel_name) {
    return NextResponse.json(
      { error: "Missing socket_id or channel_name" },
      { status: 400 }
    );
  }

  const data = {
    user_id: session.user.email,
  };

  try {
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      data
    );
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher authorization error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
