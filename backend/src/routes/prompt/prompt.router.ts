import express from "express";
import {
  httpCreatePromptTemplate,
  httpDeletePromptTemplate,
  httpGetAllPromptTemplates,
  httpGetPromptTemplateById,
  httpUpdatePromptTemplate,
} from "./prompt.controller";

const promptRouter = express.Router();

promptRouter.post("/", httpCreatePromptTemplate);
promptRouter.get("/", httpGetAllPromptTemplates);
promptRouter.get("/:templateId", httpGetPromptTemplateById);
promptRouter.put("/:templateId", httpUpdatePromptTemplate);
promptRouter.delete("/:templateId", httpDeletePromptTemplate);

export default promptRouter;
