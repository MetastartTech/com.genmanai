import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "./env";

const anthropic = new Anthropic({
  apiKey: process.env[ANTHROPIC_API_KEY ?? ""],
});

export default anthropic;
