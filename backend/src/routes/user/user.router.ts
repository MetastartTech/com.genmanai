import { Router } from "express";
import {
  httpFetchUser,
  httpLoginUser,
  httpSignupUser,
} from "./user.controller";
import { firebaseAuthMiddleware } from "../../middleware/firebase";

const userRouter = Router();

userRouter.post("/signup", httpSignupUser);
userRouter.get("/signin", httpLoginUser);
userRouter.get("/", firebaseAuthMiddleware, httpFetchUser);

export default userRouter;
