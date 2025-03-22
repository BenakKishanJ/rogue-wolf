// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Image from "next/image";

interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product?: {
    name: string;
    price: number;
    designImage?: string;
    images?: string[];
  };
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const cart = await res.json();
      if (cart.items) {
        const itemsWithProducts = await Promise.all(
          cart.items.map(async (item: CartItem) => {
            const productRes = await fetch(`/api/products/${item.productId}`);
            const product = await productRes.json();
            return { ...item, product };
          }),
        );
        setCartItems(itemsWithProducts);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );

  const initiatePayment = async () => {
    if (!session?.user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive",
        action: (
          <ToastAction altText="Sign In" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </ToastAction>
        ),
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const totalAmount = calculateTotal();
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, cartItems }),
      });

      const order = await res.json();
      if (!order.id) throw new Error("Order creation failed");

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please try again.");
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // Ensure this is in .env.local
        amount: totalAmount * 100, // In paise
        currency: "INR",
        name: "Rogue Wolf",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: session.user.id,
              amount: totalAmount,
              cartItems,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast({
              title: "Payment Successful",
              description: "Your order has been placed!",
              action: (
                <ToastAction altText="View Orders" asChild>
                  <Link href="/orders">View Orders</Link>
                </ToastAction>
              ),
            });
            setCartItems([]); // Clear cart
          } else {
            toast({
              title: "Payment Failed",
              description: verifyData.message,
              variant: "destructive",
            });
          }
        },
        prefill: { email: session.user.email || "", contact: "" },
        theme: { color: "#F56565" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response: any) =>
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        }),
      );
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment.",
        variant: "destructive",
      });
    }
  };

  if (status === "loading")
    return <div className="container py-20 text-center">Loading...</div>;

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
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/shop" className="text-accent">
            Shop Now
          </Link>
        </p>
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg"
              >
                <Image
                  src={
                    item.product?.images?.[0] ||
                    item.product?.designImage ||
                    "/placeholder.png"
                  }
                  alt={item.product?.name || "Product"}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-sm text-foreground/70">
                    Color: {item.color} | Size: {item.size} | Quantity:{" "}
                    {item.quantity}
                  </p>
                  <p className="text-sm font-bold">
                    ₹{(item.product?.price || 0) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-accent/10 rounded-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-xl font-bold text-foreground/70">
              ₹{calculateTotal().toFixed(2)}
            </p>
          </div>
          <Button
            onClick={initiatePayment}
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Pay Now
          </Button>
        </div>
      )}
    </div>
  );
}
