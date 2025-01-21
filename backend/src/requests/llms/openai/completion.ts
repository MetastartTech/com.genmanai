import { Schema } from "mongoose";
import openai from "../../../config/openai";
import OpenAI from "openai";
import LlmRequest from "../../../model/request/request.schema";
import { createLog } from "../../../model/logger/logger.model";
import { ICompletion } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";

const completion = async (
  user: string,
  name: string,
  llm: "openai",
  input: ICompletion
) => {
  const llmRequest = new LlmRequest({
    type: "completion",
    user,
    name,
    llm,
    model: input.model,
    config: input,
    response: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
  });

  try {
    const {
      model,
      prompt,
      frequency_penalty,
      n,
      max_tokens,
      temperature,
      top_p,
      logit_bias,
    } = input;

    const startTime = Date.now();

    const completion = await openai.completions.create({
      model,
      prompt,
      frequency_penalty,
      logit_bias,
      max_tokens,
      n: Number(n),
      temperature,
      top_p,
    });

    const responseTime = Date.now() - startTime;

    const responses = completion.choices.map((choice) => choice.text);
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
      action: "COMPLETION",
      entityId: llmRequest._id,
      details: { document: llmRequest.toJSON() },
    });

    return { llmRequest, responses };
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
        action: "COMPLETION",
        entityId: llmRequest._id,
        details: { document: llmRequest.toJSON() },
      });
    } else {
      llmRequest.error = { code: 500, error: "InternalServerError" };
      await llmRequest.save();
      await createLog({
        user: user as unknown as Schema.Types.ObjectId,
        type: "llm_request",
        action: "COMPLETION",
        entityId: llmRequest._id,
        details: { document: llmRequest.toJSON() },
      });
      throw error;
    }
  }
};

export { completion };
