import { Schema } from "mongoose";
import openai from "../../../config/openai";
import OpenAI from "openai";
import ImageRequest from "../../../model/image/image.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IImageCreation } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";

const imageGeneration = async (
  user: string,
  llm: "openai",
  input: IImageCreation
) => {
  const imageRequest = new ImageRequest({
    type: "generation",
    user,
    llm,
    config: input,
    response: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
  });

  try {
    const { prompt, n, size, response_format } = input;

    const startTime = Date.now();

    const generation = await openai.images.generate({
      prompt,
      n,
      response_format,
      size,
    });

    const responseTime = Date.now() - startTime;

    const responses = generation.data.map((image) => {
      return image.url ? image.url : image.b64_json;
    });
    imageRequest.response = responses.filter(
      (response): response is string => typeof response === "string"
    );
    imageRequest.responseTime = responseTime;

    await imageRequest.save();

    await createLog({
      user: user as unknown as Schema.Types.ObjectId,
      type: "image_request",
      action: "IMAGE GENERATION",
      entityId: imageRequest._id,
      details: { document: imageRequest.toJSON() },
    });

    return responses;
  } catch (error) {
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
      throw error;
    }
    
  }
};

export { imageGeneration };
