// lib/models/transaction.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "INR" },
  status: {
    type: String,
    required: true,
    enum: ["completed", "failed", "pending"],
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
  deliveryDetails: {
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    email: { type: String, required: true },
    deliveryNote: { type: String },
    name: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

TransactionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
