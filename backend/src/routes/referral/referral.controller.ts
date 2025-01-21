import { Request, Response } from "express";
import {
  createNewReferral,
  deleteReferralByUser,
  getReferralByCode,
  getReferralByUser,
} from "../../model/referral/referral.model";

const httpCheckValidReferral = async (req: Request, res: Response) => {
  try {
    const { code, deviceFingerprint } = req.body;
    let referral = await getReferralByCode(code);
    if (!referral) {
      return res.status(403).json({ error: "Invalid Referral Code" });
    }
    if (referral.timesUsed == referral.limit) {
      return res.status(403).json({ error: "Already reached its limit usage" });
    }
    if (referral.usedFingerprints.includes(deviceFingerprint)) {
      return res.status(403).json({
        error:
          "Another Sign Up via referral not allowed from same device referral was generated/used!!",
      });
    }
    // return res.status(201).json({ success: "Valid referral Code" });
    return res.status(201).json(referral);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const httpCreateNewReferral = async (req: Request, res: Response) => {
  try {
    // let checkIfExisitng = await getReferralByUser(req.user._id);
    let checkIfExisitng = await getReferralByUser(req.body.userId);
    if (checkIfExisitng) {
      return res.status(403).json({
        error: "Already having a referral assocoiated with account!!",
      });
    }
    // let referral = await createNewReferral(req.user._id);
    let referral = await createNewReferral(
      req.body.userId,
      req.body.deviceFingerprint,
    );
    return res.status(201).json(referral);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const httpDeleteReferralByUser = async (req: Request, res: Response) => {
  try {
    // let referral = await getReferralByUser(req.user._id);
    let referral = await getReferralByUser(req.body.userId);

    if (!referral) {
      return res.status(404).json({ error: "Referral Not found" });
    }
    // await deleteReferralByUser(req.user._id);
    await deleteReferralByUser(req.body.userId);
    return res.status(201).json({ success: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const httpGetReferralByUser = async (req: Request, res: Response) => {
  try {
    let referral = await getReferralByUser(req.body.userId);

    if (!referral) {
      return res.status(404).json({ error: "Referral Not found" });
    }
    return res.status(201).json(referral);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  httpCheckValidReferral,
  httpCreateNewReferral,
  httpDeleteReferralByUser,
  httpGetReferralByUser,
};
