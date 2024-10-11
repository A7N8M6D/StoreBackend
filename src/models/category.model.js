import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name:{
            type:String,
            require:true
        }
    },
    {
        timestamps:true
    }
) ;
export const Category=mongoose.model("Category",categorySchema)
