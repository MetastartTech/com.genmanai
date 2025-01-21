import { Router } from "express";
import {
  httpCreateImageEdit,
  httpCreateImageGeneration,
  httpCreateImageVariation,
  httpGetImageRequestsOfUser,
} from "./image.controller";

const imageRouter = Router();

imageRouter.get("/", httpGetImageRequestsOfUser);
imageRouter.post("/generation", httpCreateImageGeneration);
imageRouter.post("/edit", httpCreateImageEdit);
imageRouter.post("/variation", httpCreateImageVariation);

export default imageRouter;
