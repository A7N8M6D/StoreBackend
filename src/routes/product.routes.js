import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, deleteProductbyId, getProductbyId, updateProduct } from "../controllers/product.controller.js";
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

router.route("/Get").get(getProductbyId)
router.route("/Delete").delete(authMiddleware,deleteProductbyId)
router.route("/Update").put(authMiddleware,  upload.fields([
  {
    name: "images",
    maxCount:8
  }
]),updateProduct)
export default router;
