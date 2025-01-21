import { IImageRequest } from "../../types/schema";
import ImageRequest from "./image.schema";

const getImageRequestsOfUser = async (
  user: string
): Promise<IImageRequest[]> => {
  return await ImageRequest.find({ user });
};

const getRequest = async (
  user: string,
  id: string
): Promise<IImageRequest | null> => {
  const request = await ImageRequest.findOne({ user, _id: id }).sort({
    "versions.createdAt": -1,
  });
  return request;
};

export { getImageRequestsOfUser, getRequest };
