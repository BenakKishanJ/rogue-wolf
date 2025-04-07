// app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path based on your structure
import Product, { IProductData } from "../../../lib/models/products"; // Adjust path

const products: IProductData[] = [
  {
    name: "EPIC_MODE_ON",
    description:
      "Ignite your passion and embrace bold challenges with this Roguewolf tee. Whether you're chasing dreams, pushing limits, or making a difference, let this be your call to action—it's time to do something epic!",
    price: 999,
    discount: 0,
    rating: 4,
    images: [
      [
        "/images/EPIC_MODE_ON_black.png",
        "/images/EPIC_MODE_ON_front_black.png",
        "/images/EPIC_MODE_ON_back_black.png",
        "/images/EPIC_MODE_ON_side_black.png",
      ],
      [
        "/images/EPIC_MODE_ON_white.png",
        "/images/EPIC_MODE_ON_front_white.png",
        "/images/EPIC_MODE_ON_back_white.png",
        "/images/EPIC_MODE_ON_side_white.png",
      ],
      [
        "/images/EPIC_MODE_ON_grey.png",
        "/images/EPIC_MODE_ON_front_grey.png",
        "/images/EPIC_MODE_ON_back_grey.png",
        "/images/EPIC_MODE_ON_side_grey.png",
      ],
    ],
    designImage: "/designs/EPIC_MODE_ON_DESIGN.png",
    colors: ["black", "white", "grey"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rogue essentials",
  },
  {
    name: "LONE_ALPHA",
    description:
      "Boldly outlined in red, the wolf represents untamed strength and resilience. With Roguewolf on either side, this tee is a tribute to those who lead with courage and follow their own instinct, standing apart from the pack.",
    price: 999,
    discount: 0,
    rating: 4.5,
    images: [
      [
        "/images/LONE_ALPHA_black.png",
        "/images/LONE_ALPHA_front_black.png",
        "/images/LONE_ALPHA_back_black.png",
        "/images/LONE_ALPHA_side_black.png",
      ],
      [
        "/images/LONE_ALPHA_white.png",
        "/images/LONE_ALPHA_front_white.png",
        "/images/LONE_ALPHA_back_white.png",
        "/images/LONE_ALPHA_side_white.png",
      ],
      [
        "/images/LONE_ALPHA_red.png",
        "/images/LONE_ALPHA_front_red.png",
        "/images/LONE_ALPHA_back_red.png",
        "/images/LONE_ALPHA_side_red.png",
      ],
    ],
    designImage: "/designs/LONE_ALPHA_DESIGN.png",
    colors: ["black", "white", "red"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: true,
    category: "rogue essentials",
  },
  {
    name: "SAVAGE_INSTICT",
    description:
      "Unleash the power within with this fierce design featuring a ferocious wolf. 'The Mighty Beast' embodies raw strength, primal energy, and an unbreakable spirit—perfect for those who embrace their wild side and face every challenge head-on.",
    price: 999,
    discount: 0,
    rating: 4.3,
    images: [
      [
        "/images/SAVAGE_INSTICT_black.png",
        "/images/SAVAGE_INSTICT_front_black.png",
        "/images/SAVAGE_INSTICT_back_black.png",
        "/images/SAVAGE_INSTICT_side_black.png",
      ],
      [
        "/images/SAVAGE_INSTICT_grey.png",
        "/images/SAVAGE_INSTICT_front_grey.png",
        "/images/SAVAGE_INSTICT_back_grey.png",
        "/images/SAVAGE_INSTICT_side_grey.png",
      ],
      [
        "/images/SAVAGE_INSTICT_blue.png",
        "/images/SAVAGE_INSTICT_front_blue.png",
        "/images/SAVAGE_INSTICT_back_blue.png",
        "/images/SAVAGE_INSTICT_side_blue.png",
      ],
    ],
    designImage: "/designs/SAVAGE_INSTICT_DESIGN.png",
    colors: ["black", "grey", "blue"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rogue essentials",
  },
  {
    name: "THE_MIGHTY_BEAST",
    description:
      "Unleash the power within with this fierce design featuring a ferocious wolf. 'The Mighty Beast' embodies raw strength, primal energy, and an unbreakable spirit—perfect for those who embrace their wild side and face every challenge head-on.",
    price: 999,
    discount: 0,
    rating: 4.3,
    images: [
      [
        "/images/THE_MIGHTY_BEAST_black.png",
        "/images/THE_MIGHTY_BEAST_front_black.png",
        "/images/THE_MIGHTY_BEAST_back_black.png",
        "/images/THE_MIGHTY_BEAST_side_black.png",
      ],
      [
        "/images/THE_MIGHTY_BEAST_grey.png",
        "/images/THE_MIGHTY_BEAST_front_grey.png",
        "/images/THE_MIGHTY_BEAST_back_grey.png",
        "/images/THE_MIGHTY_BEAST_side_grey.png",
      ],
      [
        "/images/THE_MIGHTY_BEAST_blue.png",
        "/images/THE_MIGHTY_BEAST_front_blue.png",
        "/images/THE_MIGHTY_BEAST_back_blue.png",
        "/images/THE_MIGHTY_BEAST_side_blue.png",
      ],
    ],
    designImage: "/designs/THE_MIGHTY_BEAST_DESIGN.png",
    colors: ["black", "grey", "blue"],
    sizes: ["s", "m", "l", "xl"],
    isNew: true,
    category: "rogue essentials",
  },
  {
    name: "VINTAGE_APPAREL",
    description:
      "Discover the beauty of the wild with this elegantly designed wolf t-shirt. Featuring a graceful depiction of a wolf in intricate detail, this tee symbolizes wisdom, loyalty, and the spirit of nature. Perfect for those who appreciate artistry and the elegance of the untamed, it's a stylish statement for any occasion.",
    price: 999,
    discount: 0,
    rating: 4.6,
    images: [
      [
        "/images/VINTAGE_APPAREL_black.png",
        "/images/VINTAGE_APPAREL_front_black.png",
        "/images/VINTAGE_APPAREL_back_black.png",
        "/images/VINTAGE_APPAREL_side_black.png",
      ],
      [
        "/images/VINTAGE_APPAREL_white.png",
        "/images/VINTAGE_APPAREL_front_white.png",
        "/images/VINTAGE_APPAREL_back_white.png",
        "/images/VINTAGE_APPAREL_side_white.png",
      ],
      [
        "/images/VINTAGE_APPAREL_beige.png",
        "/images/VINTAGE_APPAREL_front_beige.png",
        "/images/VINTAGE_APPAREL_back_beige.png",
        "/images/VINTAGE_APPAREL_side_beige.png",
      ],
    ],
    designImage: "/designs/VINTAGE_APPAREL_DESIGN.png",
    colors: ["black", "white", "beige"],
    sizes: ["xs", "s", "m", "l", "xl"],
    isNew: false,
    category: "vintage collection",
  },
  {
    name: "THE_ORIGINALS",
    description:
      "Celebrate your unique spirit with our Originals T-shirt, designed for those who dare to be different. Crafted from ultra-soft, breathable fabric, this tee offers all-day comfort while showcasing a timeless design. Featuring a minimalist logo on the chest and a distinctive emblem on the back, it embodies authenticity and creativity. Whether you're dressing it up or keeping it casual, the Originals Tee is the perfect canvas for self-expression. Wear it with pride and make your mark in a world of trends!",
    price: 799,
    discount: 0,
    rating: 4.2,
    images: [
      [
        "/images/THE_ORIGINALS_black.png",
        "/images/THE_ORIGINALS_front_black.png",
        "/images/THE_ORIGINALS_back_black.png",
        "/images/THE_ORIGINALS_side_black.png",
      ],
      [
        "/images/THE_ORIGINALS_white.png",
        "/images/THE_ORIGINALS_front_white.png",
        "/images/THE_ORIGINALS_back_white.png",
        "/images/THE_ORIGINALS_side_white.png",
      ],
      [
        "/images/THE_ORIGINALS_navy.png",
        "/images/THE_ORIGINALS_front_navy.png",
        "/images/THE_ORIGINALS_back_navy.png",
        "/images/THE_ORIGINALS_side_navy.png",
      ],
    ],
    designImage: "/designs/THE_ORIGINALS_DESIGN.png",
    colors: ["black", "white", "navy"],
    sizes: ["s", "m", "l", "xl"],
    isNew: false,
    category: "rogue originals",
  },
  // Adding a new sample product with the same structure
  {
    name: "WOLF_PACK",
    description:
      "Join the pack with this exclusive design featuring a wolf pack in motion. Symbolizing unity, strength, and teamwork, this tee is perfect for those who value loyalty and camaraderie.",
    price: 899,
    discount: 10,
    rating: 4.8,
    images: [
      [
        "/images/WOLF_PACK_green.png",
        "/images/WOLF_PACK_front_green.png",
        "/images/WOLF_PACK_back_green.png",
        "/images/WOLF_PACK_side_green.png",
      ],
      [
        "/images/WOLF_PACK_blue.png",
        "/images/WOLF_PACK_front_blue.png",
        "/images/WOLF_PACK_back_blue.png",
        "/images/WOLF_PACK_side_blue.png",
      ],
      [
        "/images/WOLF_PACK_charcoal.png",
        "/images/WOLF_PACK_front_charcoal.png",
        "/images/WOLF_PACK_back_charcoal.png",
        "/images/WOLF_PACK_side_charcoal.png",
      ],
    ],
    designImage: "/designs/WOLF_PACK_DESIGN.png",
    colors: ["green", "blue", "charcoal"],
    sizes: ["xs", "s", "m", "l", "xl", "xxl"],
    isNew: true,
    category: "limited edition",
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    await Product.deleteMany({}); // Clear existing products
    await Product.insertMany(products);
    return NextResponse.json({
      message: "Database seeded successfully",
      productsInserted: products.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
