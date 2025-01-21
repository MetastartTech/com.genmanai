import { Router } from "express";
import {
  httpCreateCheckoutSession,
  httpCreateManageSession,
} from "./stripe.controller";

const stripeRouter = Router();

stripeRouter.get("/checkout", httpCreateCheckoutSession);
stripeRouter.get("/manage", httpCreateManageSession);

export default stripeRouter;
