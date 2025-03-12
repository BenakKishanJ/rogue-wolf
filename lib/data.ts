import type { Product } from "./types"

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Prism Classic Tee",
    description: "A premium cotton t-shirt with a classic fit and exceptional comfort.",
    price: 39.99,
    discount: 0,
    rating: 4,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "blue", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: true,
    category: "classic",
  },
  {
    id: "2",
    name: "Prism Graphic Tee",
    description: "A stylish graphic t-shirt featuring unique designs and premium fabric.",
    price: 49.99,
    discount: 10,
    rating: 5,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "blue"],
    sizes: ["xs", "s", "m", "l", "xl"],
    category: "graphic",
  },
  {
    id: "3",
    name: "Prism Vintage Tee",
    description: "A vintage-inspired t-shirt with a soft, worn-in feel and retro graphics.",
    price: 44.99,
    discount: 0,
    rating: 4,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "red"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "vintage",
  },
  {
    id: "4",
    name: "Prism Premium Tee",
    description: "Our premium t-shirt made from the finest materials for ultimate comfort.",
    price: 59.99,
    discount: 15,
    rating: 5,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "blue", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    category: "premium",
  },
  {
    id: "5",
    name: "Prism Slim Fit Tee",
    description: "A slim-fit t-shirt designed to accentuate your physique with style.",
    price: 42.99,
    discount: 0,
    rating: 4,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "blue"],
    sizes: ["xs", "s", "m", "l"],
    category: "slim-fit",
  },
  {
    id: "6",
    name: "Prism Oversized Tee",
    description: "An oversized t-shirt with a relaxed fit for maximum comfort and style.",
    price: 47.99,
    discount: 0,
    rating: 4,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "red"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "oversized",
  },
  {
    id: "7",
    name: "Prism Limited Edition Tee",
    description: "A limited edition t-shirt featuring exclusive designs and premium quality.",
    price: 69.99,
    discount: 0,
    rating: 5,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white"],
    sizes: ["s", "m", "l"],
    isNew: true,
    category: "limited",
  },
  {
    id: "8",
    name: "Prism Essential Tee",
    description: "An essential t-shirt for your wardrobe, combining comfort and durability.",
    price: 34.99,
    discount: 5,
    rating: 4,
    image: "/placeholder.svg?height=600&width=600",
    colors: ["black", "white", "blue", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    category: "essential",
  },
]

export function getProductById(id: string): Product | undefined {
  return featuredProducts.find((product) => product.id === id)
}

export function getRelatedProducts(id: string): Product[] {
  // Exclude the current product and return up to 4 related products
  return featuredProducts.filter((product) => product.id !== id).slice(0, 4)
}

