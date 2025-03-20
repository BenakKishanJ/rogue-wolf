// app/api/database/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Product, { IProduct } from "../../../lib/models/products";

export async function GET() {
  try {
    await connectToDatabase();
    const products: IProduct[] = await Product.find({});
    return NextResponse.json({
      total: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch database" },
      { status: 500 },
    );
  }
}
