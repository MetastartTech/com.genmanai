import { Request, Response } from "express";
import {
  getLogsByEntity,
  getLogsByType,
  getLogsByUser,
} from "../../model/logger/logger.model";

const httpGetUserLogs = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const logs = await getLogsByUser(user._id);
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create prompt template" });
  }
};

const httpGetUserLogsByType = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const type = req.params.type;
    const logs = await getLogsByType(user._id, type);
    return res.status(201).json(logs);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create prompt template" });
  }
};

const httpGetUserLogsByEntity = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const entity = req.params.entity;
    const logs = await getLogsByEntity(user._id, entity);
    return res.status(201).json(logs);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create prompt template" });
  }
};

export { httpGetUserLogs, httpGetUserLogsByEntity, httpGetUserLogsByType };
