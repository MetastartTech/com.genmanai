import { Router } from "express";
import {
  httpCompareRequests,
  httpCreateChatCompletion,
  httpCreateCompletion,
  httpGetRequest,
  httpGetRequestsOfUser,
} from "./request.controller";

const requestRouter = Router();

requestRouter.get("/", httpGetRequestsOfUser);
requestRouter.get("/:id", httpGetRequest);
requestRouter.post("/chat", httpCreateChatCompletion);
requestRouter.post("/completion", httpCreateCompletion);
requestRouter.get("/compare/:requestId1/:requestId2", httpCompareRequests);

export default requestRouter;
