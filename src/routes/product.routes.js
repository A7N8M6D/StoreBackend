import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { addProduct, deleteProductbyId, getProductbyId, updateProduct } from "../controllers/product.controller.js";
const router = Router();
router.route("/Add").post(
  authMiddleware,
  (req, res, next) => {
    console.log("Before Image Upload");
    next();
  },
  (req, res, next) => {
    upload.fields([{ name: "images", maxCount: 8 }])(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      console.log("After Image Upload");
      next();
    });
  },
  addProduct // Your product handling function
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
