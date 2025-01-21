import { Document, Schema } from "mongoose";
import {
  IChatCompletion,
  ICompletion,
  IImageCreation,
  IImageEdit,
  IImageVariation,
} from "./openai";
import { IGeneration } from "./gemini";
import { IAnthropicMessages } from "./anthropic";

interface IPlan extends Document {
  name: string;
  subtitle: string;
  priceId: string | null;
  price: string;
  amount: Number;
  credits: {
    llm: number;
    image: number;
  };
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IPurchaseDetails {
  invoice: string;
  plan: IPlan | null;
}

interface ICredits {
  llm: number;
  image: number;
}

interface IUser extends Document {
  fullName: string;
  displayPicture: string;
  email: string;
  freeUsed: boolean;
  purchaseHistory: IPurchaseDetails[];
  creditsWallet: ICredits;
  createdAt: Date;
  updatedAt: Date;
}

interface ITokenUsage {
  completion: number;
  prompt: number;
  total: number;
}

interface IVersion {
  config: IChatCompletion | ICompletion | IGeneration | IAnthropicMessages;
  llm: "openai" | "gemini" | "anthropic";
  response: string[] | null;
  tokenUsage: ITokenUsage;
  responseTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ILlmRequest extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  type: "chat" | "completion";
  versions: IVersion[];
  folder: Schema.Types.ObjectId | null;
  error?: { code?: number; error: string };
}

interface IFolder extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  parentFolder?: Schema.Types.ObjectId;
  folders: Schema.Types.ObjectId[];
  requests: Schema.Types.ObjectId[];
  type: "llm" | "image";
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

interface IImageVersion {
  llm: "openai";
  config: IImageCreation | IImageEdit | IImageVariation;
  response: string[] | null;
  responseTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface IImageRequest extends Document {
  name: string;
  user: Schema.Types.ObjectId;
  
  type: "generation" | "edit" | "variation";
  versions: IImageVersion[];
  folder: Schema.Types.ObjectId | null;
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

interface IReferral {
  code: string;
  user: Schema.Types.ObjectId;
  timesUsed: number;
  limit: number;
  usedFingerprints: number[];
  rewardClaimed: boolean;
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
  IVersion,
  IImageVersion,
  IReferral,
  IPlan,
};
