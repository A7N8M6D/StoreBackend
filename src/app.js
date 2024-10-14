import express from "express";
import cors from "cors";
import { limit } from "./constants.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static("public"))
app.use(express.json({ limit }));

app.use(express.urlencoded({ extended: true, limit }));
app.use(cookieParser())
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import managerRouter from "./routes/manager.routes.js";
import couponRouter from "./routes/manager.routes.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/manager", managerRouter);
export default app;
