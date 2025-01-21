import { ILlmRequest } from "../../types/schema";
import LlmRequest from "./request.schema";

const getRequestsOfUser = async (user: string): Promise<ILlmRequest[]> => {
  const requests = await LlmRequest.find({
    user,
  }).sort({
    "versions.createdAt": -1,
  });
  return requests;
};

const getRequest = async (
  user: string,
  id: string
): Promise<ILlmRequest | null> => {
  const request = await LlmRequest.findOne({ user, _id: id }).sort({
    "versions.createdAt": -1,
  });
  return request;
};

export { getRequestsOfUser, getRequest };
