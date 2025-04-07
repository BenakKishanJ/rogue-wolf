// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, name, address, pincode, phone } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updateData: {
    name?: string;
    address?: string;
    pincode?: string;
    phone?: string;
  } = {};
  if (name) updateData.name = name;
  if (address) updateData.address = address;
  if (pincode) updateData.pincode = pincode;
  if (phone) updateData.phone = phone;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No data provided to update" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection;
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId as string) },
        { $set: updateData },
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "User data updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await connectToDatabase();
    const db = mongoose.connection;
    const result = await db.collection("users").deleteOne({
      _id: new mongoose.Types.ObjectId(userId as string),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
