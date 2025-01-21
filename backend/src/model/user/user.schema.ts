import { Schema, model } from "mongoose";
import { IUser } from "../../types/schema";
import { planSchema } from "../plan/plan.schema";

const purchaseDetailsSchema = new Schema(
  {
    invoice: {
      type: String,
      // required: true,
    },
    plan: {
      type: planSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const creditsSchema = new Schema(
  {
    llm: { type: Number, default: 0 },
    image: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    displayPicture: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      match: /^\S+@\S+\.\S+$/,
    },
    freeUsed: {
      type: Boolean,
      default: false,
    },
    purchaseHistory: [purchaseDetailsSchema],
    creditsWallet: creditsSchema,
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
