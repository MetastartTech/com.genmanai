import { Router } from "express";
import {
  httpCompareImages,
  // httpCreateImageEdit,
  httpCreateImageGeneration,
  // httpCreateImageVariation,
  httpDeleteRequest,
  httpEditName,
  httpGetImageRequestsOfUser,
  httpGetRequest,
  httpModifyImageGeneration,
} from "./image.controller";
import { checkImageQueryLimitMiddleware } from "../../middleware/plan";

const imageRouter = Router();

imageRouter.get("/", httpGetImageRequestsOfUser);
imageRouter.get("/:id", httpGetRequest);
imageRouter.patch("/:id", httpEditName);
imageRouter.delete("/:id", httpDeleteRequest);

imageRouter.use(checkImageQueryLimitMiddleware);
imageRouter.put("/generation/:id", httpModifyImageGeneration);
imageRouter.post("/generation", httpCreateImageGeneration);
imageRouter.post("/compare", httpCompareImages);
// imageRouter.post("/edit", httpCreateImageEdit);
// imageRouter.post("/variation", httpCreateImageVariation);

export default imageRouter;
