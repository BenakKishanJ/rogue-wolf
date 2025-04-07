// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

async function getUserRoleFromMongoDB(email: string): Promise<string> {
  await connectToDatabase();
  const db = mongoose.connection;
  const user = await db.collection("users").findOne({ email });
  return user?.role || "customer"; // Default to "customer" if not found or no role
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRoleFromMongoDB(session.user.email);
  if (role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = mongoose.connection;
  const users = await db.collection("users").find({}).toArray();
  return NextResponse.json(
    users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    })),
  );
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRoleFromMongoDB(session.user.email);
  if (role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role: newRole } = await req.json();
  if (!["customer", "admin"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const db = mongoose.connection;
  const result = await db
    .collection("users")
    .updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { role: newRole } },
    );

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "User not found or no change" },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Role updated" });
}
