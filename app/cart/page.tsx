"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "../../lib/models/products"; // Adjust path

interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product?: IProduct;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
    }
  };

  const removeItem = async (item: CartItem) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          color: item.color,
          size: item.size,
        }),
      });

      if (res.ok) {
        setCartItems((prevItems) =>
          prevItems.filter(
            (i) =>
              !(
                i.productId === item.productId &&
                i.color === item.color &&
                i.size === item.size
              ),
          ),
        );
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );
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
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
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
                    item.product?.images?.[0][0] ||
                    item.product?.designImage ||
                    "/placeholder.png"
                  }
                  alt={item.product?.name || "Product Image"}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-accent/10 rounded-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-xl font-bold text-foreground/70">
              ₹{calculateTotalPrice().toFixed(2)}
            </p>
          </div>

          <Button
            asChild
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
