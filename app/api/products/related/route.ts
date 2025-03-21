// app/api/products/related/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb"; // Adjust path
import Product from "../../../../lib/models/products"; // Adjust path

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  try {
    await connectToDatabase();
    const products = await Product.find({ category, _id: { $ne: id } })
      .limit(4)
      .lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 },
    );
  }
}
