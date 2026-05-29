import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    suffix: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stat = mongoose.model("Stat", statSchema);
export default Stat;
