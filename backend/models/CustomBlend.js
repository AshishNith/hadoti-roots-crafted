import mongoose from "mongoose";

const customBlendSchema = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    blendType: {
      type: String,
      required: true,
      enum: ["dal", "masala", "ration", "grain"],
    },
    customizationSummary: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomBlend = mongoose.model("CustomBlend", customBlendSchema);
export default CustomBlend;
