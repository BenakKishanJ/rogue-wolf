// app/product/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react"; // Add for React.use()
import {
  ChevronRight,
  CuboidIcon as Cube,
  Heart,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/shop/product-card";
import { IProduct } from "../../../lib/models/products"; // Adjust path
import connectToDatabase from "../../../lib/mongodb"; // Adjust path
import Product from "../../../lib/models/products"; // Adjust path
import { useToast } from "@/hooks/use-toast"; // Adjust path
import { ToastAction } from "@/components/ui/toast"; // Adjust path

interface ProductPageProps {
  product: IProduct | null;
  relatedProducts: IProduct[];
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // Unwrap params with React.use()
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();

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

  useEffect(() => {
    async function loadData() {
      const productRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
      );
      const productData = await productRes.json();
      setProduct(productData || null);

      if (productData) {
        const relatedRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/related?category=${productData.category}&id=${id}`,
        );
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData || []);
      }
    }
    loadData();
  }, [id]);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const productImages =
    product.images.length > 0 ? product.images : [product.designImage];

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  // Handle image error by setting fallback image
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackImage: string = "/TShirt.png",
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = fallbackImage;
  };

  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-primary-foreground/60 mb-8">
          <Link href="/" className="hover:text-primary-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-primary-foreground">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-primary-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
              <Image
                src={productImages[activeImageIndex] || "/TShirt.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                onError={(e) => handleImageError(e, "/TShirt.png")}
              />

              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm font-medium px-2 py-1 rounded">
                  {product.discount}% Off
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    activeImageIndex === index
                      ? "ring-2 ring-accent"
                      : "ring-1 ring-neutral-800"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image || "/TShirt.png"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => handleImageError(e, "/TShirt.png")}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? "fill-accent text-accent"
                        : "text-primary-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-black text-sm">
                ({Math.floor(Math.random() * 100) + 50} reviews)
              </span>
            </div>

            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-montserrat font-bold">
                    ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-primary-foreground/60 line-through text-lg">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-montserrat font-bold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-primary-foreground/70 mb-6">
              {product.description}
            </p>

            <div className="space-y-6 mb-8">
              {/* Color Selection */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="color" className="text-base font-medium">
                    Color
                  </Label>
                  <span className="text-primary-foreground/60 text-sm capitalize">
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
                        className={`h-8 w-8 rounded-full border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2`}
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="size" className="text-base font-medium">
                    Size
                  </Label>
                  <Button
                    variant="link"
                    className="text-accent p-0 h-auto text-sm"
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
                    <div key={size} className="flex items-center">
                      <RadioGroupItem
                        id={size}
                        value={size}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={size}
                        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-border bg-secondary text-sm font-medium ring-offset-background transition-all hover:bg-accent/10 peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground"
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
                  className="text-base font-medium block mb-2"
                >
                  Quantity
                </Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
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
                    className="h-10 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                onClick={addToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            {/* 3D View and Try-On */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button asChild variant="secondary">
                <Link
                  href={`/3d-view/${product._id.toString()}`}
                  className="flex items-center justify-center"
                >
                  <Cube className="mr-2 h-5 w-5" />
                  View in 3D
                </Link>
              </Button>
              <Button asChild variant="secondary">
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
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-primary-foreground/60">
                    Free standard shipping on orders over Rs.100. Delivery time:
                    3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <div className="text-black space-y-4">
                  <p>
                    Introducing the {product.name}, a perfect blend of style and
                    comfort for the modern individual. This tee is crafted with
                    a meticulous composition of 60% combed ringspun cotton and
                    40% polyester jersey, ensuring a soft and breathable fabric
                    that feels gentle against the skin.
                  </p>
                  <p>
                    The combed ringspun cotton provides a luxurious feel while
                    enhancing durability, making this shirt a reliable choice
                    for everyday wear. The polyester component adds resilience
                    and shape retention, ensuring the shirt maintains its form
                    even after multiple washes.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <div className="text-black">
                  <ul className="space-y-2">
                    <li>• 60% combed ringspun cotton, 40% polyester jersey</li>
                    <li>• Fabric weight: 4.3 oz/yd² (146 g/m²)</li>
                    <li>• Pre-shrunk fabric</li>
                    <li>• Side-seamed construction</li>
                    <li>• Shoulder-to-shoulder taping</li>
                    <li>• Tear-away label</li>
                    <li>• Machine wash cold, tumble dry low</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <div className="text-black">
                  <p className="mb-4">
                    Customer reviews will be displayed here.
                  </p>
                  <Button variant="outline">Write a Review</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <Button asChild variant="link" className="text-accent">
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
