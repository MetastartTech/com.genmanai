import { Router } from "express";
import userRouter from "./user/user.router";
import requestRouter from "./request/request.router";
import folderRouter from "./folder/folder.router";
import promptRouter from "./prompt/prompt.router";
import imageRouter from "./image/image.router";
import loggerRouter from "./logger/logger.router";
import { firebaseAuthMiddleware } from "../middleware/firebase";

const router = Router();

router.use("/user", userRouter);
router.use(firebaseAuthMiddleware);
router.use("/request", requestRouter);
router.use("/folder", folderRouter);
router.use("/prompt", promptRouter);
router.use("/image", imageRouter);
router.use("/log", loggerRouter);

export default router;
