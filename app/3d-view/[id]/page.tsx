"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IProduct } from "../../../lib/models/products";
import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import Backdrop from "@/components/Backdrop";
import CameraRig from "@/components/CameraRig";
import Shirt from "@/components/Shirt";
import { useParams } from "next/navigation";
import { PageLoader } from "@/components/ui/page-loader";

export default function ThreeDViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [rotationY, setRotationY] = useState(Math.PI);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
        );
        const data = await res.json();
        setProduct(data || null);
        if (data && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageLoader isLoading={true} />
        <div className="container py-20 text-center">Loading 3D view...</div>
      </>
    );
  }

  if (error) {
    return (
      <div className="container py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

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

  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-foreground/60 mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/product/${id}`} className="hover:text-foreground">
            {product.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">3D View</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 3D Viewer Section */}
          <div className="flex-1 bg-secondary/10 rounded-xl overflow-hidden">
            <div className="aspect-square w-full relative">
              <Canvas
                shadows
                camera={{ position: [0, 0, 2.5], fov: 25 }}
                gl={{ preserveDrawingBuffer: true }}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <CameraRig rotationY={rotationY}>
                  <Backdrop />
                  <Center>
                    <Shirt
                      color={selectedColor}
                      logoTexture={product.designImage}
                    />
                  </Center>
                </CameraRig>
              </Canvas>

              <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg text-center">
                <p className="text-sm">Drag to rotate • Scroll to zoom</p>
              </div>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <Button asChild variant="outline" size="sm">
                <Link href={`/product/${id}`} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Product
                </Link>
              </Button>

              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-foreground/70">
                Explore this product in 3D. Rotate, zoom, and see it from all
                angles.
              </p>

              <div className="space-y-6">
                {/* Color Picker */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-base font-medium">Color</Label>
                    <span className="text-foreground/60 text-sm capitalize">
                      {selectedColor}
                    </span>
                  </div>
                  <RadioGroup
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                    className="flex gap-2"
                  >
                    {product.colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem
                          value={color}
                          id={color}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={color}
                          className="h-8 w-8 rounded-full border border-border cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Rotation Controls */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">View Rotation</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setRotationY(0)}
                      className="flex-1"
                    >
                      Front
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRotationY(Math.PI / 2)}
                      className="flex-1"
                    >
                      Side
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRotationY(Math.PI)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  </div>
                </div>
                {/* Controls Help Section */}
                <div className="bg-secondary/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Controls</h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Click and drag to rotate</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Double-click to reset view</li>
                    <li>• Use buttons to switch between front/back</li>
                  </ul>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
