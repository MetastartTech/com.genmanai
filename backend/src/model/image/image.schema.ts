import mongoose, { Schema } from "mongoose";
import { IImageRequest } from "../../types/schema";

const imageRequestSchema: Schema<IImageRequest> = new Schema<IImageRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    llm: {
      type: String,
      enum: ["openai"],
      required: true,
    },
    type: {
      type: String,
      enum: ["generation", "edit", "variantion"],
      required: true,
    },
    config: {
      type: {
        prompt: { type: String },
        n: { type: Number, default: 1 },
        size: {
          type: String,
          enum: ["256x256", "512x512", "1024x1024"],
          default: "1024x1024",
        },
        response_format: {
          type: String,
          enum: ["url", "b64_json"],
          default: "url",
        },
      },
      required: true,
    },
    response: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    responseTime: {
      type: Number,
      min: 0,
    },
    error: { code: Number, error: String },
  },
  {
    timestamps: true,
  }
);

const ImageRequest = mongoose.model<IImageRequest>(
  "ImageRequest",
  imageRequestSchema
);

export default ImageRequest;
