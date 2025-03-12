import type { Product } from "./types";

export const featuredProducts: Product[] = [
  {
    id: "3",
    name: "EPIC_MODE_ON",
    description:
      "Ignite your passion and embrace bold challenges with this Roguewolf tee. Whether you're chasing dreams, pushing limits, or making a difference, let this be your call to action—it's time to do something epic!",
    price: 999,
    discount: 0,
    rating: 4,
    image: "EPIC_MODE_ON.png",
    colors: ["black", "white", "grey"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    id: "4",
    name: "LONE_ALPHA",
    description:
      "Boldly outlined in red, the wolf represents untamed strength and resilience. With Roguewolf on either side, this tee is a tribute to those who lead with courage and follow their own instinct, standing apart from the pack.",
    price: 999,
    discount: 0,
    rating: 4.5,
    image: "LONE_ALPHA.png",
    colors: ["black", "white", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    id: "5",
    name: "THE_MIGHTY_BEAST",
    description:
      "Unleash the power within with this fierce design featuring a ferocious wolf. 'The Mighty Beast' embodies raw strength, primal energy, and an unbreakable spirit—perfect for those who embrace their wild side and face every challenge head-on.",
    price: 999,
    discount: 0,
    rating: 4.3,
    image: "THE_MIGHTY_BEAST.png",
    colors: ["black", "grey", "blue"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    id: "6",
    name: "VINTAGE_APPAREL",
    description:
      "Discover the beauty of the wild with this elegantly designed wolf t-shirt. Featuring a graceful depiction of a wolf in intricate detail, this tee symbolizes wisdom, loyalty, and the spirit of nature. Perfect for those who appreciate artistry and the elegance of the untamed, it’s a stylish statement for any occasion.",
    price: 999,
    discount: 0,
    rating: 4.6,
    image: "VINTAGE_APPAREL.png",
    colors: ["black", "white", "beige"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: false,
    category: "vintage-collection",
  },
  {
    id: "7",
    name: "THE_ORIGINALS",
    description:
      "Celebrate your unique spirit with our Originals T-shirt, designed for those who dare to be different. Crafted from ultra-soft, breathable fabric, this tee offers all-day comfort while showcasing a timeless design. Featuring a minimalist logo on the chest and a distinctive emblem on the back, it embodies authenticity and creativity. Whether you're dressing it up or keeping it casual, the Originals Tee is the perfect canvas for self-expression. Wear it with pride and make your mark in a world of trends!",
    price: 799,
    discount: 0,
    rating: 4.2,
    image: "THE_ORIGINALS-1.png",
    colors: ["black", "white", "navy"],
    sizes: ["s", "m", "l", "xl"],
    isNew: false,
    category: "rogue-originals",
  },
];

export function getProductById(id: string): Product | undefined {
  return featuredProducts.find((product) => product.id === id);
}

export function getRelatedProducts(id: string): Product[] {
  // Exclude the current product and return up to 4 related products
  return featuredProducts.filter((product) => product.id !== id).slice(0, 4);
}
