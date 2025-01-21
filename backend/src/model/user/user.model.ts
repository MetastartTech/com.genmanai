import { IUser } from "../../types/schema";
import { UserModel } from "./user.schema";

const createUser = async (user: Partial<IUser>): Promise<IUser> => {
  return await UserModel.create(user);
};

const userLLMQuery = async (userId: string, queries: number = 1) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.creditsWallet.llm <= 0) {
      throw new Error("Insufficient LLM credits");
    }

    user.creditsWallet.llm -= queries;

    user.creditsWallet.llm = Math.max(user.creditsWallet.llm, 0);

    await user.save();

    return user.creditsWallet;
  } catch (error: any) {
    throw new Error(`Failed to process LLM query: ${error.message}`);
  }
};

const useImageQuery = async (userId: string, queries: number = 1) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.creditsWallet.image <= 0) {
      throw new Error("Insufficient image credits");
    }

    user.creditsWallet.image -= queries;

    user.creditsWallet.image = Math.max(user.creditsWallet.image, 0);

    await user.save();

    return user.creditsWallet;
  } catch (error: any) {
    throw new Error(`Failed to process Image query: ${error.message}`);
  }
};

export { createUser, userLLMQuery, useImageQuery };
