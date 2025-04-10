// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null); // Store role from MongoDB
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch user profile to get role from MongoDB
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        setRole(userData.role || "customer"); // Default to "customer" if not set
      } else {
        console.error("Failed to fetch user profile:", await res.json());
        setRole("customer"); // Fallback to "customer" on error
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setRole("customer"); // Fallback on network error
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch profile when session is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);

  // Handle loading states
  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return (
      <>
        <PageLoader isLoading={true} />
        <div className="container py-20 text-center">Loading...</div>
      </>
    );
  }

  // Check authentication and role from MongoDB
  if (!session || !["admin", "superadmin"].includes(role ?? "")) {
    return <div className="container py-20 text-center">Unauthorized</div>;
  }

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-4 max-w-md mx-auto">
        {role === "superadmin" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/products">Manage Products</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
