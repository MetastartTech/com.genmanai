import { auth } from "firebase-admin";
import { Request, Response } from "express";
import { IUser } from "../../types/schema";
import { UserModel } from "../../model/user/user.schema";
import { createUser } from "../../model/user/user.model";

const httpSignupUser = async (req: Request, res: Response) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Authorization header not found" });
  }

  const { fullName } = req.body;

  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    const userRecord = await auth().getUser(decodedToken.uid);
    const user: Partial<IUser> = {
      fullName: fullName,
      displayPicture: userRecord.photoURL,
      email: decodedToken.email,
    };

    const newUser = await createUser(user);

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
};

const httpLoginUser = async (req: Request, res: Response) => {
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
        throw Error("Authentication Error");
      }

      const fiveDays = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn: fiveDays,
      });

      const options = { maxAge: fiveDays, httpOnly: true, secure: true };
      res.cookie("session", sessionCookie, options);
      return res.status(200).json(user);
    } else {
      throw Error("Authentication Error");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

const httpFetchUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

export { httpLoginUser, httpSignupUser, httpFetchUser };
