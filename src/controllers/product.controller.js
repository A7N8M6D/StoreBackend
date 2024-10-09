import { parse } from "dotenv";
import Product from "../models/product.model.js";


const addProduct = async (req, res) => {
  try {
    console.log(`Product Add Controller`);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const images= req.files.images.map((file) => file.path);
    console.log(`Images ${images[0]}`);
    let {brand,quantity,price,category}=req.body;
    quantity= parseInt(quantity, 10)
    price=parseFloat(price)
    parseInt(req.body.quantity, 10)
    console.log(`brand=${brand},quantity=${quantity} ${typeof quantity},price=${price},category=${category}`)
    if (!brand) {
        return res.status(400).json({ error: "Brand is required" });
      }
      
      if (typeof brand !== "string") {
        return res.status(400).json({ error: "Brand must be a string" });
      }
      
      // Check for the minimum length of the brand (if you want at least 2 characters)
      if (brand.length < 2) {
        return res.status(400).json({ error: "Brand must contain at least two characters" });
      } 
 //Quantity Validation
 if (!quantity) {
    return res.status(400).json({ error: "Quantity is required" });
  }
  
  if (typeof quantity !== "number") {
    return res.status(400).json({ error: "Quantity must be a Number" });
  }
  
  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (quantity.length < 1) {
    return res.status(400).json({ error: "Quantity must contain at least two Number" });
  } 
  
  //Price Validation
 if (!price) {
    return res.status(400).json({ error: "Price is required" });
  }
  
  if (typeof price !== "number") {
    return res.status(400).json({ error: "Price must be a Number" });
  }
  
  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (price.length < 1) {
    return res.status(400).json({ error: "Price must contain at least two Number" });
  } 
  //Category Validation
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }
  
  if (typeof category !== "string") {
    return res.status(400).json({ error: "Category must be a String" });
  }
  
  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (category.length < 3) {
    return res.status(400).json({ error: "Category must contain at least two word" });
  } 
  const AddProduct=await Product.create({
    brand,
    images,
    category,
    price,
    quantity
  })
  if(AddProduct)
  {
    res.status(200).json({message:"Product added Successful",AddProduct})
  }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error Wile to save data in database ${error}` });
  }
};

export { addProduct };
