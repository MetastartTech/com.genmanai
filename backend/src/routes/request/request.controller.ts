import { Request, Response } from "express";
import { ChatCompletionModels } from "../../types/openai";
import {
  chatCompletion,
  modifyChatCompletion,
  editChatCompletionName,
  deleteChatCompletion,
} from "../../requests/llms/openai";
import {
  getRequest,
  getRequestsOfUser,
} from "../../model/request/request.model";
import { userLLMQuery } from "../../model/user/user.model";
import { generation } from "../../requests/llms/gemini";
import { editGeneration } from "../../requests/llms/gemini/chat";
import { AnthropicMessageModels } from "../../types/anthropic";
import {
  createMessages,
  modifyMessages,
} from "../../requests/llms/anthropic/chat";

const httpCreateChatCompletion = async (req: Request, res: Response) => {
  try {
    const { name, input } = req.body;

    if (!input.messages) {
      throw Error("messages is required");
    }
    if (input.llm === "openai" && !ChatCompletionModels.includes(input.model)) {
      throw Error("model not found");
    } else if (
      input.llm === "gemini" &&
      !["gemini-pro"].includes(input.model)
    ) {
      throw Error("model not found");
    } else if (
      input.llm === "anthropic" &&
      !AnthropicMessageModels.includes(input.model)
    ) {
      throw Error("model not found");
    }
    let responses: any = {};

    if (input.llm === "openai") {
      responses = await chatCompletion(req.user._id, "openai", name, input);
    } else if (input.llm === "gemini") {
      responses = await generation(req.user._id, "gemini", name, input);
    } else if (input.llm === "anthropic") {
      responses = await createMessages(req.user._id, "anthropic", name, input);
    }

    const credits = await userLLMQuery(req.user._id);
    res.status(201).json({
      request: responses?.llmRequest,
      responses: responses?.responses,
      credits,
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const httpModifyChatCompletion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    if (!input.messages) {
      throw Error("messages is required");
    }
    if (input.llm === "openai" && !ChatCompletionModels.includes(input.model)) {
      throw Error("model not found");
    } else if (
      input.llm === "gemini" &&
      !["gemini-pro"].includes(input.model)
    ) {
      throw Error("model not found");
    } else if (
      input.llm === "anthropic" &&
      !AnthropicMessageModels.includes(input.model)
    ) {
      throw Error("model not found");
    }
    let responses: any = {};
    if (input.llm === "openai") {
      responses = await modifyChatCompletion(id, req.user._id, input);
    } else if (input.llm === "gemini") {
      responses = await editGeneration(id, req.user._id, input);
    } else if (input.llm === "anthropic") {
      responses = await modifyMessages(id, req.user._id, input);
    }

    const credits = await userLLMQuery(req.user._id);
    res.status(201).json({
      request: responses?.llmRequest,
      responses: responses?.responses,
      credits,
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const httpEditChatCompletionName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (name.trim().length < 3) {
      throw Error("Invalid Name, minimum 3 characters required");
    }

    const response = await editChatCompletionName(id, req.user._id, name);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpDeleteChatCompletion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;
    await deleteChatCompletion(id, req.user._id, folderId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const httpCreateCompletion = async (req: Request, res: Response) => {
//   try {
//     const { input, name } = req.body;
//     console.log(input, name);
//     if (!input.prompt) {
//       throw Error("prompt is required");
//     }
//     if (!CompletionModels.includes(input.model)) {
//       throw Error("model not found");
//     }
//     const response = await completion(req.user._id, name, "openai", input);
//     res
//       .status(201)
//       .json({ request: response?.llmRequest, responses: response?.responses });
//   } catch (error) {
//     console.error("Error in /complete:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

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

// const httpCompareRequests = async (req: Request, res: Response) => {
//   try {
//     const { input1, input2 } = req.body;

//     if (!input1.messages || !input2.messages) {
//       throw Error("messages is required");
//     }
//     if (
//       input1.llm === "openai" &&
//       !ChatCompletionModels.includes(input1.model)
//     ) {
//       throw Error("model not found");
//     }
//     if (
//       input2.llm === "openai" &&
//       !ChatCompletionModels.includes(input2.model)
//     ) {
//       throw Error("model not found");
//     }
//     if (input1.llm === "gemini" && !["gemini-pro"].includes(input1.model)) {
//       throw Error("model not found");
//     }
//     if (input2.llm === "gemini" && !["gemini-pro"].includes(input2.model)) {
//       throw Error("model not found");
//     }
//     let responses: any = {};

//     if (input1.llm === "openai") {
//       responses = await chatCompletion(
//         req.user._id,
//         "openai",
//         "Compare Model 1",
//         input1
//       );
//     }
//     if (input2.llm === "openai") {
//       responses = await chatCompletion(
//         req.user._id,
//         "openai",
//         "Compare Model 2",
//         input2
//       );
//     }
//     if (input1.llm === "gemini") {
//       responses = await generation(
//         req.user._id,
//         "gemini",
//         "Compare Model 1",
//         input1
//       );
//     }
//     if (input2.llm === "gemini") {
//       responses = await generation(
//         req.user._id,
//         "gemini",
//         "Compare Model 2",
//         input2
//       );
//     }

//     const credits = await userLLMQuery(req.user._id, 2);
//     res.status(201).json({
//       request: responses?.llmRequest,
//       responses: responses?.responses,
//       credits,
//     });
//   } catch (error) {
//     console.error("Error in /request/compare:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const httpCompareRequests = async (req: Request, res: Response) => {
  try {
    const { input1, input2 } = req.body;

    if (!input1.messages || !input2.messages) {
      throw Error("messages is required");
    }

    // Validate models for both inputs
    const validateModel = (input: any) => {
      if (
        input.llm === "openai" &&
        !ChatCompletionModels.includes(input.model)
      ) {
        throw Error("model not found");
      }
      if (input.llm === "gemini" && !["gemini-pro"].includes(input.model)) {
        throw Error("model not found");
      }
      if (input.llm === "anthropic" && !AnthropicMessageModels.includes(input.model)) {
        throw Error("model not found");
      }
    };

    validateModel(input1);
    validateModel(input2);

    const operations = [input1, input2].map((input, index) => {
      if (input.llm === "openai") {
        return chatCompletion(
          req.user._id,
          "openai",
          `Compare Model ${index + 1}`,
          input
        )
          .then((response) => ({
            status: "fulfilled",
            model: index + 1,
            response,
          }))
          .catch((error) => ({ status: "rejected", model: index + 1, error }));
      } else if (input.llm === "gemini") {
        return generation(
          req.user._id,
          "gemini",
          `Compare Model ${index + 1}`,
          input
        )
          .then((response) => ({
            status: "fulfilled",
            model: index + 1,
            response,
          }))
          .catch((error) => ({ status: "rejected", model: index + 1, error }));
      } else if (input.llm === "anthropic") {
        return createMessages(
          req.user._id,
          "anthropic",
          `Compare Model ${index + 1}`,
          input
        )
          .then((response) => ({
            status: "fulfilled",
            model: index + 1,
            response,
          }))
          .catch((error) => ({ status: "rejected", model: index + 1, error }));
      }
    });

    const results = await Promise.all(operations);

    const successfulModels = results
      .filter((result) => result?.status === "fulfilled")
      .map((result) => result?.model);

    let credits = null;

    if (successfulModels.length > 0) {
      credits = await userLLMQuery(req.user._id, successfulModels.length);
    }

    res.status(201).json({
      results,
      credits,
    });
  } catch (error) {
    console.error("Error in /request/compare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  httpCreateChatCompletion,
  httpModifyChatCompletion,
  httpEditChatCompletionName,
  //httpCreateCompletion,
  httpGetRequestsOfUser,
  httpGetRequest,
  httpCompareRequests,
  httpDeleteChatCompletion,
};
