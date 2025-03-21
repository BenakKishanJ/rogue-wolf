// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IProduct } from "../../lib/models/products"; // Adjust path

interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product?: IProduct; // Populated product details
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchCart();
    } else {
      setLoading(false); // Stop loading if unauthenticated
    }
  }, [status, session]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cart?userId=${session?.user?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      const cart = await res.json();
      if (cart.items && cart.items.length > 0) {
        const itemsWithProducts = await Promise.all(
          cart.items.map(async (item: CartItem) => {
            const productRes = await fetch(`/api/products/${item.productId}`);
            const product = await productRes.json();
            return { ...item, product };
          }),
        );
        setCartItems(itemsWithProducts);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-foreground/70 mb-4">Your cart is empty.</p>
          <Button asChild variant="outline">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center gap-4">
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-secondary/20 rounded-md flex items-center justify-center">
                    <span className="text-sm text-foreground/60">No Image</span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">
                    {item.product?.name || "Unknown Product"}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Color: {item.color} | Size: {item.size} | Quantity:{" "}
                    {item.quantity}
                  </p>
                  <p className="text-sm font-bold">
                    ₹{(item.product?.price || 0) * item.quantity}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
