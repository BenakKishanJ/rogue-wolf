// app/shop/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react"; // Added Suspense import
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
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
import { IProduct } from "../../lib/models/products";
import { PageLoader } from "@/components/ui/page-loader";

// Opt out of static prerendering
export const dynamic = "force-dynamic";

function ShopPageContent() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter states
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [rating, setRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Search state
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const router = useRouter();

  // Mobile state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<number>(0);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Apply filters and reset to page 1 when filters change
  useEffect(() => {
    let result = [...products];
    let filterCount = 0;

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      filterCount += 1;
    }

    if (categories.length > 0) {
      result = result.filter((product) =>
        categories.some((cat) =>
          product.category?.toLowerCase().includes(cat.toLowerCase()),
        ),
      );
      filterCount += 1;
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map((p) => parseInt(p || "0"));
      result = result.filter((product) => {
        if (!max) return product.price >= min;
        return product.price >= min && product.price <= max;
      });
      filterCount += 1;
    }

    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color)),
      );
      filterCount += 1;
    }

    if (selectedSizes.length > 0) {
      result = result.filter((product) =>
        product.sizes?.some((size) =>
          selectedSizes.includes(size.toLowerCase()),
        ),
      );
      filterCount += 1;
    }

    if (rating !== "all") {
      const minRating = parseInt(rating.split("-")[0]);
      result = result.filter((product) => product.rating >= minRating);
      filterCount += 1;
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setActiveFilters(filterCount);
    setCurrentPage(1);
  }, [
    products,
    categories,
    priceRange,
    selectedColors,
    selectedSizes,
    rating,
    sortBy,
    searchQuery,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const resetFilters = () => {
    setCategories([]);
    setPriceRange("all");
    setSelectedColors([]);
    setSelectedSizes([]);
    setRating("all");
    setSortBy("featured");
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`/shop?${params.toString()}`);
  };

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size.toLowerCase())
        ? prev.filter((s) => s !== size.toLowerCase())
        : [...prev, size.toLowerCase()],
    );
  };

  const categoryOptions = ["Rogue Essentials", "Rogue Originals", "Vintage"];
  const priceOptions = [
    { id: "all", label: "All Prices" },
    { id: "0-500", label: "₹0 - ₹500" },
    { id: "500-1000", label: "₹500 - ₹1000" },
    { id: "1000-1500", label: "₹1000 - ₹1500" },
    { id: "1500-2000", label: "₹1500 - ₹2000" },
    { id: "2000-", label: "₹2000+" },
  ];
  const colorOptions = [
    { id: "black", color: "bg-black" },
    { id: "white", color: "bg-white border border-border" },
    { id: "blue", color: "bg-blue-500" },
    { id: "red", color: "bg-red-500" },
    { id: "green", color: "bg-green-500" },
  ];
  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const ratingOptions = [
    { id: "all", label: "All Ratings" },
    { id: "4-up", label: "4 Stars & Up" },
    { id: "3-up", label: "3 Stars & Up" },
    { id: "2-up", label: "2 Stars & Up" },
    { id: "1-up", label: "1 Star & Up" },
  ];

  const FilterSection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categoryOptions.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`${isMobile ? "mobile-" : ""}category-${category.toLowerCase()}`}
                checked={categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}category-${category.toLowerCase()}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <RadioGroup value={priceRange} onValueChange={setPriceRange}>
          {priceOptions.map((price) => (
            <div key={price.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={price.id}
                id={`${isMobile ? "mobile-" : ""}price-${price.id}`}
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}price-${price.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {price.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <div key={color.id} className="flex items-center">
              <Checkbox
                id={`${isMobile ? "mobile-" : ""}color-${color.id}`}
                checked={selectedColors.includes(color.id)}
                onCheckedChange={() => toggleColor(color.id)}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}color-${color.id}`}
                className={`h-8 w-8 rounded-full ${color.color} cursor-pointer ring-offset-background transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-accent peer-data-[state=checked]:ring-offset-2`}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <div key={size} className="flex items-center">
              <Checkbox
                id={`${isMobile ? "mobile-" : ""}size-${size.toLowerCase()}`}
                checked={selectedSizes.includes(size.toLowerCase())}
                onCheckedChange={() => toggleSize(size)}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}size-${size.toLowerCase()}`}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-sm font-medium ring-offset-background transition-all hover:bg-accent/10 ${selectedSizes.includes(size.toLowerCase()) ? "bg-accent text-accent-foreground" : ""}`}
              >
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-3">Ratings</h3>
        <RadioGroup value={rating} onValueChange={setRating}>
          {ratingOptions.map((ratingOpt) => (
            <div key={ratingOpt.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={ratingOpt.id}
                id={`${isMobile ? "mobile-" : ""}rating-${ratingOpt.id}`}
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}rating-${ratingOpt.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {ratingOpt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pt-20 bg-background">
      <PageLoader isLoading={loading} />
      <div className="container py-4 md:py-8">
        <div className="flex items-center text-sm text-foreground/60 mb-4 md:mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">Shop</span>
          {searchQuery && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground/60">
                Search: "{searchQuery}"
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-auto text-sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.replace(`/shop?${params.toString()}`);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>

        {(activeFilters > 0 || searchQuery) && (
          <div className="flex items-center justify-between mb-4 md:hidden">
            <div className="text-sm text-foreground/70">
              <span className="font-medium">
                {activeFilters + (searchQuery ? 1 : 0)} filter
                {activeFilters + (searchQuery ? 1 : 0) !== 1 ? "s" : ""} applied
              </span>
            </div>
            <Button
              variant="link"
              className="text-accent p-0 h-auto text-sm"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {(activeFilters > 0 || searchQuery) && (
                  <Button
                    variant="link"
                    className="text-accent p-0 h-auto text-sm"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                )}
              </div>
              <FilterSection />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                All Products
                {filteredProducts.length > 0 && (
                  <span className="text-foreground/60 text-lg ml-2">
                    ({filteredProducts.length})
                  </span>
                )}
              </h1>

              <div className="flex items-center gap-3">
                <Sheet
                  open={isMobileFilterOpen}
                  onOpenChange={setIsMobileFilterOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="md:hidden relative"
                      onClick={() => setIsMobileFilterOpen(true)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilters > 0 && (
                        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground h-5 w-5 rounded-full text-xs flex items-center justify-center">
                          {activeFilters}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-full sm:max-w-md overflow-auto p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <div className="flex gap-4 items-center">
                        <Button
                          variant="link"
                          className="text-accent p-0 h-auto text-sm"
                          onClick={resetFilters}
                        >
                          Reset All
                        </Button>
                        <SheetClose asChild>
                          <Button size="icon" variant="ghost">
                            <X className="h-4 w-4" />
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                    <FilterSection isMobile={true} />
                    <div className="mt-8 pt-6 border-t sticky bottom-0 bg-background">
                      <SheetClose asChild>
                        <Button
                          className="w-full"
                          onClick={() => setIsMobileFilterOpen(false)}
                        >
                          Show {filteredProducts.length} results
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 hidden sm:block" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[130px] sm:w-[180px]">
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

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-secondary/20 rounded-lg h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      Try adjusting your filters to find what you're looking
                      for.
                    </p>
                    <Button onClick={resetFilters}>Clear all filters</Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {currentProducts.map((product) => (
                        <ProductCard
                          key={product._id.toString()}
                          product={product}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8 md:mt-12">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
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
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <Button
                              key={page}
                              variant="outline"
                              className={
                                currentPage === page
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              }
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
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
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading shop page...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
