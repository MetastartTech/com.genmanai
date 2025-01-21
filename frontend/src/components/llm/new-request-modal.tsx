"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ComboBox from "../dashboard/combobox";
import { ChatCompletionModels } from "../../types/openai";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "../ui/slider";
import { chat } from "@/api/llm";
import useUser from "@/provider/userContext/useUserContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { addRequest } from "@/actions/activeRequests";
import { ITabRequest } from "@/types/schema";
import { useRouter } from "next/navigation";
import TooltipHover from "../common/tooltip-hover";
import {
  MAX_TOKENS,
  SYSTEM_PROMPT,
  TEMPERATURE,
  TOP_K,
  TOP_P,
} from "@/constants/tooltipName";
import { AnthropicMessageModels } from "@/types/anthropic";

interface INewRequestModal {
  size?: "sm" | "md";
  addRequest?: (req: ITabRequest, folderId: string) => void;
  folderId?: string;
  text?: string;
  but?: boolean;
}

const DEFAULT_SYSTEM_MESSAGE = {
  openai:
    "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
  gemini: "You are Gemini Pro",
  anthropic: "You are Claude AI",
};

let initalFormState = {
  name: "",
  llm: "openai",
  model: "gpt-3.5-turbo",
  userMessage: "",
  systemMessage: DEFAULT_SYSTEM_MESSAGE["openai"],
  max_tokens: [256],
  temperature: [0.1],
  top_p: [1],
  top_k: [1],
  n: "1",
};

const NewRequestModal: React.FC<INewRequestModal> = ({
  size = "md",
  addRequest,
  folderId,
  text,
  but = false,
}) => {
  const { idToken, user, setUserCredits } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initalFormState);

  const handleClick = () => {
    if (!user?.creditsWallet.llm || user.creditsWallet.llm <= 0) {
      toast.error(
        "Your LLM request limit has been reached, Please buy more requests"
      );
      router.push("/subscribe");
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = async () => {
    const { name, n, userMessage, systemMessage, llm, ...rest } = form;
    let input;
    if (llm === "openai") {
      input = {
        ...rest,
        llm,
        max_tokens: rest.max_tokens[0],
        temperature: rest.temperature[0],
        top_p: rest.top_p[0],
        top_k: rest.top_k[0],
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        n: Number(n),
      };
    } else if (llm === "gemini") {
      input = {
        ...rest,
        llm,
        max_tokens: rest.max_tokens[0],
        temperature: rest.temperature[0],
        top_p: rest.top_p[0],
        top_k: rest.top_k[0],
        messages: [
          { role: "model", parts: [{ text: systemMessage }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
      };
    } else if (llm === "anthropic") {
      input = {
        ...rest,
        llm,
        max_tokens: rest.max_tokens[0],
        temperature: rest.temperature[0],
        top_p: rest.top_p[0],
        top_k: rest.top_k[0],
        system: systemMessage,
        messages: [{ role: "user", content: userMessage }],
      };
    }

    toast.promise(chat(idToken ?? "", name, input), {
      loading: `Creating Request: ${name}`,
      success: (data) => {
        if (addRequest) {
          addRequest(
            {
              _id: data.request._id,
              type: data.request.type,
              name: data.request.name,
            },
            folderId ?? ""
          );
        }

        setUserCredits(data.credits);

        return `Request: ${data.request.name} created!`;
      },
      error: () => {
        return `Failed to create request!`;
      },
    });

    setOpen(false);
    setForm(initalFormState);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <div>
        {!text ? (
          <button
            className="p-2 rounded-md hover:bg-secondary/90"
            onClick={handleClick}
          >
            <Plus className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`} />
          </button>
        ) : but ? (
          <Button onClick={handleClick}>Add a request</Button>
        ) : (
          <div
            className="hover:bg-secondary/90 items-center justify-center cursor-pointer text-sm pl-2 p-1"
            onClick={handleClick}
          >
            {text}
          </div>
        )}
      </div>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Request</DialogTitle>
          <DialogDescription>Create a new request.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Request Name"
                className="w-[200px]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">LLM</Label>
              <ComboBox
                emptystring="No llm found."
                placeholder="Select llm..."
                searchstring="Search llm..."
                options={
                  [
                    { value: "openai", label: "OpenAi" },
                    { value: "anthropic", label: "Anthropic" },
                    { value: "gemini", label: "Gemini" },
                  ] ?? []
                }
                value={form.llm}
                setValue={(value) => {
                  setForm({
                    ...form,
                    llm: value,
                    model:
                      value === "openai"
                        ? "gpt-3.5-turbo"
                        : value === "gemini"
                        ? "gemini-pro"
                        : "claude-3-opus-20240229",
                    max_tokens: [256],
                    systemMessage:
                      DEFAULT_SYSTEM_MESSAGE[
                        value as "openai" | "gemini" | "anthropic"
                      ],
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Model</Label>
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
                  setForm({ ...form, model: value });
                }}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                placeholder="Type your prompt here."
                id="prompt"
                value={form.userMessage}
                onChange={(e) =>
                  setForm({ ...form, userMessage: e.target.value })
                }
              />
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem
                value="system-prompt"
                className="border-b-transparent"
              >
                <div className="flex items-center">
                  <AccordionTrigger className="text-sm mr-2">
                    System Prompt
                  </AccordionTrigger>
                  <TooltipHover name={SYSTEM_PROMPT} />
                </div>

                <AccordionContent>
                  <Textarea
                    placeholder="Type your prompt here."
                    id="system-prompt"
                    value={form.systemMessage}
                    onChange={(e) =>
                      setForm({ ...form, systemMessage: e.target.value })
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                onValueChange={(value) =>
                  setForm({ ...form, temperature: value })
                }
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
                onValueChange={(value) => setForm({ ...form, top_p: value })}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Top P"
              />
            </div>
            {["gemini", "anthropic"].includes(form.llm) && (
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor="top_k" className="mr-2">
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
                  onValueChange={(value) => setForm({ ...form, top_k: value })}
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
                onValueChange={(value) =>
                  setForm({ ...form, max_tokens: value })
                }
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Max Tokens"
              />
            </div>
            {form.llm === "openai" && (
              <div className="flex flex-col  gap-1.5">
                <Label htmlFor="name">Number of responses</Label>
                <Select
                  value={form.n}
                  onValueChange={(value) => setForm({ ...form, n: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Number of Responses</SelectLabel>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              form.name === "" ||
              form.max_tokens[0] === 0 ||
              form.model === "" ||
              form.n === "" ||
              form.userMessage === "" ||
              form.systemMessage === "" ||
              form.llm === ""
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestModal;
