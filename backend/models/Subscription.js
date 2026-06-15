import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userUid: {
      type: String,
      required: true,
      index: true,
    },
    originalOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    originalOrderNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "completed", "cancelled", "paused"],
    },
    planName: {
      type: String,
      required: true,
    },
    months: {
      type: Number,
      required: true,
    },
    currentDeliveryCount: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true },
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        weight: { type: String, required: true },
        qty: { type: Number, required: true },
        customization: { type: String, default: null },
        image: { type: String, default: null },
      },
    ],
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    lastDeliveryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextDeliveryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
