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
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Smoother animation with spring
  const springConfig = { damping: 20, stiffness: 100 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <motion.div
      ref={cardRef}
      className="group product-card relative h-[380px] w-full overflow-hidden rounded-xl bg-background border border-border shadow-sm transition-all duration-300"
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
      }}
      whileHover={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        y: -5,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/product/${product._id.toString()}`}
        className="block h-full w-full"
      >
        <div className="relative h-[280px] w-full overflow-hidden">
          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              filter: isHovered ? "brightness(1.1)" : "brightness(1)",
            }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              New
            </Badge>
          )}

          {product.discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              {product.discount}% Off
            </Badge>
          )}

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  asChild
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono"
                >
                  <Link href={`/product/${product._id.toString()}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    VIEW
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="font-mono"
                  onClick={addToCart}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  ADD
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-mono font-bold text-lg text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-xl font-mono font-bold text-primary">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground line-through text-sm font-mono">
                    ₹{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-mono font-bold text-foreground">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < product.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
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
      </Link>
    </motion.div>
  );
}
