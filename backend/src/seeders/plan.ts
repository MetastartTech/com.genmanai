import mongoose from "mongoose";
import Plan from "../model/plan/plan.schema";
import { config } from "dotenv";

config();

const plans = [
  {
    name: "Basic Plan",
    subtitle: "Starting out",
    priceId: "price_1Oiv7LSFIrjYZvhqh07oshIh",
    price: "$5",
    amount: 5,
    credits: {
      llm: 50,
      image: 5,
    },
    features: [
      "Test LLM and Image requests",
      "Check history",
      "Configure requests",
      "Compare requests",
    ],
  },
  {
    name: "Standard Plan",
    subtitle: "More Queries",
    priceId: "price_1OhsbhSFIrjYZvhq17PRFF2A",
    price: "$10",
    amount: 10,
    credits: {
      llm: 125,
      image: 15,
    },
    features: [
      "Test LLM and Image requests",
      "Check history",
      "Configure requests",
      "Compare requests",
      "Increased query limits",
    ],
  },
  {
    name: "Enterprise Plan",
    subtitle: "Custom",
    priceId: null,
    price: "Custom pricing",
    amount: 0,
    credits: {
      llm: 0,
      image: 0,
    },
    features: [
      "Test LLM and Image requests",
      "Check history",
      "Configure requests",
      "Compare requests",
      "Single Sign-On (SSO)",
      "Dedicated support",
      "Customizable features",
    ],
  },
];

export const seedPlans = async () => {
console.log("Seeding plans");
  try {
    await mongoose.connect(process.env.MONGODB_URI ?? "");
    console.log("Connected to MongoDB");

    await Plan.deleteMany({});
    console.log("Cleared existing plans");

    await Plan.insertMany(plans);
    console.log("Inserted new plans");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding plans:", error);
  }
};

seedPlans();
