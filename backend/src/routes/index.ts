import { Router } from "express";
import userRouter from "./user/user.router";
import requestRouter from "./request/request.router";
import folderRouter from "./folder/folder.router";
import promptRouter from "./prompt/prompt.router";
import imageRouter from "./image/image.router";
import loggerRouter from "./logger/logger.router";
import { firebaseAuthMiddleware } from "../middleware/firebase";
import referralRouter from "./referral/referral.router";
import stripeRouter from "./stripe/stripe.router";
import planRouter from "./plan/plan.router";
import feedbackRouter from "./feedback/feedback.router";
import razorpayRouter from "./razorpay/razorpay.router";

const router = Router();

router.use("/user", userRouter);
router.use("/referral", referralRouter);
router.use("/plan", planRouter);
router.use("/feedback", feedbackRouter);
router.use(firebaseAuthMiddleware);
router.use("/request", requestRouter);
router.use("/folder", folderRouter);
router.use("/prompt", promptRouter);
router.use("/image", imageRouter);
router.use("/log", loggerRouter);
router.use("/stripe", stripeRouter);
router.use("/razorpay", razorpayRouter);


export default router;
