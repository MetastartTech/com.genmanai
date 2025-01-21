import mongoose, { Schema } from "mongoose";
import { IImageRequest } from "../../types/schema";

const versionSchema = new Schema(
  {
    config: {
      type: {
        prompt: { type: String },
        n: { type: Number, default: 1 },
        model: {
          type: String,
          enum: ["dall-e-2", "dall-e-3"],
          default: "dall-e-2",
        },
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
    llm: {
      type: String,
      enum: ["openai"],
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
  },
  { timestamps: true }
);

const imageRequestSchema: Schema<IImageRequest> = new Schema<IImageRequest>(
  {
    name: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["generation", "edit", "variantion"],
      required: true,
    },
    versions: [versionSchema],
    folder: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
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
