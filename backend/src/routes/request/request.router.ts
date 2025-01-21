import { Router } from "express";
import {
  httpCompareRequests,
  httpCreateChatCompletion,
  // httpCreateCompletion,
  httpGetRequest,
  httpGetRequestsOfUser,
  httpModifyChatCompletion,
  httpEditChatCompletionName,
  httpDeleteChatCompletion,
} from "./request.controller";
import { checkLLMQueryLimitMiddleware } from "../../middleware/plan";

const requestRouter = Router();

requestRouter.get("/", httpGetRequestsOfUser);
requestRouter.get("/:id", httpGetRequest);
requestRouter.patch("/chat/:id", httpEditChatCompletionName);
requestRouter.delete("/chat/:id", httpDeleteChatCompletion);
//requestRouter.post("/completion", httpCreateCompletion);

requestRouter.use(checkLLMQueryLimitMiddleware);
requestRouter.post("/compare", httpCompareRequests);
requestRouter.put("/chat/:id", httpModifyChatCompletion);
requestRouter.post("/chat", httpCreateChatCompletion);

export default requestRouter;
