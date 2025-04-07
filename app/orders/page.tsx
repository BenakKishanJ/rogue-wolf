// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface TransactionItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
  product?: { name: string; designImage?: string; images?: string[][] };
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
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "completed" | "failed" | "pending"; // Updated to include "pending"
  items: TransactionItem[];
  deliveryDetails: DeliveryDetails; // Added delivery details
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      fetchTransactions();
    }
  }, [status]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) {
        // Fetch product details for each item
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
        description: "Failed to load your orders.",
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

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>
      {transactions.length === 0 ? (
        <p>
          No orders yet.{" "}
          <Link href="/shop" className="text-accent">
            Start Shopping
          </Link>
        </p>
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
                      : transaction.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {transaction.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-foreground/70 mb-2">
                Placed on:{" "}
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>

              {/* Delivery Details Section */}
              <div className="mb-4">
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

              {/* Items Section */}
              <div className="space-y-4">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Image
                      src={
                        item.product?.images?.[0][0] ||
                        item.product?.designImage ||
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

              {/* Total Section */}
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
