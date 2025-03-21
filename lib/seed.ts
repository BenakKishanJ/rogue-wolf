// lib/seed.ts
import connectToDatabase from "./mongodb";
import Product, { IProductData } from "./models/products";

const products: IProductData[] = [
  {
    name: "EPIC_MODE_ON",
    description:
      "Ignite your passion and embrace bold challenges with this Roguewolf tee. Whether you're chasing dreams, pushing limits, or making a difference, let this be your call to action—it's time to do something epic!",
    price: 999,
    discount: 0,
    rating: 4,
    images: [
      "/images/EPIC_MODE_ON.png",
      "/images/EPIC_MODE_ON_front.png",
      "/images/EPIC_MODE_ON_back.png",
      "/images/EPIC_MODE_ON_side.png",
    ],
    designImage: "/designs/EPIC_MODE_ON_DESIGN.png",
    colors: ["black", "white", "grey"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    name: "LONE_ALPHA",
    description:
      "Boldly outlined in red, the wolf represents untamed strength and resilience. With Roguewolf on either side, this tee is a tribute to those who lead with courage and follow their own instinct, standing apart from the pack.",
    price: 999,
    discount: 0,
    rating: 4.5,
    images: [
      "/images/LONE_ALPHA_front.png",
      "/images/LONE_ALPHA_back.png",
      "/images/LONE_ALPHA_side.png",
    ],
    designImage: "/designs/LONE_ALPHA_DESIGNS.png",
    colors: ["black", "white", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    name: "THE_MIGHTY_BEAST",
    description:
      "Unleash the power within with this fierce design featuring a ferocious wolf. 'The Mighty Beast' embodies raw strength, primal energy, and an unbreakable spirit—perfect for those who embrace their wild side and face every challenge head-on.",
    price: 999,
    discount: 0,
    rating: 4.3,
    images: [
      "/images/THE_MIGHTY_BEAST_front.png",
      "/images/THE_MIGHTY_BEAST_back.png",
      "/images/THE_MIGHTY_BEAST_side.png",
    ],
    designImage: "/designs/THE_MIGHTY_BEAST_DESIGNS.png",
    colors: ["black", "grey", "blue"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rougue-essentials",
  },
  {
    name: "VINTAGE_APPAREL",
    description:
      "Discover the beauty of the wild with this elegantly designed wolf t-shirt. Featuring a graceful depiction of a wolf in intricate detail, this tee symbolizes wisdom, loyalty, and the spirit of nature. Perfect for those who appreciate artistry and the elegance of the untamed, it’s a stylish statement for any occasion.",
    price: 999,
    discount: 0,
    rating: 4.6,
    images: [
      "/images/VINTAGE_APPAREL_front.png",
      "/images/VINTAGE_APPAREL_back.png",
      "/images/VINTAGE_APPAREL_side.png",
    ],
    designImage: "/designs/VINTAGE_APPAREL_DESIGNS.png",
    colors: ["black", "white", "beige"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: false,
    category: "vintage-collection",
  },
  {
    name: "THE_ORIGINALS",
    description:
      "Celebrate your unique spirit with our Originals T-shirt, designed for those who dare to be different. Crafted from ultra-soft, breathable fabric, this tee offers all-day comfort while showcasing a timeless design. Featuring a minimalist logo on the chest and a distinctive emblem on the back, it embodies authenticity and creativity. Whether you're dressing it up or keeping it casual, the Originals Tee is the perfect canvas for self-expression. Wear it with pride and make your mark in a world of trends!",
    price: 799,
    discount: 0,
    rating: 4.2,
    images: [
      "/images/THE_ORIGINALS_front.png",
      "/images/THE_ORIGINALS_back.png",
      "/images/THE_ORIGINALS_side.png",
    ],
    designImage: "/designs/THE_ORIGINALS-1_DESIGNS.png",
    colors: ["black", "white", "navy"],
    sizes: ["s", "m", "l", "xl"],
    isNew: false,
    category: "rogue-originals",
  },
];

async function seed() {
  await connectToDatabase();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Database seeded with products");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
