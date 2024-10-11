import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addCateogory, deleteCategory, getCategory, UpdateCategory } from "../controllers/category.controller.js";
const router = Router();
router.route("/Add").post(authMiddleware,addCateogory)
router.route("/Get").get(getCategory)
router.route("/Delete").delete(authMiddleware,deleteCategory)
router.route("/Update").put(authMiddleware,UpdateCategory)
export default router;
