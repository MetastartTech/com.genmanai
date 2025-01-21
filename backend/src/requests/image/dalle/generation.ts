import { Schema } from "mongoose";

import openai from "../../../config/openai";
import OpenAI from "openai";

import ImageRequest from "../../../model/image/image.schema";
import { createLog } from "../../../model/logger/logger.model";

import { IImageCreation } from "../../../types/openai";
import { IImageVersion } from "../../../types/schema";

import { getErrorType } from "../../../util/apierror";

const imageGeneration = async (
  user: string,
  llm: "openai",
  name: string,
  input: IImageCreation
) => {
  const imageRequest = new ImageRequest({
    type: "generation",
    user,
    name,
    versions: [],
    error: undefined,
  });

  try {
    const { prompt, n, size, response_format, model } = input;

    const startTime = Date.now();

    const generation = await openai.images.generate({
      prompt,
      n,
      response_format,
      size,
      model,
    });

    const responseTime = Date.now() - startTime;

    const generations = generation.data.map((image) => {
      return image.url ? image.url : image.b64_json;
    });

    const responses = generations.filter(
      (response): response is string => typeof response === "string"
    );

    const version: IImageVersion = {
      llm,
      config: input,
      response: responses,
      responseTime,
    };

    imageRequest.versions.push(version);

    await imageRequest.save();

    await createLog({
      user: user as unknown as Schema.Types.ObjectId,
      type: "image_request",
      action: "IMAGE GENERATION",
      entityId: imageRequest._id,
      details: { document: imageRequest.toJSON() },
    });

    return { imageRequest, responses };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.log(error);
      throw Error(getErrorType(error.status));
    } else {
      throw error;
    }
  }
};

const modifyImageGeneration = async (
  requestId: string,
  user: string,
  input: IImageCreation
) => {
  const imageRequest = await ImageRequest.findOne({ _id: requestId, user });
  try {
    if (!imageRequest) {
      throw new Error("Request not found");
    }

    const { model, prompt, n, size, response_format } = input;

    const startTime = Date.now();

    const generation = await openai.images.generate({
      model,
      prompt,
      size,
      n,
      response_format,
    });

    const responseTime = Date.now() - startTime;

    const generations = generation.data.map((image) => {
      return image.url ? image.url : image.b64_json;
    });

    const responses = generations.filter(
      (response): response is string => typeof response === "string"
    );

    const version: IImageVersion = {
      llm: "openai",
      config: input,
      response: responses,
      responseTime,
    };

    imageRequest.versions.push(version);

    await imageRequest.save();

    await createLog({
      user: user as unknown as Schema.Types.ObjectId,
      type: "image_request",
      action: "MODIFY IMAGE GENERATION",
      entityId: imageRequest._id,
      details: { document: imageRequest.toJSON() },
    });

    return { imageRequest, responses };
  } catch (error) {
    if (imageRequest) {
      if (error instanceof OpenAI.APIError) {
        console.log(error);
        imageRequest.error = {
          code: error.status,
          error: getErrorType(error.status),
        };
        await imageRequest.save();
        await createLog({
          user: user as unknown as Schema.Types.ObjectId,
          type: "image_request",
          action: "IMAGE GENERATION",
          entityId: imageRequest._id,
          details: { document: imageRequest.toJSON() },
        });
      } else {
        imageRequest.error = { code: 500, error: "InternalServerError" };
        await imageRequest.save();
        await createLog({
          user: user as unknown as Schema.Types.ObjectId,
          type: "image_request",
          action: "IMAGE GENERATION",
          entityId: imageRequest._id,
          details: { document: imageRequest.toJSON() },
        });
      }
    }
    throw error;
  }
};

export { imageGeneration, modifyImageGeneration };
