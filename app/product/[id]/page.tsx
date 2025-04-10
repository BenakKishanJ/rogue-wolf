// app/product/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  CuboidIcon as Cube,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shop/product-card";
import { IProduct } from "../../../lib/models/products";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { PageLoader } from "@/components/ui/page-loader";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
        );
        const data = await res.json();
        setProduct(data || null);

        if (data) {
          const relatedRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/related?category=${data.category}&id=${id}`,
          );
          const relatedData = await relatedRes.json();
          setRelatedProducts(relatedData || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
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

    if (!product) {
      toast({
        title: "Error",
        description: "Product not loaded yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: id,
          quantity,
          color: selectedColor,
          size: selectedSize,
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

  if (loading) {
    return (
      <>
        <PageLoader isLoading={true} />
        <div className="container py-20 text-center">Loading product...</div>
      </>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center bg-background">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Product not found
        </h1>
        <Button asChild variant="outline">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const productImages =
    product.images.length > 0 ? product.images : [product.designImage];

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) setQuantity(value);
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = "/TShirt.png";
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  return (
    <div className="pt-20 bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images with Navigation */}
          <div className="relative space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={String(productImages[activeImageIndex]) || "/TShirt.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    onError={handleImageError}
                  />
                </motion.div>
              </AnimatePresence>

              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm font-medium px-2 py-1 rounded">
                  {product.discount}% Off
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background text-foreground"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background text-foreground"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden border ${
                    activeImageIndex === index
                      ? "border-primary"
                      : "border-border"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={String(image) || "/TShirt.png"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                ({Math.floor(Math.random() * 100) + 50} reviews)
              </span>
            </div>

            <div>
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground line-through text-lg">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Color Selection */}
            <div>
              <div className="flex justify-between mb-2">
                <Label
                  htmlFor="color"
                  className="text-base font-medium text-foreground"
                >
                  Color
                </Label>
                <span className="text-muted-foreground text-sm capitalize">
                  {selectedColor}
                </span>
              </div>
              <RadioGroup
                id="color"
                value={selectedColor}
                onValueChange={setSelectedColor}
                className="flex gap-2"
              >
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem
                      id={color}
                      value={color}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={color}
                      className={`h-8 w-8 rounded-full border border-border cursor-pointer transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary`}
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between mb-2">
                <Label
                  htmlFor="size"
                  className="text-base font-medium text-foreground"
                >
                  Size
                </Label>
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto text-sm"
                >
                  Size Guide
                </Button>
              </div>
              <RadioGroup
                id="size"
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="grid grid-cols-5 gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem
                      id={size}
                      value={size}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={size}
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-border bg-card text-sm font-medium hover:bg-muted peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                    >
                      {size.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div>
              <Label
                htmlFor="quantity"
                className="text-base font-medium text-foreground block mb-2"
              >
                Quantity
              </Label>
              <div className="inline-flex items-center rounded-md border border-border bg-card">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-foreground hover:bg-muted"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(Number.parseInt(e.target.value) || 1)
                  }
                  className="h-10 w-16 text-center bg-transparent border-none text-foreground focus:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-foreground hover:bg-muted"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={addToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* 3D View and Try-On */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                asChild
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                <Link
                  href={`/3d-view/${product._id.toString()}`}
                  className="flex items-center justify-center"
                >
                  <Cube className="mr-2 h-5 w-5" />
                  View in 3D
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                <Link
                  href={`/try-on/${product._id.toString()}`}
                  className="flex items-center justify-center"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Try It On
                </Link>
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Free standard shipping on orders over ₹100. Delivery time:
                    3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="description" className="text-foreground">
              Description
            </TabsTrigger>
            <TabsTrigger value="details" className="text-foreground">
              Details
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-foreground">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="description"
            className="pt-4 bg-card rounded-b-lg p-4"
          >
            <div className="text-muted-foreground space-y-4">
              <p>
                Introducing the {product.name}, a perfect blend of style and
                comfort for the modern individual. This tee is crafted with a
                meticulous composition of 60% combed ringspun cotton and 40%
                polyester jersey, ensuring a soft and breathable fabric that
                feels gentle against the skin.
              </p>
              <p>
                The combed ringspun cotton provides a luxurious feel while
                enhancing durability, making this shirt a reliable choice for
                everyday wear. The polyester component adds resilience and shape
                retention, ensuring the shirt maintains its form even after
                multiple washes.
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="details"
            className="pt-4 bg-card rounded-b-lg p-4"
          >
            <ul className="text-muted-foreground space-y-2">
              <li>• 60% combed ringspun cotton, 40% polyester jersey</li>
              <li>• Fabric weight: 4.3 oz/yd² (146 g/m²)</li>
              <li>• Pre-shrunk fabric</li>
              <li>• Side-seamed construction</li>
              <li>• Shoulder-to-shoulder taping</li>
              <li>• Tear-away label</li>
              <li>• Machine wash cold, tumble dry low</li>
            </ul>
          </TabsContent>
          <TabsContent
            value="reviews"
            className="pt-4 bg-card rounded-b-lg p-4"
          >
            <div className="text-muted-foreground">
              <p className="mb-4">Customer reviews will be displayed here.</p>
              <Button
                variant="outline"
                className="border-border text-foreground"
              >
                Write a Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              You May Also Like
            </h2>
            <Button asChild variant="link" className="text-primary">
              <Link href="/shop" className="flex items-center">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id.toString()} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
