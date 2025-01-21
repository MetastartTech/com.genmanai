interface IChatCompletion {
  model: "gpt-4" | "gpt-3.5-turbo" | "gpt-3.5-turbo-16k";
  messages: any[];
  frequency_penalty?: number | null;
  n?: number | null;
  max_tokens?: number;
  temperature?: number | null;
  top_p?: number | null;
  logit_bias?: Record<string, number> | null;
}

const ChatCompletionModels = ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"];


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

interface IImageVariation {
  image: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  response_format?: "url" | "b64_json";
}

export type {
  IChatCompletion,
  IImage,
  IImageCreation,
  IImageEdit,
  IImageVariation,
};

export { ChatCompletionModels };
