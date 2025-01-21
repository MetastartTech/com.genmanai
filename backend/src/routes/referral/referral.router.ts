import express from "express";
import {
  httpCheckValidReferral,
  httpCreateNewReferral,
  httpDeleteReferralByUser,
  httpGetReferralByUser,
} from "./referral.controller";

const referralRouter = express.Router();

referralRouter.post("/check", httpCheckValidReferral);
referralRouter.post("/", httpCreateNewReferral);
referralRouter.post("/delete", httpDeleteReferralByUser);
referralRouter.post("/get", httpGetReferralByUser);
export default referralRouter;
