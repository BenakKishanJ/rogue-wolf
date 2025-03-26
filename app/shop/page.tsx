// app/shop/page.tsx

import Link from "next/link";
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/shop/product-card";
import { IProduct } from "../../lib/models/products"; // Adjust path based on structure

async function fetchProducts(): Promise<IProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ShopPage() {
  const products = await fetchProducts();
  return (
    <div className="animate-fade-in pt-20">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-primary-foreground/60 mb-8">
          <Link href="/" className="hover:text-primary-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-primary-foreground">Shop</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  variant="link"
                  className="text-accent p-0 h-auto text-sm"
                >
                  Reset All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {[
                      "All",
                      "Classic",
                      "Graphic",
                      "Vintage",
                      "Premium",
                      "Slim Fit",
                      "Oversized",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`category-${category.toLowerCase()}`} />
                        <Label
                          htmlFor={`category-${category.toLowerCase()}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <RadioGroup defaultValue="all">
                    {[
                      { id: "all", label: "All Prices" },
                      { id: "0-500", label: "₹0 - ₹500" },
                      { id: "500-1000", label: "₹500 - ₹1000" },
                      { id: "1000-1500", label: "₹1000 - ₹1500" },
                      { id: "1500-2000", label: "₹1500 - ₹2000" },
                      { id: "2000-", label: "₹2000+" },
                    ].map((price) => (
                      <div
                        key={price.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={price.id}
                          id={`price-${price.id}`}
                        />
                        <Label
                          htmlFor={`price-${price.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {price.label}
                        </Label>
                      </div>
                    ))}{" "}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Colors */}
                <div>
                  <h3 className="font-medium mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "black", color: "bg-black" },
                      { id: "white", color: "bg-white border border-border" },
                      { id: "blue", color: "bg-blue-500" },
                      { id: "red", color: "bg-red-500" },
                      { id: "green", color: "bg-green-500" },
                    ].map((color) => (
                      <div key={color.id} className="flex items-center">
                        <Checkbox
                          id={`color-${color.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`color-${color.id}`}
                          className={`h-8 w-8 rounded-full ${color.color} cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sizes */}
                <div>
                  <h3 className="font-medium mb-3">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <div key={size} className="flex items-center">
                        <Checkbox
                          id={`size-${size.toLowerCase()}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size.toLowerCase()}`}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-secondary text-sm font-medium ring-offset-background transition-all hover:bg-accent/10 peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Ratings */}
                <div>
                  <h3 className="font-medium mb-3">Ratings</h3>
                  <RadioGroup defaultValue="all">
                    {[
                      { id: "all", label: "All Ratings" },
                      { id: "4-up", label: "4 Stars & Up" },
                      { id: "3-up", label: "3 Stars & Up" },
                      { id: "2-up", label: "2 Stars & Up" },
                      { id: "1-up", label: "1 Star & Up" },
                    ].map((rating) => (
                      <div
                        key={rating.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={rating.id}
                          id={`rating-${rating.id}`}
                        />
                        <Label
                          htmlFor={`rating-${rating.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {rating.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold">All Products</h1>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-full sm:max-w-md overflow-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <Button
                        variant="link"
                        className="text-accent p-0 h-auto text-sm"
                      >
                        Reset All
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-medium mb-3">Categories</h3>
                        <div className="space-y-2">
                          {[
                            "All",
                            "Classic",
                            "Graphic",
                            "Vintage",
                            "Premium",
                            "Slim Fit",
                            "Oversized",
                          ].map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`mobile-category-${category.toLowerCase()}`}
                              />
                              <Label
                                htmlFor={`mobile-category-${category.toLowerCase()}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Price Range */}
                      <div>
                        <h3 className="font-medium mb-3">Price Range</h3>
                        <RadioGroup defaultValue="all">
                          {[
                            { id: "all", label: "All Prices" },
                            { id: "under-25", label: "Under $25" },
                            { id: "25-50", label: "$25 to $50" },
                            { id: "50-100", label: "$50 to $100" },
                            { id: "over-100", label: "Over $100" },
                          ].map((price) => (
                            <div
                              key={price.id}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={price.id}
                                id={`mobile-price-${price.id}`}
                              />
                              <Label
                                htmlFor={`mobile-price-${price.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {price.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <Separator />

                      {/* Colors */}
                      <div>
                        <h3 className="font-medium mb-3">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "black", color: "bg-black" },
                            {
                              id: "white",
                              color: "bg-white border border-border",
                            },
                            { id: "blue", color: "bg-blue-500" },
                            { id: "red", color: "bg-red-500" },
                            { id: "green", color: "bg-green-500" },
                          ].map((color) => (
                            <div key={color.id} className="flex items-center">
                              <Checkbox
                                id={`mobile-color-${color.id}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`mobile-color-${color.id}`}
                                className={`h-8 w-8 rounded-full ${color.color} cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Sizes */}
                      <div>
                        <h3 className="font-medium mb-3">Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                          {["XS", "S", "M", "L", "XL"].map((size) => (
                            <div key={size} className="flex items-center">
                              <Checkbox
                                id={`mobile-size-${size.toLowerCase()}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`mobile-size-${size.toLowerCase()}`}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-secondary text-sm font-medium ring-offset-background transition-all hover:bg-accent/10 peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground"
                              >
                                {size}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Ratings */}
                      <div>
                        <h3 className="font-medium mb-3">Ratings</h3>
                        <RadioGroup defaultValue="all">
                          {[
                            { id: "all", label: "All Ratings" },
                            { id: "4-up", label: "4 Stars & Up" },
                            { id: "3-up", label: "3 Stars & Up" },
                            { id: "2-up", label: "2 Stars & Up" },
                            { id: "1-up", label: "1 Star & Up" },
                          ].map((rating) => (
                            <div
                              key={rating.id}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={rating.id}
                                id={`mobile-rating-${rating.id}`}
                              />
                              <Label
                                htmlFor={`mobile-rating-${rating.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {rating.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="bg-accent text-accent-foreground"
                >
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline" size="icon">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
