"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const user = useAuth();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}
