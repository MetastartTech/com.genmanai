import { Request, Response } from "express";
import {
  ChatCompletionModels,
  CompletionModels,
  IChatCompletion,
  ICompletion,
} from "../../types/openai";
import { chatCompletion } from "../../requests/llms/openai";
import {
  getRequest,
  getRequestsOfUser,
} from "../../model/request/request.model";
import { completion } from "../../requests/llms/openai/completion";
import LlmRequest from "../../model/request/request.schema";

const httpCreateChatCompletion = async (req: Request, res: Response) => {
  try {
    const input: IChatCompletion = req.body;
    if (!input.messages) {
      throw Error("messages is required");
    }
    if (!ChatCompletionModels.includes(input.model)) {
      throw Error("model not found");
    }
    const responses = await chatCompletion(req.user._id, "openai", input);
    res.json({ responses });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpCreateCompletion = async (req: Request, res: Response) => {
  try {
    const { input, name } = req.body;
    console.log(req.body);
    if (!input.prompt) {
      throw Error("prompt is required");
    }
    if (!CompletionModels.includes(input.model)) {
      throw Error("model not found");
    }
    const response = await completion(req.user._id, name, "openai", input);
    res.json({ request: response?.llmRequest, responses: response?.responses });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpGetRequestsOfUser = async (req: Request, res: Response) => {
  try {
    const requests = await getRequestsOfUser(req.user._id);
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpGetRequest = async (req: Request, res: Response) => {
  try {
    const request = await getRequest(req.user._id, req.params.id);
    return res.status(200).json(request);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpCompareRequests = async (req: Request, res: Response) => {
  try {
    const { requestId1, requestId2 } = req.params;

    const request1 = await LlmRequest.findById(requestId1).exec();

    const request2 = await LlmRequest.findById(requestId2).exec();

    if (!request1 || !request2) {
      res.status(404).json({ error: "Request Not Found!" });
    }

    const responseJSON = {
      request1,
      request2,
    };

    return res.status(200).json(responseJSON);
  } catch (error) {
    console.error("Error in /request/compare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  httpCreateChatCompletion,
  httpCreateCompletion,
  httpGetRequestsOfUser,
  httpGetRequest,
  httpCompareRequests,
};
