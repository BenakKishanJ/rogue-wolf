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
    // Generate a shorter receipt (max 40 chars)
    const userIdShort = session.user.id.slice(0, 10); // First 10 chars of userId
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const receipt = `r_${userIdShort}_${timestamp}`; // e.g., "r_507f1f77bc_926000" (19 chars)

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt,
      notes: { userId: session.user.id, cartItems: JSON.stringify(cartItems) },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    if (
      error.statusCode === 400 &&
      error.error?.reason === "input_validation_failed"
    ) {
      return NextResponse.json(
        { error: "Invalid order data: " + error.error.description },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
