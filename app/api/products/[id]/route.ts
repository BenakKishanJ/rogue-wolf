// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product, { IProduct } from "../../../../lib/models/products";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const product: IProduct | null = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
