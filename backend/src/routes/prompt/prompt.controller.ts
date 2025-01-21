import { Request, Response } from "express";
import PromptTemplate from "../../model/prompt/prompt.schema";
import { createLog } from "../../model/logger/logger.model";

const httpCreatePromptTemplate = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { name, template, variables } = req.body;
    const promptTemplate = new PromptTemplate({
      user: user._id,
      name,
      template,
      variables,
    });
    await promptTemplate.save();
    await createLog({
      user: req.user._id,
      type: "prompt",
      action: "CREATE PROMPT TEMPLATE",
      entityId: promptTemplate._id,
      details: { document: promptTemplate.toJSON() },
    });

    return res.status(201).json(promptTemplate);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create prompt template" });
  }
};

const httpGetAllPromptTemplates = async (req: Request, res: Response) => {
  try {
    const promptTemplates = await PromptTemplate.find({ user: req.user._id });
    return res.status(200).json(promptTemplates);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch prompt templates" });
  }
};

const httpGetPromptTemplateById = async (req: Request, res: Response) => {
  try {
    const promptTemplate = await PromptTemplate.findOne({
      _id: req.params.templateId,
      user: req.user._id,
    });
    if (!promptTemplate) {
      return res.status(404).json({ error: "Prompt template not found" });
    }
    return res.status(200).json(promptTemplate);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch prompt template" });
  }
};

const httpUpdatePromptTemplate = async (req: Request, res: Response) => {
  try {
    const { name, template, variables } = req.body;
    const updatedPromptTemplate = await PromptTemplate.findOneAndUpdate(
      { _id: req.params.templateId, user: req.user._id },
      { name, template, variables },
      { new: true }
    );
    if (!updatedPromptTemplate) {
      return res.status(404).json({ error: "Prompt template not found" });
    }
    await createLog({
      user: req.user._id,
      type: "prompt",
      action: "UPDATE PROMPT TEMPLATE",
      entityId: updatedPromptTemplate._id,
      details: { document: updatedPromptTemplate.toJSON() },
    });
    return res.status(200).json(updatedPromptTemplate);
  } catch (error) {
    return res.status(500).json({ error: "Unable to update prompt template" });
  }
};

const httpDeletePromptTemplate = async (req: Request, res: Response) => {
  try {
    const promptTemplate = await PromptTemplate.findOneAndRemove({
      _id: req.params.templateId,
      user: req.user._id,
    });
    if (!promptTemplate) {
      return res.status(404).json({ error: "Prompt template not found" });
    }
    await createLog({
      user: req.user._id,
      type: "prompt",
      action: "DELETE PROMPT TEMPLATE",
      entityId: promptTemplate._id,
      details: { document: promptTemplate.toJSON() },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Unable to delete prompt template" });
  }
};

export {
  httpCreatePromptTemplate,
  httpDeletePromptTemplate,
  httpGetAllPromptTemplates,
  httpGetPromptTemplateById,
  httpUpdatePromptTemplate,
};
