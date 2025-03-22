// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb"; // Adjust path
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth"; // Adjust path
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  const { userId, name } = await req.json();

  if (!userId || !name) {
    return NextResponse.json(
      { error: "User ID and name are required" },
      { status: 400 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection; // Use Mongoose's connection object
    const result = await db.collection("users").updateOne(
      { _id: new mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
      { $set: { name } },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Username updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection; // Use Mongoose's connection object
    const result = await db.collection("users").deleteOne({
      _id: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
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
