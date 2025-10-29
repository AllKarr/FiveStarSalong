import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    category: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
