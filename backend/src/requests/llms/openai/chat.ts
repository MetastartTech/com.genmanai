import { Schema } from "mongoose";
import openai from "../../../config/openai";
import OpenAI from "openai";
import LlmRequest from "../../../model/request/request.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IChatCompletion } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";

const chatCompletion = async (
  user: string,
  llm: "openai",
  input: IChatCompletion
) => {
  const llmRequest = new LlmRequest({
    type: "chat",
    user,
    llm,
    model: input.model,
    config: input,
    response: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
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
      model,
      messages,
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

    llmRequest.tokenUsage = {
      completion: usage?.completion_tokens ?? 0,
      total: usage?.total_tokens ?? 0,
      prompt: usage?.prompt_tokens ?? 0,
    };
    llmRequest.response = responses;
    llmRequest.responseTime = responseTime;

    await llmRequest.save();

    await createLog({
      user: user as unknown as Schema.Types.ObjectId,
      type: "llm_request",
      action: "CHAT COMPLETION",
      entityId: llmRequest._id,
      details: { document: llmRequest.toJSON() },
    });

    return responses;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.log(error);
      llmRequest.error = {
        code: error.status,
        error: getErrorType(error.status),
      };
      await llmRequest.save();
      await createLog({
        user: user as unknown as Schema.Types.ObjectId,
        type: "llm_request",
        action: "CHAT COMPLETION",
        entityId: llmRequest._id,
        details: { document: llmRequest.toJSON() },
      });
    } else {
      llmRequest.error = { code: 500, error: "InternalServerError" };
      await llmRequest.save();
      await createLog({
        user: user as unknown as Schema.Types.ObjectId,
        type: "llm_request",
        action: "CHAT COMPLETION",
        entityId: llmRequest._id,
        details: { document: llmRequest.toJSON() },
      });
      throw error;
    }
  }
};

export { chatCompletion };
