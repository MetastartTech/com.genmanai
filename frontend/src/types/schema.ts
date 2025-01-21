interface IPlan {
  _id: string;
  name: string;
  subtitle: string;
  priceId: string | null;
  price: string;
  amount: number;
  credits: {
    llm: number;
    image: number;
  };
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IPurchaseDetails {
  stripeReferenceId: string;
  plan: IPlan;
}

interface ICredits {
  llm: number;
  image: number;
}

interface IUser {
  fullName: string;
  displayPicture: string;
  email: string;
  freeUsed: boolean;
  purchaseHistory: IPurchaseDetails[];
  creditsWallet: ICredits;
  referredBy: string | null;
  joinedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IFolder {
  _id: string;
  user: string;
  name: string;
  parentFolder: IFolder | null;
  folders: IFolder[];
  requests: any[];
}

type MessageType = {
  role: "user" | "system";
  content: string;
  _id: string;
};

type ConfigType = {
  model: string;
  messages: MessageType[];
  frequency_penalty: number;
  n: number;
  max_tokens: number;
  temperature: number;
  logit_bias: any;
  _id: string;
};

type TokenType = {
  completion: number;
  prompt: number;
  total: number;
};

type ResponseType = string[];

interface IRequest {
  tokenUsage: TokenType;
  _id: string;
  user: "user" | "system" | "assistant";
  name: string;
  llm: "openai";
  type: "chat" | "completion";
  config: ConfigType;
  response: ResponseType;
  responseTime: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ITabRequest {
  _id: string;
  name: string;
  type: "chat" | "completion";
}

interface IImageTabRequest {
  _id: string;
  name: string;
  type: "generation" | "edit";
}

export type {
  IUser,
  IRequest,
  ITabRequest,
  IFolder,
  IImageTabRequest,
  ICredits,
  IPlan
};
