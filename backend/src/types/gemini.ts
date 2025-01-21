interface IGeneration {
  model: "gemini-pro";
  messages: any[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export { IGeneration };
