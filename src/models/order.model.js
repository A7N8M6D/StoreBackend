import mongoose, { mongo, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    totalamount: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["Accepted", "Processed", "Shipped", "Delivered"],
      default: "Accepted",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Order=mongoose.model("Order",orderSchema)
