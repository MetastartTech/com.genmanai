import { Schema } from "mongoose";
import fs from "fs";
import openai from "../../../config/openai";
import OpenAI from "openai";
import ImageRequest from "../../../model/image/image.schema";
import { createLog } from "../../../model/logger/logger.model";
import { IImageEdit } from "../../../types/openai";
import { getErrorType } from "../../../util/apierror";

const imageEdit = async (user: string, llm: "openai", input: IImageEdit) => {
  const imageRequest = new ImageRequest({
    type: "edit",
    user,
    llm,
    config: input,
    response: [],
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
  });

  try {
    const { prompt, n, size, response_format, image, mask } = input;

    const startTime = Date.now();

    const generation = await openai.images.edit({
      prompt,
      n,
      response_format,
      size,
      image: fs.createReadStream(image),
      mask: mask ? fs.createReadStream(mask) : undefined,
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
      action: "IMAGE EDIT",
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
        action: "IMAGE EDIT",
        entityId: imageRequest._id,
        details: { document: imageRequest.toJSON() },
      });
    } else {
      imageRequest.error = { code: 500, error: "InternalServerError" };
      await imageRequest.save();
      await createLog({
        user: user as unknown as Schema.Types.ObjectId,
        type: "image_request",
        action: "IMAGE EDIT",
        entityId: imageRequest._id,
        details: { document: imageRequest.toJSON() },
      });
      throw error;
    }
  }
};

export { imageEdit };
