import { Request, Response, NextFunction } from "express";
import { auth } from "firebase-admin";
import { UserModel } from "../model/user/user.schema";

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  try {
    const decodedToken = await auth().verifyIdToken(idToken, true);
    if (decodedToken) {
      const userRecord = await auth().getUser(decodedToken.uid);
      let user = await UserModel.findOne(
        { email: userRecord!.email },
        { __v: 0 }
      );

      if (!user) {
        let provider = "email";

        if (userRecord.providerData[0].providerId === "google.com") {
          provider = "google";
        }

        user = new UserModel({
          email: userRecord.email,
          fullName: userRecord.displayName,
          displayPicture: userRecord.photoURL,
        });
        await user.save();
      }

      req.user = user;
      return next();
    } else {
      throw Error("Authentication Error");
    }
  } catch (error) {
    console.error("Firebase authentication error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
