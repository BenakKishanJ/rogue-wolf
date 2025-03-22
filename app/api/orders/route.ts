// app/api/orders/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path
import Transaction from "../../../lib/models/transaction"; // Adjust path
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const transactions = await Transaction.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
