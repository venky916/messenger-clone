"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const getUsers = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }
  try {
    const users = await db.user.findMany({
      where: {
        NOT: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
