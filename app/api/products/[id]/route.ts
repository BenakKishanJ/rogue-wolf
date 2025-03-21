// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb"; // Adjust path
import Product from "../../../../lib/models/products"; // Adjust path
import { IProduct } from "../../../../lib/models/products"; // Add this import for typing

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // Await params to access id
  try {
    await connectToDatabase();
    const product: IProduct | null = await Product.findById(id).lean();
    return NextResponse.json(product || null);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
