// app/api/products/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Product, { IProduct } from "../../../lib/models/products";

export async function GET() {
  try {
    await connectToDatabase();
    const products: IProduct[] = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
