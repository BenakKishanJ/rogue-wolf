// lib/models/product.ts
import mongoose, { Document, Model, Types } from "mongoose";

// Define the Product data interface
export interface IProductData {
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Product document interface
export interface IProduct extends Document, IProductData {
  _id: Types.ObjectId; // Explicitly declare _id
}

// Define the schema without an explicit type
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    images: { type: [[String]], required: true },
    designImage: { type: String, required: true },
    colors: { type: [String], required: true },
    sizes: { type: [String], required: true },
    isNew: { type: Boolean, default: false },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true, // Suppress the isNew warning
  },
);

// Export the model with explicit typing
const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
