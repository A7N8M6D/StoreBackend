import { Router } from "express";
import { deleteUser, forgetEmail_password, getallUser, getProfile, registerUser, signinUser, UpdateUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.route('/SignUp').post(registerUser)
router.route('/SignIn').post(signinUser)
router.route('/GetProfile').get( authMiddleware, getProfile)
router.route('/UserDeleted').delete( authMiddleware, deleteUser)
router.route('/GetAll').get( authMiddleware,getallUser)
router.route('/UpdateUser').put( authMiddleware,UpdateUser)
router.route("/ForgetUser").put(forgetEmail_password)
export default router;
