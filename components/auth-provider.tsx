"use client";

import { AuthContext } from "@/lib/auth";
import type { User } from "@/lib/types"; // Assuming a User type exists

export default function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
