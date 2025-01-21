import gemini from "../../../config/gemini";
import LlmRequest from "../../../model/request/request.schema";
import { IGeneration } from "../../../types/gemini";
import { IVersion } from "../../../types/schema";
import { createLog } from "../../../model/logger/logger.model";
import { Schema } from "mongoose";

const generation = async (
  user: string,
  llm: "gemini",
  name: string,
  input: IGeneration
) => {
  const llmRequest = new LlmRequest({
    type: "chat",
    user,
    name,
    versions: [],
    error: undefined,
  });

  try {
    const { model, messages, max_tokens, temperature, top_p, top_k } = input;

    const generationConfig = {
      temperature: temperature ?? 0.9,
      topK: top_k ?? 1,
      topP: top_p ?? 1,
      maxOutputTokens: max_tokens ?? 2048,
    };

    const startTime = Date.now();

    const geminiModel = gemini.getGenerativeModel({ model });

    const prompt = messages.find((message) => message.role === "user").parts[0]
      .text;
    const history = messages.filter((message) => message.role !== "user");

    const chat = geminiModel.startChat({
      history: [
        { role: "user", parts: history[0].parts },
        { role: "model", parts: [{ text: "Okay" }] },
      ],
      generationConfig,
    });

    const completion = await chat.sendMessage(prompt);

    const responseTime = Date.now() - startTime;

    const responses = completion.response.text();

    const inputTokens = (
      await geminiModel.countTokens(
        messages.map((message) => message.parts[0].text)
      )
    ).totalTokens;
    const outputTokens = (await geminiModel.countTokens(responses)).totalTokens;
    const usage = {
      prompt: inputTokens,
      completion: outputTokens,
      total: inputTokens + outputTokens,
    };

    const version: IVersion = {
      llm,
      config: input,
      response: [responses],
      tokenUsage: {
        completion: usage?.completion ?? 0,
        total: usage?.total ?? 0,
        prompt: usage?.prompt ?? 0,
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

    return { llmRequest, responses: [responses] };
  } catch (error) {
    throw error;
  }
};

const editGeneration = async (
  requestId: string,
  user: string,
  input: IGeneration
) => {
  const llmRequest = await LlmRequest.findOne({ _id: requestId, user });
  try {
    if (!llmRequest) {
      throw new Error("Request not found");
    }

    const { model, messages, max_tokens, temperature, top_p, top_k } = input;

    const generationConfig = {
      temperature: temperature ?? 0.9,
      topK: top_k ?? 1,
      topP: top_p ?? 1,
      maxOutputTokens: max_tokens ?? 2048,
    };

    const startTime = Date.now();

    const geminiModel = gemini.getGenerativeModel({ model });

    const prompt = messages.find((message) => message.role === "user").parts[0]
      .text;
    const history = messages.filter((message) => message.role !== "user");

    const chat = geminiModel.startChat({
      history: [
        { role: "user", parts: history[0].parts },
        { role: "model", parts: [{ text: "Okay" }] },
      ],
      generationConfig,
    });

    const completion = await chat.sendMessage(prompt);

    const responseTime = Date.now() - startTime;

    const responses = completion.response.text();

    const inputTokens = (
      await geminiModel.countTokens(
        messages.map((message) => message.parts[0].text)
      )
    ).totalTokens;
    const outputTokens = (await geminiModel.countTokens(responses)).totalTokens;
    const usage = {
      prompt: inputTokens,
      completion: outputTokens,
      total: inputTokens + outputTokens,
    };

    const version: IVersion = {
      llm: "gemini",
      config: input,
      response: [responses],
      tokenUsage: {
        completion: usage?.completion ?? 0,
        total: usage?.total ?? 0,
        prompt: usage?.prompt ?? 0,
      },
      responseTime: responseTime,
    };

    llmRequest.versions.push(version);

    await llmRequest.save();

    await createLog({
      user: llmRequest.user,
      type: "llm_request",
      action: "MODIFY CHAT COMPLETION",
      entityId: llmRequest._id,
      details: { document: llmRequest.toJSON() },
    });

    return { llmRequest, responses: [responses] };
  } catch (error) {
    throw error;
  }
};

export default generation;
export { editGeneration };
