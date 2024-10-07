import mongoose, { model, Schema } from "mongoose";
const productSchema = new Schema(
  {
    images: {
      type: [String],
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
    quantity: {
      type: String,
      require: true,
    },
    images: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    feedback: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
        Comment: {
          type: String,
          require: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(productSchema, "Product");
