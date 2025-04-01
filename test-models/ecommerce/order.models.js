import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    orderItems: {
      type: [orderItemSchema]
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"], // enum means string objects that are allowed
      default: "PENDING"
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export const Order = mongoose.model("Order", orderSchema);