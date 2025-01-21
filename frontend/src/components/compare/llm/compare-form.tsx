"use client";

import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import ComboBox from "../../dashboard/combobox";
import { ChatCompletionModels } from "../../../types/openai";
import TooltipHover from "../../common/tooltip-hover";
import {
  MAX_TOKENS,
  MODEL,
  TEMPERATURE,
  TOP_K,
  TOP_P,
} from "@/constants/tooltipName";
import { AnthropicMessageModels } from "@/types/anthropic";

interface FormProps {
  form: {
    name: string;
    llm: string;
    temperature: number[];
    max_tokens: number[];
    top_p: number[];
    top_k: number[];
    request: string;
    model: string;
    type: string;
    n: string;
  };
  handleFormChange: (key: string, value: any) => void;
}

const CompareForm: React.FC<FormProps> = ({ form, handleFormChange }) => {
  return (
    <div className="flex flex-col gap-5 w-full md:basis-1/2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">LLM</Label>
        <ComboBox
          emptystring="No llm found."
          placeholder="Select llm..."
          searchstring="Search llm..."
          options={
            [
              { value: "openai", label: "OpenAi" },
              { value: "gemini", label: "Gemini" },
              { value: "anthropic", label: "Anthropic" },
            ] ?? []
          }
          value={form.llm}
          setValue={(value) => {
            handleFormChange("llm", value);
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center">
          <Label htmlFor="name" className="mr-2">
            Model
          </Label>
          <TooltipHover name={MODEL} />
        </div>
        <ComboBox
          emptystring="No model found."
          placeholder="Select model..."
          searchstring="Search model..."
          options={
            form.llm === "openai"
              ? ChatCompletionModels.map((model) => ({
                  value: model,
                  label: model,
                }))
              : form.llm === "anthropic"
              ? AnthropicMessageModels.map((model) => ({
                  value: model,
                  label: model,
                }))
              : [{ value: "gemini-pro", label: "gemini-pro" }] ?? []
          }
          value={form.model}
          setValue={(value) => {
            handleFormChange("model", value);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="temperature" className="mr-2">
              Temperature
            </Label>
            <TooltipHover name={TEMPERATURE} />
          </div>
          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {form.temperature}
          </span>
        </div>
        <Slider
          id="temperature"
          max={1}
          defaultValue={form.temperature}
          step={0.1}
          onValueChange={(value) => handleFormChange("temperature", value)}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          aria-label="Temperature"
        />
      </div>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="top_p" className="mr-2">
              Top P
            </Label>
            <TooltipHover name={TOP_P} />
          </div>
          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {form.top_p}
          </span>
        </div>
        <Slider
          id="top_p"
          max={1}
          defaultValue={form.top_p}
          step={0.1}
          onValueChange={(value) => handleFormChange("top_p", value)}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          aria-label="Top P"
        />
      </div>
      {form.llm === "gemini" && (
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Label htmlFor="top_p" className="mr-2">
                Top K
              </Label>
              <TooltipHover name={TOP_K} />
            </div>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {form.top_k}
            </span>
          </div>
          <Slider
            id="top_k"
            max={40}
            defaultValue={form.top_k}
            step={1}
            onValueChange={(value) => handleFormChange("top_k", value)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            aria-label="Top K"
          />
        </div>
      )}
      <div className="grid gap-1.5 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Label htmlFor="max" className="mr-2">
              Max Tokens
            </Label>
            <TooltipHover name={MAX_TOKENS} />
          </div>
          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {form.max_tokens}
          </span>
        </div>
        <Slider
          id="max"
          max={form.model === "gemini-pro" ? 8192 : 4096}
          defaultValue={form.max_tokens}
          step={1}
          onValueChange={(value) => handleFormChange("max_tokens", value)}
          className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          aria-label="Max Tokens"
        />
      </div>
    </div>
  );
};

export default CompareForm;
