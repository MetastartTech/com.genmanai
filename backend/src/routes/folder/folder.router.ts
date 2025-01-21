import { Router } from "express";
import {
  httpCreateFolder,
  httpDeleteFolder,
  httpGetAllFolders,
  httpGetFolderById,
  httpUpdateFolder,
} from "./folder.controller";

const folderRouter = Router();

folderRouter.post("/", httpCreateFolder);
folderRouter.get("/", httpGetAllFolders);
folderRouter.get("/:folderId", httpGetFolderById);
folderRouter.put("/:folderId", httpUpdateFolder);
folderRouter.delete("/:folderId", httpDeleteFolder);

export default folderRouter;
