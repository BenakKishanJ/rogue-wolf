// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react"; // Added for breadcrumb

interface TransactionItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
  product?: { name: string; designImage?: string; images?: string[] };
}

interface DeliveryDetails {
  name: string;
  address: string;
  pincode: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  deliveryNote?: string;
}

interface Transaction {
  _id: string;
  userId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "completed" | "failed" | "pending";
  items: TransactionItem[];
  deliveryDetails: DeliveryDetails;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { toast } = useToast();

  // Fetch role from MongoDB
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const userData = await res.json();
        setRole(userData.role || "customer");
      } else {
        setRole("customer");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setRole("customer");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      } else {
        throw new Error(data.error || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserProfile();
    }
  }, [status, session]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      ["admin", "superadmin"].includes(role ?? "")
    ) {
      fetchTransactions();
    }
  }, [status, role]);

  if (status === "loading" || loadingProfile) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!["admin", "superadmin"].includes(role ?? "")) {
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
          <span className="text-foreground">All Orders</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          All Orders
        </h1>
        {transactions.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="space-y-8">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-6 bg-secondary/10 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Order #{transaction.orderId}
                  </h2>
                  <span
                    className={`text-sm font-medium ${
                      transaction.status === "completed"
                        ? "text-green-600"
                        : transaction.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {transaction.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mb-2">
                  Placed on:{" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground/70 mb-2">
                  User ID: {transaction.userId}
                </p>
                <p className="text-sm text-foreground/70 mb-2">
                  Payment ID: {transaction.paymentId}
                </p>
                <div className="space-y-4">
                  {transaction.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Image
                        src={
                          item.product?.designImage ||
                          item.product?.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={item.product?.name || "Product"}
                        width={60}
                        height={60}
                        className="object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          Color: {item.color} | Size: {item.size} | Quantity:{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Delivery Details</h3>
                  <p className="text-sm">
                    Name: {transaction.deliveryDetails.name}
                  </p>
                  <p className="text-sm">
                    Address: {transaction.deliveryDetails.address}
                  </p>
                  <p className="text-sm">
                    Pincode: {transaction.deliveryDetails.pincode}
                  </p>
                  <p className="text-sm">
                    Phone: {transaction.deliveryDetails.phone}
                  </p>
                  {transaction.deliveryDetails.alternatePhone && (
                    <p className="text-sm">
                      Alternate Phone:{" "}
                      {transaction.deliveryDetails.alternatePhone}
                    </p>
                  )}
                  <p className="text-sm">
                    Email: {transaction.deliveryDetails.email}
                  </p>
                  {transaction.deliveryDetails.deliveryNote && (
                    <p className="text-sm">
                      Note: {transaction.deliveryDetails.deliveryNote}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-xl font-bold text-accent-foreground">
                    ₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
