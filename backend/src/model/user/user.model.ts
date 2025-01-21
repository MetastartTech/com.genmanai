import { IUser } from "../../types/schema";
import { UserModel } from "./user.schema";

const createUser = async (user: Partial<IUser>): Promise<IUser> => {
  return await UserModel.create(user);
};

export { createUser };
