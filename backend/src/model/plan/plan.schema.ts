import mongoose from "mongoose";
import { IPlan } from "../../types/schema";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    credits: {
      llm: { type: Number, required: true },
      image: { type: Number, required: true },
    },
    features: [String],
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlan>("Plan", planSchema);

export default Plan;
export { planSchema };
