import { Router } from "express";
import {
  httpGetUserLogs,
  httpGetUserLogsByEntity,
  httpGetUserLogsByType,
} from "./logger.controller";

const loggerRouter = Router();

loggerRouter.get("/", httpGetUserLogs);
loggerRouter.get("/type/:type", httpGetUserLogsByType);
loggerRouter.get("/entity/:entity", httpGetUserLogsByEntity);

export default loggerRouter;
