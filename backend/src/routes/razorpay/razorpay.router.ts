import { Router } from "express";
import {
  httpCreateCreateOrder,
  httpVerifyPayment,
} from "./razorpay.controller";

const razorpayRouter = Router();

razorpayRouter.post("/create-order", httpCreateCreateOrder);
razorpayRouter.post("/verify-payments", httpVerifyPayment);

export default razorpayRouter;
