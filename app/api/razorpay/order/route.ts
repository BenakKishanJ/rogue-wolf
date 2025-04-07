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
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, cartItems, deliveryDetails } = await request.json();
  console.log("Order - Received deliveryDetails:", deliveryDetails); // Debug
  if (!amount || amount <= 0 || !cartItems?.length || !deliveryDetails) {
    return NextResponse.json(
      { error: "Invalid amount, cart, or delivery details" },
      { status: 400 },
    );
  }

  try {
    const userIdShort = session.user.id.slice(0, 10);
    const timestamp = Date.now().toString().slice(-6);
    const receipt = `r_${userIdShort}_${timestamp}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes: {
        userId: session.user.id,
        cartItems: JSON.stringify(cartItems),
        deliveryDetails: JSON.stringify(deliveryDetails),
      },
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
