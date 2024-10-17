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
      return res.status(400).json({ error: "Quantity must be type of number" });
    }
    if (quantity.length < 3) {
      return res.status(400).json({ error: "Quantity must three words" });
    }
    if (!price) {
      return res.status(400).json({ error: "price Not be Empty" });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ error: "price must be type of number" });
    }
    if (price.length < 3) {
      return res.status(400).json({ error: "price must three words" });
    }
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(400).json({ error: "Product not Found" });
    }
    console.log("Product Quantity ", product.quantity);
    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ error: `Quantity exceed available is ${product.quantity}` });
    } else {
      product.quantity = product.quantity - quantity;
      product.sales = product.sales + quantity;
      const UpdatedOrder = await product.save();
      if (!UpdatedOrder) {
        return res.status(400).json({ error: "Error while Updating Quantity" });
      }
    }
    let totalamount = quantity * price;
    console.log(`Level 0`);
    const Ordered = await Order.create({
      price,
      quantity,
      totalamount,
      status,
      customer,
      ProductId,
    });
    console.log(Order)
    if (Ordered) {
      return res.status(400).json({ message: "Order Successful", Ordered });
    } else {
      return res.status(400).json({ error: `Error while store in db,error` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Failed while save in db ${error}` });
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
