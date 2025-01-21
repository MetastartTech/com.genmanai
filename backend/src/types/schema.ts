import { Document, Schema } from "mongoose";
import {
  IChatCompletion,
  ICompletion,
  IImageCreation,
  IImageEdit,
  IImageVariation,
} from "./openai";

type Subscription = { active: boolean };

interface IUser extends Document {
  fullName: string;
  displayPicture: string;
  email: string;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

interface ITokenUsage {
  completion: number;
  prompt: number;
  total: number;
}

interface ILlmRequest extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  llm: "openai";
  type: "chat" | "completion";
  config: IChatCompletion | ICompletion;
  response: string[] | null;
  tokenUsage: ITokenUsage;
  responseTime?: number;
  error?: { code?: number; error: string };
}

interface IFolder extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  parentFolder?: Schema.Types.ObjectId;
  folders: Schema.Types.ObjectId[];
  requests: Schema.Types.ObjectId[];
}

type VariableType = "string" | "boolean" | "number";

interface IVariableDefinition {
  name: string;
  type: VariableType;
  defaultValue?: string | boolean | number;
}

interface IPromptTemplate extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  template: string;
  variables: Record<string, IVariableDefinition>;
}

interface IImageRequest extends Document {
  user: Schema.Types.ObjectId;
  llm: "openai";
  type: "generation" | "edit" | "variation";
  config: IImageCreation | IImageEdit | IImageVariation;
  response: string[] | null;
  tokenUsage: ITokenUsage;
  responseTime?: number;
  error?: { code?: number; error: string };
}

type ActivityType = "folder" | "prompt" | "llm_request" | "image_request";

interface IUserActivityLog extends Document {
  user: Schema.Types.ObjectId;
  timestamp: Date;
  type: ActivityType;
  action: string;
  entityId: Schema.Types.ObjectId;
  details: Record<string, any>;
}

export type {
  IUser,
  ILlmRequest,
  IFolder,
  IVariableDefinition,
  IPromptTemplate,
  IImageRequest,
  ActivityType,
  IUserActivityLog,
};
