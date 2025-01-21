import fs from "fs";
import path from "path";
import multer from "multer";
import Jimp from "jimp";
import { Request, Response } from "express";
import { IImageCreation } from "../../types/openai";
import {
  getImageRequestsOfUser,
  getRequest,
} from "../../model/image/image.model";
import { imageGeneration } from "../../requests/image/dalle";
import { modifyImageGeneration } from "../../requests/image/dalle/generation";
import ImageRequest from "../../model/image/image.schema";
import Folder from "../../model/folder/folder.schema";
import { useImageQuery } from "../../model/user/user.model";

const tempFolderPath = path.join(__dirname, "../../..", "temp");

if (!fs.existsSync(tempFolderPath)) {
  fs.mkdirSync(tempFolderPath);
}

const storage = multer.memoryStorage();
const uploadEdit = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "mask", maxCount: 1 },
]);
const uploadVariation = multer({ storage }).single("image");

const httpCreateImageGeneration = async (req: Request, res: Response) => {
  try {
    const { name, input }: { name: string; input: IImageCreation } = req.body;
    if (!input.prompt) {
      throw Error("prompt is required");
    }
    const responses = await imageGeneration(
      req.user._id,
      "openai",
      name,
      input
    );
    const credits = await useImageQuery(req.user._id);
    res.status(201).json({
      request: responses?.imageRequest,
      responses: responses?.responses,
      credits,
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const httpCreateImageEdit = async (req: Request, res: Response) => {
//   try {
//     uploadEdit(req, res, async (err) => {
//       if (err) {
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//       try {
//         if (!req.files) {
//           return res.status(400).json({ error: "Image file is missing" });
//         }

//         const input = req.body;

//         if (!input.prompt) {
//           throw Error("prompt is required");
//         }

//         const files = req.files as any;

//         if (!files.image) {
//           return res.status(400).json({ error: "Image file is missing" });
//         }

//         let jImage = await Jimp.read(files.image[0].buffer);

//         const w = jImage.bitmap.width;
//         const h = jImage.bitmap.height;

//         if (w / h != 1) {
//           throw Error("Image must be a square. Current ratio = " + w / h);
//         }

//         if (!jImage.rgba) {
//           jImage = jImage.opacity(1);
//         }
//         const tempFilePath = path.join(
//           tempFolderPath,
//           `${Date.now()}_${files.image[0].originalname}`
//         );
//         await jImage.writeAsync(tempFilePath);
//         input.image = tempFilePath;

//         let mask;
//         let tempEditPath;

//         if (files.mask) {
//           let jMask = await Jimp.read(files.mask[0].buffer);

//           const w = jMask.bitmap.width;
//           const h = jMask.bitmap.height;

//           if (w / h != 1) {
//             throw Error("Image must be a square. Current ratio = " + w / h);
//           }

//           if (!jMask.rgba) {
//             jMask = jMask.opacity(1);
//           }
//           tempEditPath = path.join(
//             tempFolderPath,
//             `${Date.now()}_${files.mask[0].originalname}`
//           );
//           await jMask.writeAsync(tempEditPath);
//           mask = tempEditPath;
//         }
//         input.mask = mask;

//         const responses = await imageEdit(req.user._id, "openai", input);
//         fs.unlinkSync(tempFilePath);
//         if (tempEditPath) fs.unlinkSync(tempEditPath);
//         res.json({ responses });
//       } catch (error) {
//         console.error("Error in /complete:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
//   } catch (error) {
//     console.error("Error in /complete:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const httpCreateImageVariation = async (req: Request, res: Response) => {
//   try {
//     uploadVariation(req, res, async (err) => {
//       if (err) {
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//       try {
//         if (!req.file) {
//           return res.status(400).json({ error: "Image file is missing" });
//         }

//         const input = req.body;

//         let jImage = await Jimp.read(req.file.buffer);

//         const w = jImage.bitmap.width;
//         const h = jImage.bitmap.height;

//         if (w / h != 1) {
//           throw Error("Image must be a square. Current ratio = " + w / h);
//         }

//         if (!jImage.rgba) {
//           jImage = jImage.opacity(1);
//         }
//         const tempFilePath = path.join(
//           tempFolderPath,
//           `${Date.now()}_${req.file.originalname}`
//         );
//         await jImage.writeAsync(tempFilePath);
//         input.image = tempFilePath;
//         const responses = await imageVariation(req.user._id, "openai", input);
//         fs.unlinkSync(tempFilePath);
//         res.json({ responses });
//       } catch (error) {
//         console.error("Error in /complete:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     });
//   } catch (error) {
//     console.error("Error in /complete:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const httpGetImageRequestsOfUser = async (req: Request, res: Response) => {
  try {
    const requests = await getImageRequestsOfUser(req.user._id);
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpGetRequest = async (req: Request, res: Response) => {
  try {
    const request = await getRequest(req.user._id, req.params.id);
    return res.status(200).json(request);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpModifyImageGeneration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    if (!input.prompt) {
      throw Error("prompt is required");
    }
    if (!["dall-e-2", "dall-e-3"].includes(input.model)) {
      throw Error("model not found");
    }
    const responses = await modifyImageGeneration(id, req.user._id, input);
    const credits = await useImageQuery(req.user._id);
    res.status(201).json({
      request: responses?.imageRequest,
      responses: responses?.responses,
      credits,
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpEditName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (name.trim().length < 3) {
      throw Error("Invalid Name, minimum 3 characters required");
    }

    const response = await ImageRequest.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name },
      { new: true }
    );
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpDeleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = await ImageRequest.findOne({ _id: id, user: req.user._id });
    if (!image) {
      res.json(404).send("Image request not found");
    }
    if (image?.folder) {
      await Folder.findOneAndUpdate(
        { _id: image.folder },
        {
          $pull: {
            requests: image._id,
          },
        },
        { new: true }
      );
    }
    await ImageRequest.findByIdAndDelete(image?._id);
    return res.status(204).send(image);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpCompareImages = async (req: Request, res: Response) => {
  try {
    const { input1, input2 } = req.body;

    if (!input1.prompt || !input2.prompt) {
      throw Error("prompt is required");
    }

    const operations = [input1, input2].map((input, index) => {
      return imageGeneration(
        req.user._id,
        "openai",
        `Compare Model ${index + 1}`,
        input
      )
        .then((response) => ({
          status: "fulfilled",
          model: index + 1,
          response,
        }))
        .catch((error) => ({ status: "rejected", model: index + 1, error }));
    });

    const results = await Promise.all(operations);

    const successfulModels = results
      .filter((result) => result?.status === "fulfilled")
      .map((result) => result?.model);

    let credits = null;

    if (successfulModels.length > 0) {
      credits = await useImageQuery(req.user._id, successfulModels.length);
    }

    res.status(201).json({
      results,
      credits,
    });
  } catch (error) {
    console.error("Error in /request/compare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  httpCreateImageGeneration,
  // httpCreateImageEdit,
  // httpCreateImageVariation,
  httpGetImageRequestsOfUser,
  httpGetRequest,
  httpModifyImageGeneration,
  httpEditName,
  httpDeleteRequest,
  httpCompareImages,
};
