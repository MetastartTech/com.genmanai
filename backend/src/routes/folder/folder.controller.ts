import { Request, Response } from "express";
import Folder from "../../model/folder/folder.schema";
import LlmRequest from "../../model/request/request.schema";
import {
  createFolder,
  getFolderById,
  getUserFolders,
  updateFolderById,
} from "../../model/folder/folder.model";
import { createLog } from "../../model/logger/logger.model";

const httpCreateFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentFolder, folders, requests } = req.body;

    let parentFolderId = null;

    if (parentFolder) {
      const parent = await getFolderById(req.user._id, parentFolder);
      if (!parent) {
        return res.status(404).json({ error: "Parent folder not found" });
      }
      parentFolderId = parent._id;
    }

    const folder = await createFolder({
      user: req.user._id,
      name,
      parentFolder: parentFolderId,
      folders,
      requests,
    });

    if (parentFolderId) {
      await Folder.findOneAndUpdate(
        { user: req.user._id, _id: parentFolderId },
        {
          $push: { folders: folder._id },
        }
      );
    }

    await createLog({
      user: req.user._id,
      type: "folder",
      action: "CREATE FOLDER",
      entityId: folder._id,
      details: { document: folder.toJSON() },
    });

    return res.status(201).json(folder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Unable to create folder" });
  }
};

const httpGetAllFolders = async (req: Request, res: Response) => {
  try {
    const folders = await getUserFolders(req.user._id);
    return res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch folders" });
  }
};

const httpGetFolderById = async (req: Request, res: Response) => {
  try {
    const folder = await getFolderById(req.user._id, req.params.folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    return res.status(200).json(folder);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch folder" });
  }
};

const httpUpdateFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentFolder, folders, requests } = req.body;

    let parentFolderId = null;

    if (parentFolder) {
      const parent = await Folder.findById(parentFolder);
      if (!parent) {
        return res.status(404).json({ error: "Parent folder not found" });
      }
      parentFolderId = parent._id;
    }

    const folder = await updateFolderById(req.user._id, req.params.folderId, {
      name,
      parentFolder: parentFolderId,
      folders,
      requests,
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (parentFolderId) {
      await Folder.findByIdAndUpdate(parentFolderId, {
        $addToSet: { folders: folder._id },
      });
    }

    await createLog({
      user: req.user._id,
      type: "folder",
      action: "UPDATE FOLDER",
      entityId: folder._id,
      details: { document: folder.toJSON() },
    });

    return res.status(200).json(folder);
  } catch (error) {
    return res.status(500).json({ error: "Unable to update folder" });
  }
};

const httpDeleteFolder = async (req: Request, res: Response) => {
  try {
    const folderId = req.params.folderId;

    const folderToDelete = await Folder.findOne({
      user: req.user._id,
      _id: folderId,
    });

    if (!folderToDelete) {
      return res.status(404).json({ error: "Folder not found" });
    }

    async function deleteSubfoldersAndContents(folderId: string) {
      const subfolders = await Folder.find({ parentFolder: folderId });

      const deletionPromises = subfolders.map(async (subfolder) => {
        await deleteSubfoldersAndContents(subfolder._id);

        await Folder.updateOne(
          { _id: subfolder.parentFolder },
          { $pull: { folders: subfolder._id } }
        );

        const requestsToDelete = subfolder.requests;
        await LlmRequest.deleteMany({ _id: { $in: requestsToDelete } });
        await subfolder.deleteOne();
      });

      await Promise.all(deletionPromises);
    }

    await deleteSubfoldersAndContents(folderId);

    if (folderToDelete.parentFolder) {
      await Folder.updateOne(
        { _id: folderToDelete.parentFolder },
        { $pull: { folders: folderToDelete._id } }
      );
    }

    const requestsToDelete = folderToDelete.requests;
    await LlmRequest.deleteMany({ _id: { $in: requestsToDelete } });
    await folderToDelete.deleteOne();

    await createLog({
      user: req.user._id,
      type: "folder",
      action: "DELETE FOLDER",
      entityId: folderToDelete._id,
      details: { document: folderToDelete.toJSON() },
    });

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to delete folder and its contents" });
  }
};

export {
  httpCreateFolder,
  httpDeleteFolder,
  httpGetAllFolders,
  httpGetFolderById,
  httpUpdateFolder,
};
