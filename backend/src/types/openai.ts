enum APIError {
  BadRequestError = 400,
  AuthenticationError = 401,
  PermissionDeniedError = 403,
  NotFoundError = 404,
  UnprocessableEntityError = 422,
  RateLimitError = 429,
}

type APIErrorType = keyof typeof APIError;

interface IChatCompletion {
  model:
    | "gpt-4"
    | "gpt-4-0314"
    | "gpt-4-0613"
    | "gpt-4-32k"
    | "gpt-4-32k-0314"
    | "gpt-4-32k-0613"
    | "gpt-3.5-turbo"
    | "gpt-3.5-turbo-16k"
    | "gpt-3.5-turbo-0301"
    | "gpt-3.5-turbo-0613"
    | "gpt-3.5-turbo-16k-0613";
  messages: {
    role: "system" | "user" | "assistant" | "function";
    content: string;
  }[];
  frequency_penalty?: number | null;
  n?: number | null;
  max_tokens?: number;
  temperature?: number | null;
  top_p?: number | null;
  logit_bias?: Record<string, number> | null;
}

const ChatCompletionModels = [
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k-0613",
];

interface ICompletion {
  model:
    | "babbage-002"
    | "davinci-002"
    | "text-davinci-003"
    | "text-davinci-002"
    | "text-davinci-001"
    | "code-davinci-002"
    | "text-curie-001"
    | "text-babbage-001"
    | "text-ada-001";
  prompt: string;
  frequency_penalty?: number | null;
  n?: number | null;
  max_tokens?: number;
  temperature?: number | null;
  top_p?: number | null;
  logit_bias?: Record<string, number> | null;
}

const CompletionModels = [
  "babbage-002",
  "davinci-002",
  "text-davinci-003",
  "text-davinci-002",
  "text-davinci-001",
  "code-davinci-002",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001",
];

interface IImage {
  url: string;
}

interface IImageCreation {
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

interface IImageEdit {
  image: string;
  mask?: string;
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

interface IImageVariation{
  image: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export {
  IChatCompletion,
  APIError,
  APIErrorType,
  ICompletion,
  ChatCompletionModels,
  CompletionModels,
  IImage,
  IImageCreation,
  IImageEdit,
  IImageVariation,
};
