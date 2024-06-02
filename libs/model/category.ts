import mongoose, { Document, Schema, Model } from "mongoose";

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ICategory extends Document {
  name: string;
  description: string;
}

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
