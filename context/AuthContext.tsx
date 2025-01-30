import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = async ({ children }: AuthContextProps) => {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthContext;
