import mongoose, { Schema, Document } from "mongoose";

// Interface for a cart item
interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  color: string;
  size: string;
}

// Interface for the cart document
interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for cart items
const cartItemSchema: Schema<ICartItem> = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // References the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensures quantity is at least 1
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

// Schema for the cart
const cartSchema: Schema<ICart> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User collection managed by Auth.js
    required: true,
    unique: true, // One cart per user
  },
  items: [cartItemSchema], // Array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the model
export default mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", cartSchema);
