interface IAnthropicMessages {
  model:
    | "claude-3-opus-20240229"
    | "claude-3-sonnet-20240229"
    | "claude-2.1"
    | "claude-2.0";
  messages: any[];
  max_tokens: number;
  system?: string;
  temperature?: number;
  top_k?: number;
  top_p?: number;
}

const AnthropicMessageModels = [
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-2.1",
  "claude-2.0",
];

export { IAnthropicMessages, AnthropicMessageModels };
