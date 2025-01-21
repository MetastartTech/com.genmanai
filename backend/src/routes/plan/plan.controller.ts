import { Request, Response } from "express";
import Plan from "../../model/plan/plan.schema";

const httpGetPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find({});
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).send("Failed to fetch plans");
  }
};

export { httpGetPlans };
