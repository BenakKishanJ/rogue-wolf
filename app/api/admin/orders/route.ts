// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Transaction from "../../../../lib/models/transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const password = request.headers.get("X-Admin-Password");
  if (!password) {
    return NextResponse.json(
      { message: "Admin password required" },
      { status: 403 },
    );
  }

  try {
    const storedHash = process.env.ADMIN_PASSWORD_HASH!;
    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid admin password" },
        { status: 403 },
      );
    }

    await connectToDatabase();
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
