"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "../../lib/models/products"; // Adjust path based on your structure
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast"; // Adjust path
import { ToastAction } from "@/components/ui/toast"; // Adjust path

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const addToCart = async () => {
    if (status === "loading") {
      toast({
        title: "Please Wait",
        description: "Loading your session...",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
        action: (
          <ToastAction altText="Sign In" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </ToastAction>
        ),
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product._id.toString(),
          quantity: 1,
          color: product.colors[0] || "default",
          size: product.sizes[0] || "M",
        }),
      });

      if (res.ok) {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
          action: (
            <ToastAction altText="View Cart" asChild>
              <Link href="/cart">View Cart</Link>
            </ToastAction>
          ),
        });
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="group product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {product.isNew && (
          <Badge className="absolute top-3 left-3 bg-flame text-lavender-blush">
            New
          </Badge>
        )}

        {product.discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
            {product.discount}% Off
          </Badge>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-flame hover:bg-flame/90 text-lavender-blush font-mono"
          >
            <Link href={`/product/${product._id.toString()}`}>
              <Eye className="h-4 w-4 mr-1" />
              VIEW
            </Link>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="font-mono"
            onClick={addToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            ADD
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/product/${product._id.toString()}`} className="block">
          <h3 className="font-mono font-bold text-lg mb-1 hover:text-flame transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-xl font-mono font-bold text-flame">
                  ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-foreground/60 line-through text-sm font-mono">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-mono font-bold">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < product.rating ? "text-flame fill-flame" : "text-foreground/30"}`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99999 1.66667L12.575 6.88334L18.3333 7.725L14.1667 11.7833L15.15 17.5167L9.99999 14.8083L4.84999 17.5167L5.83333 11.7833L1.66666 7.725L7.42499 6.88334L9.99999 1.66667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
