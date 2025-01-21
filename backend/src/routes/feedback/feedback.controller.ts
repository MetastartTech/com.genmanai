import { Request, Response } from "express";
import FirestoreModel from "../../model/firestore/firestore.model";

const feedbackModel = new FirestoreModel("feedback");

const httpCreateFeedback = async (req: Request, res: Response) => {
  try {
    const { email, feedback } = req.body;

    await feedbackModel.create({ email, feedback });

    return res.status(201).json({
      message: "Feedback created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Unable to create folder" });
  }
};

export { httpCreateFeedback };
