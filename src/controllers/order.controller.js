import { Category } from "../models/category.model.js";
import { Order } from "../models/order.model.js";
import Product from "../models/product.model.js";
/*
 
 
-----------------        Add Order        -----------------


*/
const addOrder = async (req, res) => {
  try {
    const { quantity, price, status } = req.body;
    console.log(`quantity=${quantity}, price=${price}, status=${status}`);
    const { ProductId } = req.query;
    let customer = req.user.id;
    console.log(`User= ${customer}`);
    
    if (!quantity) {
      return res.status(400).json({ error: "Quantity must not be empty" });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({ error: "Quantity must be of type number" });
    }
    if (quantity < 1) { // Check if quantity is less than 1
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    if (!price) {
      return res.status(400).json({ error: "Price must not be empty" });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ error: "Price must be of type number" });
    }
    
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    console.log("Product Quantity ", product.quantity);
    
    if (product.quantity < quantity) {
      return res.status(400).json({ error: `Quantity exceeds available stock of ${product.quantity}` });
    }

    // Update the product's quantity and sales
    product.quantity -= quantity;
    product.sales += quantity;

    // If quantity reaches zero, delete the product
    if (product.quantity === 0) {
      await Product.deleteOne({ _id: ProductId }); // Delete the product
      console.log(`Product ${ProductId} deleted as its quantity reached zero.`);
    } else {
      const updatedProduct = await product.save();
      if (!updatedProduct) {
        return res.status(400).json({ error: "Error while updating quantity" });
      }
    }

    let totalamount = quantity * price;
    const ordered = await Order.create({
      price,
      quantity,
      totalamount,
      status,
      customer,
      ProductId,
    });

    console.log(ordered);
    if (ordered) {
      return res.status(200).json({ message: "Order successful", ordered });
    } else {
      return res.status(400).json({ error: "Error while storing in database" });
    }
  } catch (error) {
    return res.status(500).json({ error: `Failed while saving in database: ${error}` });
  }
};

/*
 
 
-----------------        Get All Order        -----------------


*/
const getallOrder = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    const page = parseInt(req.query.page || 1);
    const limit = 12;
    const skip = (page - 1) * limit;

    // Apply status filter if provided
    if (status) {
      filter.status = status;
    }

    console.log(filter);

    // Fetch orders based on filter
    const allOrders = await Order.find(filter).skip(skip).limit(limit).exec();
    const AllPages = await Order.countDocuments();
    const TotalPages = Math.ceil(AllPages / limit);
    if (allOrders.length > 0) {
      return res.status(200).json({
        message: "Successfully Fetched Orders",
        orders: allOrders,
        TotalPages: TotalPages,
      });
    } else {
      return res.status(404).json({ error: "No orders found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to Fetch Orders: ${error.message}` });
  }
};

/*
 
 
-----------------        Get  Order        -----------------


*/
const getOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = 12;
    const skip = (page - 1) * limit;
    let customer = req.user.id;
    const order = await Order.find({ customer: customer })
      .skip(skip)
      .limit(limit)
      .exec();
    const AllPages = await Order.countDocuments();
    const TotalPages = Math.ceil(AllPages / limit);
    if (order) {
      return res.status(200).json({
        message: "Successfully Fetched Order",
        order,
        TotalPages: TotalPages,
      });
    } else {
      return res.status(404).json({ error: "No orders found" });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ message: `Failed to Fetched Order ${error}` });
  }
};
/*
 
 
-----------------        Delete  Order        -----------------


*/
const deleteOrder = async (req, res) => {
  try {
    const { OrderId } = req.query;
    const order = await Order.findById(OrderId);
    if (order.status === "Pending" || order.status === "Accepted") {
      const deleteOrder = await Order.findByIdAndDelete(OrderId);
      if (deleteOrder) {
        res.status(200).json({ message: "Successfully Delete Order" });
      } else {
        res.status(2400).json({ message: "Failed while deleting Order" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Order in Proccessing State Not permit to delete" });
    }
  } catch (error) {
    res.status(200).json({ message: `Failed to Delete Order ${error}` });
  }
};
/*
 
 
-----------------        Update  Order        -----------------


*/
const UpdateOrder = async (req, res) => {
  try {
    const { OrderId } = req.query;
    console.log(`Order Id ${OrderId}`);
    const { quantity, status } = req.body;

    const order = await Order.findById(OrderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update quantity if status is 'Pending'
    if (quantity && order.status === "Pending") {
      order.quantity = quantity;
    }else{
      return res.status(400).json({error:"Please wait! Product On the way"})
    }

    // Sequential status updates
    if (status !== "" && status) {
      if (order.status === "Pending" && status === "Accepted") {
        order.status = "Accepted";
      } else if (order.status === "Accepted" && status === "Processed") {
        order.status = "Processed";
      } else if (order.status === "Processed" && status === "Shipped") {
        order.status = "Shipped";
      } else if (order.status === "Shipped" && status === "Delivered") {
        order.status = "Delivered";
      } else {
        return res.status(400).json({
          message: `Invalid status update. Current status is ${order.status}`,
        });
      }
    }
    const updatedOrder = await order.save();
    if (updatedOrder) {
      return res
        .status(200)
        .json({ message: "Order updated successfully", updatedOrder });
    } else {
      return res.status(400).json({ message: "Failed to update order" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error updating order: ${error}` });
  }
};

export { addOrder, getallOrder, getOrder, deleteOrder, UpdateOrder };
