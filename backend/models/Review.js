import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productSlug: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate models during development hot reloads
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
