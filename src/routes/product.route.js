import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct } from "../controllers/product.controller.js";
const router = Router();
router.route("/Add").post(
  authMiddleware,
  upload.fields([
    {
      name: "images",
      maxCount:8
    }
  ]),addProduct
);
export default router;
