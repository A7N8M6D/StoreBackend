import { parse } from "dotenv";
import Product from "../models/product.model.js";

import fs from 'fs';
import path from 'path';

/*
 
 
-----------------        Product Added        -----------------


*/

const addProduct = async (req, res) => {
  try {
    console.log(`Product Add Controller`);
    const User = req.user.id;

    // Check for uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const images = req.files.images.map((file) => file.path);
    
    console.log(`User: ${User}`);
    console.log(`Images: ${images[0]}`);

    let { brand, quantity, price, category, name } = req.body;
    quantity = parseInt(quantity, 10);
    price = parseFloat(price);

    console.log(
      `brand=${brand}, quantity=${quantity} ${typeof quantity}, price=${price}, category=${category}`
    );

    // Brand Validation
    if (!brand || typeof brand !== "string" || brand.length < 2) {
      return res.status(400).json({ error: "Brand must be a string with at least 2 characters." });
    }

    // Quantity Validation
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer." });
    }

    // Name Validation
    if (!name || typeof name !== "string" || name.length < 1) {
      return res.status(400).json({ error: "Name is required and must be a string." });
    }

    // Price Validation
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    // Category Validation
    if (!category || typeof category !== "string" || category.length < 3) {
      return res.status(400).json({ error: "Category must be a string with at least 3 characters." });
    }

    // Verify if images exist in the public/temp directory
    const tempDirectory = path.join(__dirname, 'public', 'temp'); // Adjust the path based on your directory structure
    for (const image of images) {
      const imagePath = path.join(tempDirectory, image);
      if (!fs.existsSync(imagePath)) {
        return res.status(400).json({ error: `Image not found: ${image}` });
      }
    }

    // Create Product
    const AddProduct = await Product.create({
      brand,
      images,
      category,
      price,
      name,
      quantity,
      user: User,
    });

    res.status(200).json({ message: "Product added successfully", AddProduct });
  } catch (error) {
    return res.status(500).json({ error: `Error while saving data to database: ${error.message}` });
  }
};



/*
 
 
-----------------        Get Product by Id         -----------------


*/
const getProductbyId = async (req, res) => {
  try {
    const { category, search, brand } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (category.trim() !== "") {
      filter.category = category;
    }
    if (brand.trim() !== "") {
      filter.brand = brand;
    }
    if (search.trim() !== "") {
      filter.Name = { $regex: search, $options: "i" };
    }

    const UserProducts = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const TotalProducts = await Product.countDocuments(filter);
    const TotalPages = Math.ceil(TotalProducts / limit);

    // Convert image paths to full URLs
    const baseUrl = `${req.protocol}://${req.get("host")}/`; // Adjust based on where your images are hosted
    const formattedProducts = UserProducts.map((product) => {
      return {
        ...product._doc, // Spread the original product object
        images: product.images.map((img) => `${baseUrl}/${img.replace(/\\/g, '/')}`) // Replace backslashes and add base URL
      };
    });

    if (UserProducts.length > 0) {
      return res.status(200).json({
        message: "Products retrieved successfully",
        UserProducts: formattedProducts,
        TotalPages,
      });
    } else {
      return res.status(404).json({
        error: "No products found",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to Fetch data from the Data base" });
  }
};

/*
 
 
-----------------        Delete Product         -----------------


*/
const deleteProductbyId = async (req, res) => {
  try {
    const { ProductId } = req.query;
    console.log(`Product Id ${ProductId}`);
    const User = req.user.id;
    const ProductById = await Product.findById(ProductId);
    if (!ProductById) {
      return res.status(400).json({ message: "Product Not Found" });
    }
    console.log(`User ${User}`);
    console.log(`Product ${ProductById.user}`);
    if (JSON.stringify(User) !== JSON.stringify(ProductById.user)) {
      return res.status(400).json({ message: "Product not owned by you" });
    }
    const ProductDeleted = await Product.findByIdAndDelete(ProductId);
    if (ProductDeleted) {
      return res.status(200).json({ message: "Product deleted" });
    } else {
      return res.status(500).json({ message: "Failed to deleted" });
    }
  } catch (error) {
    return res.status(200).json({ message: "Failed to Data in the Data base" });
  }
};
/*
 
 
-----------------        Update Product         -----------------


*/
const updateProduct = async (req, res) => {
  try {
    let { brand, quantity, price, category ,name} = req.body;
    quantity=parseInt(quantity)
    price= parseInt(price)
    const {ProductId}=req.query
    const product=await Product.findById(ProductId)
    if(!product)
    {
       return res.status(400).json({message:"Product Not Found"})
    }
    if(brand) product.brand=brand
    if(quantity) product.quantity=quantity
    if(price) product.price=price
    if(category) product.category=category
    if(name) product.name=name
    if(req.files && req.files.images){
    const images = req.files.images.map((file) => file.path);
    console.log(`Images ${images[0]}`);
    
    product.images=images
    }
    console.log(`Images ${product.images[0]}`)
    const UpdatedProduct=await product.save();
     if(UpdatedProduct)
     {
      return res.status(200).json({ message: `Updated Successful` ,UpdatedProduct});  
     }
  } catch (error) {
    return res.status(500).json({ message: `Failed to Update ${error}` });
  }
};
export { addProduct, getProductbyId, deleteProductbyId, updateProduct };
