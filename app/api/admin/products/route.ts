// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "@/lib/models/products";
import { uploadImageToBackblaze } from "../../../../lib/backblaze";
import mongoose from "mongoose";

// Add this interface definition
interface IProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  images: string[][];
  designImage: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  category: string;
}

// Helper function to fetch user role from MongoDB
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
  if (!["admin", "superadmin"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await Product.find({});
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRoleFromMongoDB(session.user.email);
  if (!["admin", "superadmin"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat((formData.get("discount") as string) || "0");
  const colors = JSON.parse(formData.get("colors") as string);
  const sizes = JSON.parse(formData.get("sizes") as string);
  const category = formData.get("category") as string;
  const designImageFile = formData.get("designImage") as File;
  const imageFiles = formData.getAll("images") as File[];

  // Validate PNG for designImage
  if (designImageFile.type !== "image/png") {
    return NextResponse.json(
      { error: "Design image must be PNG" },
      { status: 400 },
    );
  }

  // Upload design image
  const designImageBuffer = Buffer.from(await designImageFile.arrayBuffer());
  const designImageUrl = await uploadImageToBackblaze(
    designImageBuffer,
    designImageFile.name,
    "image/png",
  );

  // Upload images for each color (ensure PNG)
  const images: string[][] = await Promise.all(
    colors.map(async (_color: string, index: number) => {
      const colorImages = imageFiles.filter((file) =>
        file.name.startsWith(`color${index}-`),
      );
      if (colorImages.some((file) => file.type !== "image/png")) {
        throw new Error(`All images for color ${index} must be PNG`);
      }
      return Promise.all(
        colorImages.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return uploadImageToBackblaze(buffer, file.name, "image/png");
        }),
      );
    }),
  );

  const product = new Product({
    name,
    description,
    price,
    discount,
    rating: 0,
    images,
    designImage: designImageUrl,
    colors,
    sizes,
    isNew: true,
    category,
  });

  await product.save();
  return NextResponse.json(
    { message: "Product added", product },
    { status: 201 },
  );
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRoleFromMongoDB(session.user.email);
  if (!["admin", "superadmin"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const formData = await req.formData();
  const productId = formData.get("productId") as string;
  const updates: Partial<Omit<IProductData, "_id">> = {};

  // Handle fields
  if (formData.get("name")) updates.name = formData.get("name") as string;
  if (formData.get("description"))
    updates.description = formData.get("description") as string;
  if (formData.get("price"))
    updates.price = parseFloat(formData.get("price") as string);
  if (formData.get("discount"))
    updates.discount = parseFloat(formData.get("discount") as string);
  if (formData.get("colors"))
    updates.colors = JSON.parse(formData.get("colors") as string);
  if (formData.get("sizes"))
    updates.sizes = JSON.parse(formData.get("sizes") as string);
  if (formData.get("category"))
    updates.category = formData.get("category") as string;

  // Handle designImage update
  const designImageFile = formData.get("designImage") as File;
  if (designImageFile) {
    if (designImageFile.type !== "image/png") {
      return NextResponse.json(
        { error: "Design image must be PNG" },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await designImageFile.arrayBuffer());
    updates.designImage = await uploadImageToBackblaze(
      buffer,
      designImageFile.name,
      "image/png",
    );
  }

  // Handle images update (optional)
  const imageFiles = formData.getAll("images") as File[];
  if (imageFiles.length > 0) {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    updates.images = await Promise.all(
      (updates.colors || existingProduct.colors).map(
        async (_color: string, index: number) => {
          const colorImages = imageFiles.filter((file) =>
            file.name.startsWith(`color${index}-`),
          );
          if (colorImages.some((file) => file.type !== "image/png")) {
            throw new Error(`All images for color ${index} must be PNG`);
          }
          return Promise.all(
            colorImages.map(async (file) => {
              const buffer = Buffer.from(await file.arrayBuffer());
              return uploadImageToBackblaze(buffer, file.name, "image/png");
            }),
          );
        },
      ),
    );
  }

  const product = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product updated", product });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRoleFromMongoDB(session.user.email);
  if (!["admin", "superadmin"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { productId } = await req.json();
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted" });
}
