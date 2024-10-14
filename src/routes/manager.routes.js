import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/Add").post(authMiddleware)
router.route("/Get").get()
router.route("/Delete").delete(authMiddleware)
router.route("/Update").put(authMiddleware)
export default router;
