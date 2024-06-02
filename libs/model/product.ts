import mongoose, { Document, Schema, Model } from "mongoose";
import { ICategory } from "./category"; // Import the ICategory interface

// Define the Variant schema
const variantSchema: Schema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true },
  sku: { type: String, required: true },
});

// Define the Product schema
const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category model
    cost_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    images: { type: [String], required: true },
    variants: { type: [variantSchema], required: true },
    availableQuantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export interface IVariant extends Document {
  size: string;
  color: string;
  quantity: number;
  sku: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: ICategory["_id"]; // Reference to Category's ID
  cost_price: number;
  selling_price: number;
  images: string[];
  variants: IVariant[];
  availableQuantity: number;
}

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
