import { parse } from "dotenv";
import Product from "../models/product.model.js";

/*
 
 
-----------------        Product Added        -----------------


*/
const addProduct = async (req, res) => {
  try {
    console.log(`Product Add Controller`);
    const User = req.user.id;
    console.log(`User ${User}`)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const images = req.files.images.map((file) => file.path);
    console.log(`Images ${images[0]}`);
    let { brand, quantity, price, category } = req.body;
    quantity = parseInt(quantity, 10);
    price = parseFloat(price);
    parseInt(req.body.quantity, 10);
    console.log(
      `brand=${brand},quantity=${quantity} ${typeof quantity},price=${price},category=${category}`
    );
    if (!brand) {
      return res.status(400).json({ error: "Brand is required" });
    }

    if (typeof brand !== "string") {
      return res.status(400).json({ error: "Brand must be a string" });
    }

    // Check for the minimum length of the brand (if you want at least 2 characters)
    if (brand.length < 2) {
      return res
        .status(400)
        .json({ error: "Brand must contain at least two characters" });
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
      return res
        .status(400)
        .json({ error: "Quantity must contain at least two Number" });
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
      return res
        .status(400)
        .json({ error: "Price must contain at least two Number" });
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
      return res
        .status(400)
        .json({ error: "Category must contain at least two word" });
    }
    const AddProduct = await Product.create({
      brand,
      images,
      category,
      price,
      quantity,
      user: User,
    });
    if (AddProduct) {
      res.status(200).json({ message: "Product added Successful", AddProduct });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error Wile to save data in database ${error}` });
  }
};

/*
 
 
-----------------        Get Product by Id         -----------------


*/
const getProductbyId = async (req, res) => {
  try {
    
    const { category, search, brand } = req.query;
    const page =parseInt(req.query.page) ||1
    const limit=10;
    const skip=(page-1)*limit;
    console.log(`category=${category} search=${search}, brand=${brand}`);
    let filter = {};
    if (category.trim() !== "") {
      console.log("category");
      if (typeof category != "string") {
        return res.status(400).json({ message: "Category Must be string" });
      }
      filter.category = category;
    }
    if (brand.trim() !== "") {
      console.log("brand");
      if (typeof brand != "string") {
        return res.status(400).json({ message: "Category Must be string" });
      }
      filter.brand = brand;
    }
    if (search.trim() !== "") {
      console.log("search");
      if (typeof search != "string") {
        return res.status(400).json({ message: "Category Must be string" });
      }
      filter.Name = { $regex: search, $options: "i" };
    }
    // console.log(User);
    console.log("filter", filter);
    const UserProducts = await Product.find(filter).skip(skip).limit(limit).exec();

    const TotalProducts=await Product.countDocuments(filter);
    const TotalPages=Math.ceil(TotalProducts/limit)
    if (UserProducts.length > 0) {
      return res.status(200).json({
        message: "Products retrieved successfully",
        UserProducts,
        TotalPages:TotalPages
      });
    } else {
      return res.status(404).json({
        message: "No products found",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to Fetch data from the Data base" });
  }
};
/*
 
 
-----------------        Delete Product         -----------------


*/
const deleteProductbyId = async (req , res) => {
  try {
    const { ProductId } = req.query;
    console.log(`Product Id ${ProductId}`)
    const User = req.user.id;
    const ProductById = await Product.findById(ProductId);
    if (!ProductById) {
      return res.status(400).json({ message: "Product Not Found" });
    }
    console.log(`User ${User}`)
    console.log(`Product ${ProductById.user}`);
   if(JSON.stringify( User) !== JSON.stringify( ProductById.user))
   {
    return res.status(400).json({ message: "Product not owned by you" });
   }
   const ProductDeleted=await Product.findByIdAndDelete(ProductId)
   if(ProductDeleted)
   {

     return res.status(200).json({ message: "Product deleted" });
   }
   else{

    return res.status(500).json({ message: "Failed to deleted" });
  }
  } catch (error) {
    return res.status(200).json({ message: "Failed to Data in the Data base" });
  }
};
export { addProduct, getProductbyId,deleteProductbyId };
