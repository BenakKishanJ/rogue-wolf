// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  alternatePhone: string;
  email: string;
  deliveryNote: string;
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
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated" && isAuthorized) {
      fetchTransactions();
    }
  }, [status, isAuthorized]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "GET",
        headers: { "X-Admin-Password": password },
      });
      const data = await res.json();
      if (res.ok) {
        const enrichedTransactions = await Promise.all(
          data.map(async (transaction: Transaction) => {
            const itemsWithProducts = await Promise.all(
              transaction.items.map(async (item: TransactionItem) => {
                const productRes = await fetch(
                  `/api/products/${item.productId}`,
                );
                const product = await productRes.json();
                return { ...item, product };
              }),
            );
            return { ...transaction, items: itemsWithProducts };
          }),
        );
        setTransactions(enrichedTransactions);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        toast({ title: "Success", description: "Access granted." });
      } else {
        toast({
          title: "Error",
          description: data.message || "Invalid password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify password.",
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <form
          onSubmit={handlePasswordSubmit}
          className="max-w-sm mx-auto space-y-4"
        >
          <div>
            <Label htmlFor="password">Enter Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">All Orders</h1>
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
                  className={`text-sm font-medium ${transaction.status === "completed" ? "text-green-600" : "text-red-600"}`}
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
                      <h3 className="font-medium">{item.product?.name}</h3>
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
  );
}
