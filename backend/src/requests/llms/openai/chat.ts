import { Schema } from "mongoose";
import openai from "../../../config/openai";
import OpenAI from "openai";
import LlmRequest from "../../../model/request/request.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IChatCompletion } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";
import { IVersion } from "../../../types/schema";
import Folder from "../../../model/folder/folder.schema";

const chatCompletion = async (
  user: string,
  llm: "openai",
  name: string,
  input: IChatCompletion
) => {
  const llmRequest = new LlmRequest({
    type: "chat",
    user,
    name,
    versions: [], // Initialize an empty versions array
    error: undefined, // Ensure error field is initialized
  });

  try {
    const {
      model,
      messages,
      frequency_penalty,
      n,
      max_tokens,
      temperature,
      top_p,
      logit_bias,
    } = input;

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      messages,
      model,
      frequency_penalty,
      n,
      max_tokens,
      temperature,
      top_p,
      logit_bias,
    });

    const responseTime = Date.now() - startTime;

    const responses = completion.choices
      .map((choice) => choice.message.content)
      .filter((item): item is string => item !== null);
    const usage = completion.usage;

    const version: IVersion = {
      llm,
      config: input,
      response: responses,
      tokenUsage: {
        completion: usage?.completion_tokens ?? 0,
        total: usage?.total_tokens ?? 0,
        prompt: usage?.prompt_tokens ?? 0,
      },
      responseTime: responseTime,
    };

    llmRequest.versions.push(version);

    await llmRequest.save();

    await createLog({
      user: user as unknown as Schema.Types.ObjectId,
      type: "llm_request",
      action: "CHAT COMPLETION",
      entityId: llmRequest._id,
      details: { document: llmRequest.toJSON() },
    });

    return { llmRequest, responses };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // console.log(error);
      // llmRequest.error = {
      //   code: error.status,
      //   error: getErrorType(error.status),
      // };
      // await llmRequest.save();
      // await createLog({
      //   user: user as unknown as Schema.Types.ObjectId,
      //   type: "llm_request",
      //   action: "CHAT COMPLETION",
      //   entityId: llmRequest._id,
      //   details: { document: llmRequest.toJSON() },
      // });
      throw Error(getErrorType(error.status));
    } else {
      // llmRequest.error = { code: 500, error: "InternalServerError" };
      // await llmRequest.save();
      // await createLog({
      //   user: user as unknown as Schema.Types.ObjectId,
      //   type: "llm_request",
      //   action: "CHAT COMPLETION",
      //   entityId: llmRequest._id,
      //   details: { document: llmRequest.toJSON() },
      // });
      throw error;
    }
  }
};

const modifyChatCompletion = async (
  requestId: string,
  user: string,
  input: IChatCompletion
) => {
  const llmRequest = await LlmRequest.findOne({ _id: requestId, user });
  try {
    if (!llmRequest) {
      throw new Error("Request not found");
    }

    const {
      model,
      messages,
      frequency_penalty,
      n,
      max_tokens,
      temperature,
      top_p,
      logit_bias,
    } = input;

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      messages,
      model,
      frequency_penalty,
      n,
      max_tokens,
      temperature,
      top_p,
      logit_bias,
    });

    const responseTime = Date.now() - startTime;

    const responses = completion.choices
      .map((choice) => choice.message.content)
      .filter((item): item is string => item !== null);
    const usage = completion.usage;

    const version: IVersion = {
      llm: "openai",
      config: input,
      response: responses,
      tokenUsage: {
        completion: usage?.completion_tokens ?? 0,
        total: usage?.total_tokens ?? 0,
        prompt: usage?.prompt_tokens ?? 0,
      },
      responseTime: responseTime,
    };

    llmRequest.versions.push(version);
    llmRequest.versions.sort((a, b) => (a.createdAt! > b.createdAt! ? -1 : 1));

    await llmRequest.save();

    await createLog({
      user: llmRequest.user,
      type: "llm_request",
      action: "MODIFY CHAT COMPLETION",
      entityId: llmRequest._id,
      details: { document: llmRequest.toJSON() },
    });

    return { llmRequest, responses };
  } catch (error) {
    if (llmRequest) {
      if (error instanceof OpenAI.APIError) {
        console.log(error);
        llmRequest.error = {
          code: error.status,
          error: getErrorType(error.status),
        };
        await llmRequest.save();
        await createLog({
          user: llmRequest.user,
          type: "llm_request",
          action: "CHAT COMPLETION",
          entityId: llmRequest._id,
          details: { document: llmRequest.toJSON() },
        });
      } else {
        llmRequest.error = { code: 500, error: "InternalServerError" };
        await llmRequest.save();
        await createLog({
          user: llmRequest.user,
          type: "llm_request",
          action: "CHAT COMPLETION",
          entityId: llmRequest._id,
          details: { document: llmRequest.toJSON() },
        });
        throw error;
      }
    }
    throw error;
  }
};

const editChatCompletionName = async (
  requestId: string,
  user: string,
  newChatName: string
) => {
  const llmRequest = await LlmRequest.findOne({ _id: requestId, user });

  try {
    if (!llmRequest) {
      throw new Error("Request Not found");
    }
    const updatedRequest = await LlmRequest.findOneAndUpdate(
      { _id: requestId, user },
      {
        $set: {
          name: newChatName,
        },
      },
      { new: true }
    ).exec();

    return updatedRequest;
  } catch (error) {
    throw error;
  }
};

const deleteChatCompletion = async (
  requestId: string,
  user: string,
  folderId: string
) => {
  const llmRequest = await LlmRequest.findOne({ _id: requestId, user });

  try {
    if (!llmRequest) {
      throw new Error("Request Not found");
    }
    await LlmRequest.findOneAndDelete({
      _id: requestId,
      user,
    }).exec();
    if (folderId) {
      await Folder.findOneAndUpdate(
        { _id: folderId },
        {
          $pull: {
            requests: requestId,
          },
        },
        { new: true }
      );
    }

    return;
  } catch (error) {
    throw error;
  }
};

export {
  chatCompletion,
  modifyChatCompletion,
  editChatCompletionName,
  deleteChatCompletion,
};
