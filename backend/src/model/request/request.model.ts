import { ILlmRequest } from "../../types/schema";
import LlmRequest from "./request.schema";

const getRequestsOfUser = async (user: string): Promise<ILlmRequest[]> => {
  return await LlmRequest.find({ user });
};

const getRequest = async (
  user: string,
  id: string
): Promise<ILlmRequest | null> => {
  return await LlmRequest.findOne({ user, _id: id });
};

export { getRequestsOfUser, getRequest };
