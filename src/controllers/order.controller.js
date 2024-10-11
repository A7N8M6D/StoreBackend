import { Category } from "../models/category.model.js";
/*
 
 
-----------------        Add Order        -----------------


*/
const addOrder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      console.log("Level 1");
      return res.status(400).json({ error: "Name is required" });
    }
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be in string" });
    }
    if (name.length < 3) {
      return res.status(400).json({ error: "Name Length short must be 3" });
    }
    const ExistedCategory = await Category.findOne({ name });
    if (ExistedCategory) {
      return res
        .status(400)
        .json({ error: `Category with this Name already Exist` });
    }
    const CategoryAdd = await Category.create({ name });
    console.log(CategoryAdd);
    if (CategoryAdd) {
      return res.status(200).json({ message: "Category Added", CategoryAdd });
    } else {
      return res.status(400).json({ error: "Failed to create" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed while save in db" });
  }
};
/*
 
 
-----------------        Get All Order        -----------------


*/
const getallOrder = async (req, res) => {
  try {
    const AllCategory = await Category.find();
    if (AllCategory) {
      res
        .status(200)
        .json({ message: "Successfully Fetched Categories", AllCategory });
    }
  } catch (error) {
    res.status(200).json({ message: `Failed to Fetched Categories ${error}` });
  }
};
/*
 
 
-----------------        Get  Order        -----------------


*/
const getOrder = async (req, res) => {
  try {
    const AllCategory = await Category.find();
    if (AllCategory) {
      res
        .status(200)
        .json({ message: "Successfully Fetched Categories", AllCategory });
    }
  } catch (error) {
    res.status(200).json({ message: `Failed to Fetched Categories ${error}` });
  }
};
/*
 
 
-----------------        Delete  Order        -----------------


*/
const deleteOrder = async (req, res) => {
    try {
        const {CategoryId}=req.query
      const deleteCategory = await Category.findByIdAndDelete(CategoryId);
      if (deleteCategory) {
        res
          .status(200)
          .json({ message: "Successfully Delete Categories"});
      }
    } catch (error) {
      res.status(200).json({ message: `Failed to Delete Categories ${error}` });
    }
  };
/*
 
 
-----------------        Update  Order        -----------------


*/
const UpdateOrder = async (req, res) => {
    try {
        const {CategoryId}=req.query
        const {name}=req.body
      const category = await Category.findById(CategoryId);
      if (!Category) {
        res
          .status(400)
          .json({ message: "Category not Exist "});
      }
      category.name=name;
      const SaveCategory=await category.save();
      if(SaveCategory)
      {
        res
        .status(200)
        .json({ message: "Category Updated ",SaveCategory});
      }
    } catch (error) {
      res.status(200).json({ message: `Failed to Delete Categories ${error}` });
    }
  };
export { addOrder, getallOrder ,getOrder ,deleteOrder,UpdateOrder};
