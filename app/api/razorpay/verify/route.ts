// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectToDatabase from "../../../../lib/mongodb";
import Transaction from "../../../../lib/models/transaction";
import Cart from "../../../../lib/models/cart";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    userId,
    amount,
    cartItems,
  } = await request.json();

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json(
      { success: false, message: "Invalid payment data" },
      { status: 400 },
    );
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    // Store transaction
    const transaction = new Transaction({
      userId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      currency: "INR",
      status: "completed",
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: item.product.price,
      })),
      createdAt: new Date(),
    });
    await transaction.save();

    // Clear cart after successful payment
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    // Clear cart
    //    await Cart.updateOne({ userId }, { $set: { items: [] } });

    return NextResponse.json(
      { success: true, message: "Payment verified and recorded" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
