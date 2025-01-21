import { IFolder } from "../../types/schema";
import Folder from "./folder.schema";

const createFolder = async (folder: Partial<IFolder>): Promise<IFolder> => {
  return await Folder.create(folder);
};

const getUserFolders = async (
  user: string,
  type: "llm" | "image"
): Promise<IFolder[]> => {
  return await Folder.find({ user, type }).populate("folders");
};

const getFolderById = async (
  user: string,
  id: string,
  type: "llm" | "image"
): Promise<IFolder | null> => {
  return await Folder.findOne({ _id: id, user, type });
};

const updateFolderById = async (
  user: string,
  id: string,
  folder: Partial<IFolder>
): Promise<IFolder | null> => {
  return await Folder.findOneAndUpdate({ _id: id, user }, folder, {
    new: true,
  });
};

export { createFolder, getFolderById, getUserFolders, updateFolderById };
