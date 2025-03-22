// lib/models/transaction.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "INR" },
  status: {
    type: String,
    required: true,
    enum: ["completed", "failed"],
    default: "completed",
  },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
