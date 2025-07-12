// lib/auth.ts
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createContext, useContext } from "react";

interface User {
  name: string;
  email: string;
  nicename: string;
}

export const AuthContext = createContext<User | null>(null);

export const useAuth = () => useContext(AuthContext);

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables.");
  }
  return new TextEncoder().encode(secret);
}

export async function getLoggedInUser(): Promise<User | null> {
  const token = cookies().get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const userData = payload.data.user;

    return {
      name: userData.display_name,
      email: userData.email,
      nicename: userData.nicename,
    };
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}
