import fs from "fs";
import path from "path";
import multer from "multer";
import Jimp from "jimp";
import { Request, Response } from "express";
import { IImageCreation } from "../../types/openai";
import { getImageRequestsOfUser } from "../../model/image/image.model";
import {
  imageGeneration,
  imageEdit,
  imageVariation,
} from "../../requests/image/dalle";

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
    const input: IImageCreation = req.body;
    if (!input.prompt) {
      throw Error("prompt is required");
    }
    const responses = await imageGeneration(req.user._id, "openai", input);
    res.json({ responses });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpCreateImageEdit = async (req: Request, res: Response) => {
  try {
    uploadEdit(req, res, async (err) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      try {
        if (!req.files) {
          return res.status(400).json({ error: "Image file is missing" });
        }

        const input = req.body;

        if (!input.prompt) {
          throw Error("prompt is required");
        }

        const files = req.files as any;

        if (!files.image) {
          return res.status(400).json({ error: "Image file is missing" });
        }

        let jImage = await Jimp.read(files.image[0].buffer);

        const w = jImage.bitmap.width;
        const h = jImage.bitmap.height;

        if (w / h != 1) {
          throw Error("Image must be a square. Current ratio = " + w / h);
        }

        if (!jImage.rgba) {
          jImage = jImage.opacity(1);
        }
        const tempFilePath = path.join(
          tempFolderPath,
          `${Date.now()}_${files.image[0].originalname}`
        );
        await jImage.writeAsync(tempFilePath);
        input.image = tempFilePath;

        let mask;
        let tempEditPath;

        if (files.mask) {
          let jMask = await Jimp.read(files.mask[0].buffer);

          const w = jMask.bitmap.width;
          const h = jMask.bitmap.height;

          if (w / h != 1) {
            throw Error("Image must be a square. Current ratio = " + w / h);
          }

          if (!jMask.rgba) {
            jMask = jMask.opacity(1);
          }
          tempEditPath = path.join(
            tempFolderPath,
            `${Date.now()}_${files.mask[0].originalname}`
          );
          await jMask.writeAsync(tempEditPath);
          mask = tempEditPath;
        }
        input.mask = mask;

        const responses = await imageEdit(req.user._id, "openai", input);
        fs.unlinkSync(tempFilePath);
        if (tempEditPath) fs.unlinkSync(tempEditPath);
        res.json({ responses });
      } catch (error) {
        console.error("Error in /complete:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpCreateImageVariation = async (req: Request, res: Response) => {
  try {
    uploadVariation(req, res, async (err) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      try {
        if (!req.file) {
          return res.status(400).json({ error: "Image file is missing" });
        }

        const input = req.body;

        let jImage = await Jimp.read(req.file.buffer);

        const w = jImage.bitmap.width;
        const h = jImage.bitmap.height;

        if (w / h != 1) {
          throw Error("Image must be a square. Current ratio = " + w / h);
        }

        if (!jImage.rgba) {
          jImage = jImage.opacity(1);
        }
        const tempFilePath = path.join(
          tempFolderPath,
          `${Date.now()}_${req.file.originalname}`
        );
        await jImage.writeAsync(tempFilePath);
        input.image = tempFilePath;
        const responses = await imageVariation(req.user._id, "openai", input);
        fs.unlinkSync(tempFilePath);
        res.json({ responses });
      } catch (error) {
        console.error("Error in /complete:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const httpGetImageRequestsOfUser = async (req: Request, res: Response) => {
  try {
    const requests = await getImageRequestsOfUser(req.user._id);
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error in /complete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  httpCreateImageGeneration,
  httpCreateImageEdit,
  httpCreateImageVariation,
  httpGetImageRequestsOfUser,
};
