import { Schema } from "mongoose";
import fs from "fs";
import openai from "../../../config/openai";
import OpenAI from "openai";
import ImageRequest from "../../../model/image/image.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IImageVariation } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";

const imageVariation = async (
  user: string,
  llm: "openai",
  input: IImageVariation
) => {
  const imageRequest = new ImageRequest({
    type: "variation",
    user,
    llm,
    config: input,
    response: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
  });

  try {
    const { n, size, response_format, image } = input;

    const startTime = Date.now();

    const generation = await openai.images.createVariation({
      n,
      response_format,
      size,
      image: fs.createReadStream(image),
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
      action: "IMAGE VARIATION",
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
        action: "IMAGE VARIATION",
        entityId: imageRequest._id,
        details: { document: imageRequest.toJSON() },
      });
    } else {
      imageRequest.error = { code: 500, error: "InternalServerError" };
      await imageRequest.save();
      await createLog({
        user: user as unknown as Schema.Types.ObjectId,
        type: "image_request",
        action: "IMAGE VARIATION",
        entityId: imageRequest._id,
        details: { document: imageRequest.toJSON() },
      });
      throw error;
    }
  }
};

export { imageVariation };
