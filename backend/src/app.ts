import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { IUser } from "./types/schema";
import router from "./routes";
import { handleStripeWebhook } from "./stripe/webhook";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: true }));
app.use(morgan("tiny"));

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, Stealth!", status: "success" });
});

app.use("/v1/api", router);

export default () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
