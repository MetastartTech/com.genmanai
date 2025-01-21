import { Request, Response, NextFunction } from "express";

export const checkLLMQueryLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { llm } = user.creditsWallet;

    if (llm <= 0) {
      return res.status(403).json({ message: "Insufficient LLM credits" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkImageQueryLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { image } = user.creditsWallet;

    if (image <= 0) {
      return res.status(403).json({ message: "Insufficient image credits" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
