import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    years: {
      type: Number,
      required: true,
      min: 0,
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
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

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
