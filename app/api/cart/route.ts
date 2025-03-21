// app/api/cart/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path
import Cart from "../../../lib/models/cart"; // Adjust path

export async function POST(request: Request) {
  const { userId, productId, quantity, color, size } = await request.json();

  try {
    await connectToDatabase();
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, color, size });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Item added to cart" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });
    return NextResponse.json(cart || { items: [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}
