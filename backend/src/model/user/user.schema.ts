import { Schema, model } from "mongoose";
import { IUser } from "../../types/schema";

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
    subscription: {
      active: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
