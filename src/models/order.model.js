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
      enum: ["Pending","Accepted","Processed", "Shipped", "Delivered"],
      default: "Pending",
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
export const Order=mongoose.model("Order",orderSchema)
