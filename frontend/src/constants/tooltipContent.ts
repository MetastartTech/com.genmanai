import {
  TEMPERATURE,
  TOP_P,
  MAX_TOKENS,
  SYSTEM_PROMPT,
  MODEL_SETTINGS,
  PARAMETER_SETTINGS,
  OUTPUT_SETTINGS,
  MODEL,
  TOP_K,
  CONFIGURE_TEST,
  ANALYZE_RESULTS,
  REFINE_DEPLOY,
} from "./tooltipName";

interface mapType {
  [key: string]: string;
}

const tooltipContent: mapType = {
  [TEMPERATURE]: ` Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.`,
  [TOP_P]: `An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
    We generally recommend altering this or temperature but not both.`,
  [MAX_TOKENS]: `The maximum number of tokens that can be generated in the chat completion.`,
  [SYSTEM_PROMPT]: `This helps set the behavior of the assistant. If properly crafted, the system message can be used to set the tone and the kind of response by the model`,
  [MODEL_SETTINGS]: `Configure which model you want to use for your request`,
  [PARAMETER_SETTINGS]: `Helps you to set up how direct or creative you want your response to be`,
  [OUTPUT_SETTINGS]: `The format of your output can be set here`,
  [MODEL]: "Check Out which model you want to use for your request",
  [TOP_K]:
    "Sample from the k most likely next tokens at each step. Lower k focuses on higher probability tokens.",
  [CONFIGURE_TEST]:
    "Select your LLM, define model parameters, and craft your prompt",
  [ANALYZE_RESULTS]:
    "Review comprehensive analytics to understand response efficiency and cost",
  [REFINE_DEPLOY]:
    "Utilize insights to refine prompts, organize your tests, and export code directly into your development environment",
};

export default tooltipContent;
