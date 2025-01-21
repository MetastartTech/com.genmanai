import { Schema } from "mongoose";
import LlmRequest from "../../../model/request/request.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IVersion } from "../../../types/schema";
import { IAnthropicMessages } from "../../../types/anthropic";
import anthropic from "../../../config/anthropic";

const createMessages = async (
  user: string,
  llm: "anthropic",
  name: string,
  input: IAnthropicMessages
) => {
  const llmRequest = new LlmRequest({
    type: "chat",
    user,
    name,
    versions: [], // Initialize an empty versions array
    error: undefined, // Ensure error field is initialized
  });

  try {
    const { model, messages, max_tokens, temperature, top_p, top_k, system } =
      input;

    const startTime = Date.now();

    const completion = await anthropic.messages.create({
      messages,
      model,
      max_tokens,
      temperature,
      top_p,
      top_k,
      system,
    });

    const responseTime = Date.now() - startTime;

    const responses = completion.content
      .filter((res) => res.type === "text")
      .map((response) => response.text);
    const usage = completion.usage;

    const version: IVersion = {
      llm,
      config: input,
      response: responses,
      tokenUsage: {
        completion: usage?.output_tokens ?? 0,
        total: usage?.input_tokens + usage?.output_tokens ?? 0,
        prompt: usage?.input_tokens ?? 0,
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
    throw error;
  }
};

const modifyMessages = async (
  requestId: string,
  user: string,
  input: IAnthropicMessages
) => {
  const llmRequest = await LlmRequest.findOne({ _id: requestId, user });
  try {
    if (!llmRequest) {
      throw new Error("Request not found");
    }

    const { model, messages, system, max_tokens, temperature, top_p, top_k } =
      input;

    const startTime = Date.now();

    const completion = await anthropic.messages.create({
      messages,
      model,
      system,
      max_tokens,
      temperature,
      top_p,
      top_k,
    });

    const responseTime = Date.now() - startTime;

    const responses = completion.content
      .filter((res) => res.type === "text")
      .map((response) => response.text);
    const usage = completion.usage;

    const version: IVersion = {
      llm: "anthropic",
      config: input,
      response: responses,
      tokenUsage: {
        completion: usage?.output_tokens ?? 0,
        total: usage?.input_tokens + usage?.output_tokens ?? 0,
        prompt: usage?.input_tokens ?? 0,
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
    throw error;
  }
};

export { createMessages, modifyMessages };
