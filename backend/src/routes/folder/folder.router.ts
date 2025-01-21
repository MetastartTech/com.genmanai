import { Router } from "express";
import {
  httpAddRequestToFolder,
  httpCreateFolder,
  httpDeleteFolder,
  httpGetAllFolders,
  httpGetFolderById,
  httpRemoveRequestFromFolder,
  httpRenameFolder,
  httpUpdateFolder,
} from "./folder.controller";

const folderRouter = Router();

folderRouter.post("/", httpCreateFolder);
folderRouter.get("/", httpGetAllFolders);
folderRouter.get("/:folderId", httpGetFolderById);
folderRouter.put("/add-request/:folderId", httpAddRequestToFolder);
folderRouter.put("/remove-request/:request", httpRemoveRequestFromFolder);
folderRouter.put("/:folderId", httpUpdateFolder);
folderRouter.delete("/:folderId", httpDeleteFolder);
folderRouter.patch("/:folderId", httpRenameFolder);

export default folderRouter;
