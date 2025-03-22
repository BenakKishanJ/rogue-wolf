"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [session]);

  const handleUpdateUsername = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, name: username }),
      });

      if (res.ok) {
        setMessage("Username updated successfully!");
        // Update session locally (optional, session will refresh on next fetch)
        if (session.user) session.user.name = username;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !session?.user?.id ||
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (res.ok) {
        setMessage("Account deleted. Signing out...");
        setTimeout(() => signOut({ callbackUrl: "/" }), 1000); // Sign out after delay
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">Your Account</h1>
      <div className="space-y-6 max-w-md mx-auto">
        {/* Account Information */}
        <div className="bg-secondary/10 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Account Details</h2>
          <p className="text-foreground/70">
            <strong>Email:</strong> {session.user.email || "Not provided"}
          </p>
          <p className="text-foreground/70">
            <strong>Name:</strong> {session.user.name || "Not set"}
          </p>
          <p className="text-foreground/70">
            <strong>ID:</strong> {session.user.id}
          </p>
        </div>

        {/* Update Username */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Change Username</h2>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleUpdateUsername}
            disabled={
              loading || !username.trim() || username === session.user.name
            }
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {loading ? "Updating..." : "Update Username"}
          </Button>
        </div>

        {/* Sign Out */}
        <div className="space-y-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Sign Out
          </Button>
        </div>

        {/* Delete Account */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>

        {/* Feedback Message */}
        {message && (
          <p
            className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-destructive"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
