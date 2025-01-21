import { Router } from "express";
import { httpGetPlans } from "./plan.controller";

const planRouter = Router();

planRouter.get("/", httpGetPlans);

export default planRouter;
