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
import ImageRequest from "../../model/image/image.schema";

const httpCreateFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentFolder, folders, type, requests } = req.body;

    let parentFolderId = null;

    if (parentFolder) {
      const parent = await getFolderById(
        req.user._id,
        parentFolder,
        type ?? "llm"
      );
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
      type,
    });

    if (parentFolderId) {
      await Folder.findOneAndUpdate(
        { user: req.user._id, _id: parentFolderId },
        {
          $push: { folders: folder._id },
        }
      );
    }

    if (requests) {
      if (type === "image") {
        await ImageRequest.updateMany(
          { _id: { $in: requests } },
          { $set: { folder: folder._id } }
        );
      } else {
        await LlmRequest.updateMany(
          { _id: { $in: requests } },
          { $set: { folder: folder._id } }
        );
      }
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
    const { type } = req.query;

    const folders = await getUserFolders(
      req.user._id,
      (type as "llm" | "image") ?? "llm"
    );

    const populatedFolders = [];
    if (type === "image") {
      for (const folder of folders) {
        const requests = await ImageRequest.find({
          _id: { $in: folder.requests },
        });
        populatedFolders.push({ ...folder.toJSON(), requests });
      }
    } else {
      for (const folder of folders) {
        const requests = await LlmRequest.find({
          _id: { $in: folder.requests },
        });
        populatedFolders.push({ ...folder.toJSON(), requests });
      }
    }

    let requestsWithoutFolders = [];
    if (type === "image") {
      requestsWithoutFolders = await ImageRequest.find({
        user: req.user._id,
        folder: null,
      });
    } else {
      requestsWithoutFolders = await LlmRequest.find({
        user: req.user._id,
        folder: null,
      });
    }

    const allData = {
      folders: populatedFolders,
      requestsWithoutFolders,
    };

    return res.status(200).json(allData);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch folders" });
  }
};

const httpGetFolderById = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const folder = await getFolderById(
      req.user._id,
      req.params.folderId,
      (type as "llm" | "image") ?? "llm"
    );
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

    if (requests) {
      if (folder.type === "llm") {
        await LlmRequest.updateMany(
          { _id: { $in: requests } },
          { $set: { folder: folder._id } }
        );
      } else {
        await ImageRequest.updateMany(
          { _id: { $in: requests } },
          { $set: { folder: folder._id } }
        );
      }
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

const httpAddRequestToFolder = async (req: Request, res: Response) => {
  try {
    const { request } = req.body;

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const folderId = req.params.folderId;

    // Find the current folder of the request
    const currentFolder = await Folder.findOne({
      user: req.user._id,
      requests: request,
    });

    // If the request is in another folder, remove it from that folder
    if (currentFolder && currentFolder._id.toString() !== folderId) {
      await Folder.findOneAndUpdate(
        { user: req.user._id, _id: currentFolder._id },
        { $pull: { requests: request } }
      );
    }

    // Update the target folder by adding the request
    const folder = await Folder.findOneAndUpdate(
      { user: req.user._id, _id: folderId },
      {
        $addToSet: { requests: request },
      },
      { new: true } // Return the updated document
    );

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Update the request to point to the new folder
    if (folder.type === "llm") {
      await LlmRequest.updateOne(
        { _id: request },
        { $set: { folder: folder._id } }
      );
    } else {
      await ImageRequest.updateOne(
        { _id: request },
        { $set: { folder: folder._id } }
      );
    }

    // Log the folder update
    await createLog({
      user: req.user._id,
      type: "folder",
      action: "UPDATE FOLDER",
      entityId: folder._id,
      details: { document: folder.toJSON() },
    });

    return res.status(200).json(folder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to update folder" });
  }
};

const httpRemoveRequestFromFolder = async (req: Request, res: Response) => {
  try {
    const { request } = req.params;

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const currentFolder = await Folder.findOne({
      user: req.user._id,
      requests: request,
    });

    if (!currentFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await Folder.findOneAndUpdate(
      { user: req.user._id, _id: currentFolder._id },
      { $pull: { requests: request } }
    );

    if (currentFolder.type === "llm") {
      await LlmRequest.updateOne({ _id: request }, { $set: { folder: null } });
    } else {
      await ImageRequest.updateOne(
        { _id: request },
        { $set: { folder: null } }
      );
    }

    await createLog({
      user: req.user._id,
      type: "folder",
      action: "UPDATE FOLDER",
      entityId: currentFolder._id,
      details: { document: currentFolder.toJSON() },
    });

    return res.status(200).json(currentFolder);
  } catch (error) {
    console.error(error);
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

    const type = folderToDelete.type;

    async function deleteSubfoldersAndContents(folderId: string) {
      const subfolders = await Folder.find({ parentFolder: folderId });

      const deletionPromises = subfolders.map(async (subfolder) => {
        await deleteSubfoldersAndContents(subfolder._id);

        await Folder.updateOne(
          { _id: subfolder.parentFolder },
          { $pull: { folders: subfolder._id } }
        );

        const requestsToDelete = subfolder.requests;
        if (type === "llm") {
          await LlmRequest.deleteMany({ _id: { $in: requestsToDelete } });
        } else {
          await ImageRequest.deleteMany({ _id: { $in: requestsToDelete } });
        }
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
    if (type === "llm") {
      await LlmRequest.deleteMany({ _id: { $in: requestsToDelete } });
    } else {
      await ImageRequest.deleteMany({ _id: { $in: requestsToDelete } });
    }
    await folderToDelete.deleteOne();
    if (type === "llm") {
      await LlmRequest.deleteMany({ folder: folderId });
    } else {
      await ImageRequest.deleteMany({ folder: folderId });
    }

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

const httpRenameFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    // console.log(folderId, "folderID backend");

    if (name.trim().length < 2) {
      throw Error("Invalid Name, minimum 2 characters required");
    }

    const updatedFolder = await Folder.findOneAndUpdate(
      { user: req.user._id, _id: folderId },
      {
        $set: { name: name },
      },
      { new: true }
    ).exec();
    // console.log(updatedFolder, "updated folder backend");
    return res.status(201).json(updatedFolder);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  httpCreateFolder,
  httpDeleteFolder,
  httpGetAllFolders,
  httpGetFolderById,
  httpUpdateFolder,
  httpAddRequestToFolder,
  httpRemoveRequestFromFolder,
  httpRenameFolder,
};
