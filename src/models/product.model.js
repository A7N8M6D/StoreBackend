import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    images: {
      type: [String], // Keeping the array of image URLs
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name:{
      type:String,
      require:true
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  
    feedback: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
      },
    ],
    sales: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      require:true
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate the average rating
productSchema.pre("save", function (next) {
  if (this.feedback.length > 0) {
    const totalRating = this.feedback.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    this.averageRating = totalRating / this.feedback.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Static method to update sales count
productSchema.statics.recordSale = async function (productId) {
  const product = await this.findById(productId);
  if (product) {
    product.sales += 1;
    await product.save();
  }
};

const Product = mongoose.model("Product", productSchema);

export default Product;
