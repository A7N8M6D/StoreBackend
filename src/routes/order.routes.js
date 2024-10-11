import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addOrder, deleteOrder, getallOrder, getOrder, UpdateOrder } from "../controllers/order.controller.js";
import { deleteCategory } from "../controllers/category.controller.js";
const router = Router();
router.route("/Add").post(addOrder)
router.route("/Getall").get(getallOrder)
router.route("/Get").get(getOrder)
router.route("/Delete").delete(deleteOrder)
router.route("/Update").put(UpdateOrder)
export default router;
