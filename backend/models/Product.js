import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDesc: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["dals", "masalas", "ration", "hampers", "grains"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: String,
      required: true,
    },
    customizable: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
