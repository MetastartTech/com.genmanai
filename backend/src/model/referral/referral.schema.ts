import { Model, Schema, model } from "mongoose";
import { IReferral } from "../../types/schema";

const ReferralSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 5,
    },
    usedFingerprints: [
      {
        type: Number,
      },
    ],
    rewardClaimed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Referral: Model<IReferral> = model<IReferral>("Referral", ReferralSchema);

export default Referral;
