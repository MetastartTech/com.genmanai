import mongoose, { Schema } from "mongoose";
import { ILlmRequest } from "../../types/schema";

const versionSchema = new Schema(
  {
    config: {
      type: {
        model: {
          type: String,
          required: true,
        },
        messages: {
          type: [
            {
              role: {
                type: String,
                enum: ["system", "user", "assistant", "function", "model"],
              },
              content: String,
              parts: [
                {
                  text: String,
                },
              ],
            },
          ],
        },
        system: { type: String },
        prompt: { type: String },
        frequency_penalty: { type: Number, default: 0 },
        n: { type: Number, default: 1 },
        max_tokens: { type: Number, default: 16 },
        temperature: { type: Number, default: 1 },
        top_p: { type: Number, defaut: 1 },
        logit_bias: { type: Map, of: Number, default: {} },
        top_k: { type: Number, default: 1 },
      },
      required: true,
    },
    llm: {
      type: String,
      enum: ["openai", "gemini", "anthropic"],
      required: true,
    },
    response: [
      {
        type: String,
      },
    ],
    tokenUsage: {
      completion: {
        type: Number,
        default: 0,
        min: 0,
      },
      prompt: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    responseTime: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

const llmRequestSchema: Schema<ILlmRequest> = new Schema<ILlmRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["chat", "completion"],
      required: true,
    },
    folder: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    versions: [versionSchema],
    error: { code: Number, error: String },
  },
  {
    timestamps: true,
  }
);

const LlmRequest = mongoose.model<ILlmRequest>("LlmRequest", llmRequestSchema);

export default LlmRequest;
