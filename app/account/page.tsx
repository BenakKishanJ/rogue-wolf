// app/account/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer"); // Default to "customer" until fetched
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch full user profile from API
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        setUsername(userData.name || "");
        setAddress(userData.address || "");
        setPincode(userData.pincode || "");
        setPhone(userData.phone || "");
        setRole(userData.role || "customer"); // Set role from MongoDB
      } else {
        console.error("Failed to fetch user profile:", await res.json());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Initial load: fetch profile if authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          name: username,
          address,
          pincode,
          phone,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        // Update session (for consistency across app)
        await update({ name: username, address, pincode, phone });
        // Fetch updated profile directly from DB
        await fetchUserProfile();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
        setTimeout(() => signOut({ callbackUrl: "/" }), 1000);
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

  if (status === "loading")
    return <div className="container py-20 text-center">Loading...</div>;
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
          <div className="flex justify-center mb-4">
            <Image
              src={session.user.image || "/logo.png"}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full object-cover"
              onError={(e) => {
                console.error("Image load error:", e);
                e.currentTarget.src = "/logo.png"; // Fallback on error
              }}
            />
          </div>
          <p>
            <strong>Email:</strong> {session.user.email || "Not provided"}
          </p>
          <p>
            <strong>Name:</strong> {username || "Not set"}
          </p>
          <p>
            <strong>Address:</strong> {address || "Not set"}
          </p>
          <p>
            <strong>Pincode:</strong> {pincode || "Not set"}
          </p>
          <p>
            <strong>Phone:</strong> {phone || "Not set"}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
          <p>
            <strong>ID:</strong> {session.user.id}
          </p>
        </div>

        {/* Update Profile */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Update Profile</h2>
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
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter your pincode"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={
              loading ||
              (!username.trim() &&
                !address.trim() &&
                !pincode.trim() &&
                !phone.trim())
            }
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {loading ? "Updating..." : "Update Profile"}
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

        {/* Admin Button */}
        {["admin", "superadmin"].includes(role) && (
          <div className="space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        )}

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
            className={`text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
