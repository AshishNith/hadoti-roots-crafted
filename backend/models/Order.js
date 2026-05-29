import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
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
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["upi", "card", "cod"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
