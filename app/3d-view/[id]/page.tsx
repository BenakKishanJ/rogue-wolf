"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getProductById } from "@/lib/data";
import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import Backdrop from "@/components/Backdrop";
import CameraRig from "@/components/CameraRig";
import Shirt from "@/components/Shirt";

const designURLs = [
  "/designs/design1.png",
  "/designs/design2.png",
  "/designs/design3.png",
  "/designs/design4.png",
];

interface ThreeDViewPageProps {
  params: {
    id: string;
  };
}

export default function ThreeDViewPage({ params }: ThreeDViewPageProps) {
  const { id } = params;
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [selectedDesign, setSelectedDesign] = useState(designURLs[0]);

  // Validate product ID
  if (!id) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Product ID</h1>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const product = getProductById(id);

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
          <Link
            href={`/product/${product.id}`}
            className="hover:text-foreground"
          >
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
              >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />

                <CameraRig>
                  <Backdrop />
                  <Center>
                    <Shirt color={selectedColor} logoTexture={selectedDesign} />
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
                <Link
                  href={`/product/${product.id}`}
                  className="flex items-center"
                >
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
                      {selectedColor.replace("#", "")}
                    </span>
                  </div>
                  <RadioGroup
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                    className="flex gap-2"
                  >
                    {["black", "white", "blue", "red"].map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem
                          value={color}
                          id={color}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={color}
                          className={`h-8 w-8 rounded-full border cursor-pointer ring-offset-background transition-all hover:scale-110
                            ${color === "black" ? "bg-black" : ""}
                            ${color === "white" ? "bg-white" : ""}
                            ${color === "blue" ? "bg-blue-500" : ""}
                            ${color === "red" ? "bg-red-500" : ""}
                            peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent`}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Design Selector */}
                <div>
                  <Label className="text-base font-medium block mb-2">
                    Design
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {designURLs.map((url, index) => (
                      <div
                        key={url}
                        onClick={() => setSelectedDesign(url)}
                        className={`aspect-square rounded-md overflow-hidden border cursor-pointer transition-all
                          ${selectedDesign === url ? "ring-2 ring-accent" : "border-border"}`}
                      >
                        <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                          <span className="text-sm">D{index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls Help Section */}
                <div className="bg-secondary/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Controls</h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Click and drag to rotate</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Double-click to reset view</li>
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
