// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "../../../../lib/mongodb";
import Transaction from "../../../../lib/models/transaction";
import mongoose, { Types } from "mongoose";

// Define interfaces for Transaction and its nested structures
interface TransactionItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
}

interface DeliveryDetails {
  address: string;
  pincode: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  deliveryNote?: string;
  name: string;
}

interface Transaction {
  _id: Types.ObjectId;
  userId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "completed" | "failed" | "pending";
  items: TransactionItem[];
  deliveryDetails: DeliveryDetails;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  name: string;
  designImage?: string;
  images?: string[][];
}

interface EnrichedTransactionItem extends TransactionItem {
  product?: Product | null;
}

interface EnrichedTransaction {
  _id: string;
  userId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "completed" | "failed" | "pending";
  items: EnrichedTransactionItem[];
  deliveryDetails: DeliveryDetails;
  createdAt: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection;

    // Fetch user role from MongoDB
    const user = await db
      .collection("users")
      .findOne({ _id: new mongoose.Types.ObjectId(session.user.id) });
    if (!user || !["admin", "superadmin"].includes(user.role || "customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch transactions with lean(), cast to unknown, then to Transaction[]
    const transactionsRaw = await Transaction.find({}).lean();
    const transactions = transactionsRaw as unknown as Transaction[];

    // Enrich transactions with product details
    const enrichedTransactions: EnrichedTransaction[] = await Promise.all(
      transactions.map(async (transaction) => {
        const itemsWithProducts: EnrichedTransactionItem[] = await Promise.all(
          transaction.items.map(async (item: TransactionItem) => {
            const product = await db
              .collection("products")
              .findOne({ _id: new mongoose.Types.ObjectId(item.productId) });
            return {
              ...item,
              product: product
                ? {
                    name: product.name,
                    designImage: product.designImage,
                    images: product.images?.[0] || [],
                  }
                : null,
            };
          }),
        );
        return {
          ...transaction,
          _id: transaction._id.toString(),
          userId: transaction.userId.toString(),
          items: itemsWithProducts,
          createdAt: transaction.createdAt.toISOString(),
        };
      }),
    );

    return NextResponse.json(enrichedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
