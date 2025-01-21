import { Router } from "express";
import { httpCreateFeedback } from "./feedback.controller";

const feedbackRouter = Router();

feedbackRouter.post("/", httpCreateFeedback);

export default feedbackRouter;
