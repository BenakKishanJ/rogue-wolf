// app/api/razorpay/order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, cartItems } = await request.json();
  if (!amount || amount <= 0 || !cartItems?.length) {
    return NextResponse.json(
      { error: "Invalid amount or cart" },
      { status: 400 },
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${session.user.id}_${Date.now()}`,
      notes: { userId: session.user.id, cartItems: JSON.stringify(cartItems) },
    });
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
