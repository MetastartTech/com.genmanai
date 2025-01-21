import { IImageRequest } from "../../types/schema";
import ImageRequest from "./image.schema";

const getImageRequestsOfUser = async (
  user: string
): Promise<IImageRequest[]> => {
  return await ImageRequest.find({ user });
};

export { getImageRequestsOfUser };
