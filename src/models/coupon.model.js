import mongoose, { Schema } from "mongoose";
import crypto from "crypto"
import { type } from "os";
const coupounSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      default: () => {
        crypto.randomBytes(4).toString("hex");
      },
    },
    discountValue:{
        type:Number,
        require:true
    },
    minPurchaseAmont:{
        type:Number,
        require:true
    },
    expireDate:{
        type:Date,
        require:true
    },
    isActive:{
        type:Boolean,
        require:true
    }
  },
  {timestamps:true}
);
coupounSchema.methods.isExpired=function(){
    return this.expireDate<new Date();
}
export const Coupon=mongoose.model('Coupon', coupounSchema)