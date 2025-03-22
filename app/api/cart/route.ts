import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path
import Cart from "../../../lib/models/cart"; // Adjust path
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId: session.user.id });
    return NextResponse.json(cart || { items: [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity, color, size } = await request.json();

  try {
    await connectToDatabase();
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      cart = new Cart({ userId: session.user.id, items: [] });
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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, color, size } = await request.json();

  if (!productId || !color || !size) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item: any) =>
        !(
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
        ),
    );

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 },
    );
  }
}
