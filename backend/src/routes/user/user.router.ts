import { Router } from "express";
import { httpFetchUser } from "./user.controller";
import { firebaseAuthMiddleware } from "../../middleware/firebase";

const userRouter = Router();

// userRouter.post("/signup", httpSignupUser);
// userRouter.get("/signinEmail", httpLoginUser);
// userRouter.post("/signupEmail", httpSignupUser);
userRouter.get("/", firebaseAuthMiddleware, httpFetchUser);

export default userRouter;
