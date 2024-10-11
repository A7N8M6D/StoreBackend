import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addOrder, deleteOrder, getallOrder, getOrder, UpdateOrder } from "../controllers/order.controller.js";
import { deleteCategory } from "../controllers/category.controller.js";
const router = Router();
router.route("/Add").post(authMiddleware,addOrder)
router.route("/Getall").get(authMiddleware,getallOrder)
router.route("/Get").get(authMiddleware,getOrder)
router.route("/Delete").delete(authMiddleware,deleteOrder)
router.route("/Update").put(authMiddleware,UpdateOrder)
export default router;
