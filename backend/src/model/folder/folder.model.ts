import { IFolder } from "../../types/schema";
import Folder from "./folder.schema";

const createFolder = async (folder: Partial<IFolder>): Promise<IFolder> => {
  return await Folder.create(folder);
};

const getUserFolders = async (user: string): Promise<IFolder[]> => {
  return await Folder.find({ user });
};

const getFolderById = async (
  user: string,
  id: string
): Promise<IFolder | null> => {
  return await Folder.findOne({ _id: id, user });
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
