"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Assuming you're using Lucide icons

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export default function UsersAdminPage() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        setRole(userData.role || "customer");
      } else {
        console.error("Failed to fetch user profile:", await res.json());
        setRole("customer");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setRole("customer");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);

  useEffect(() => {
    if (role === "superadmin") {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        const normalizedUsers = data.map((user: User) => ({
          ...user,
          role: user.role || "customer",
        }));
        setUsers(normalizedUsers);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user,
          ),
        );
        toast({ title: "Success", description: "Role updated successfully" });
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }
  if (!session || role !== "superadmin") {
    return (
      <div className="container mx-auto p-4 text-center">Unauthorized</div>
    );
  }

  return (
    <div className="animate-fade-in pt-20 bg-background">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6 sm:mb-8">
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">User Management</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          User Management
        </h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] sm:w-auto">Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Toggle Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.role ?? "customer"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Switch
                        id={`role-toggle-${user._id}`}
                        checked={user.role === "admin"}
                        onCheckedChange={() =>
                          handleRoleToggle(user._id, user.role ?? "customer")
                        }
                        disabled={loading || user._id === session.user.id}
                      />
                      <Label
                        htmlFor={`role-toggle-${user._id}`}
                        className="text-sm text-muted-foreground hidden sm:inline"
                      >
                        Admin
                      </Label>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
