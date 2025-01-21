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
import ComboBox from "./combobox";
import { ChatCompletionModels, CompletionModels } from "../../types/openai";
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
import { chat, completion } from "@/api/llm";
import useUser from "@/provider/userContext/useUserContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface INewRequestModal {
  size?: "sm" | "md";
}

const NewRequestModal: React.FC<INewRequestModal> = ({ size = "md" }) => {
  const { idToken } = useUser();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "llm",
    request: "chat",
    model: "gpt-3.5-turbo",
    userMessage: "",
    systemMessage:
      "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    max_tokens: [256],
    temperature: [0.1],
    n: "1",
  });

  const handleSubmit = async () => {
    if (form.request === "chat") {
      const { name, n, userMessage, systemMessage, ...rest } = form;
      const input = {
        ...rest,
        max_tokens: rest.max_tokens[0],
        temperature: rest.temperature[0],
        messages: [
          { role: "user", content: userMessage },
          { role: "system", content: systemMessage },
        ],
        n: Number(n),
      };

      toast.promise(chat(idToken ?? "", name, input), {
        loading: `Creating Request: ${name}`,
        success: (data) => {
          return `Request: ${data.request.name} created!`;
        },
        error: () => {
          return `Failed to create request!`;
        },
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-secondary/90"
          onClick={() => setOpen(true)}
        >
          <Plus className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`} />
        </button>
      </DialogTrigger>
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
            <div className="flex flex-col  gap-1.5">
              <Label htmlFor="name">Type</Label>
              <ComboBox
                emptystring="No types found."
                placeholder="Select type..."
                searchstring="Search type..."
                options={[
                  { value: "llm", label: "LLM" },
                  { value: "image", label: "Image" },
                ]}
                value={form.type}
                setValue={(value) => setForm({ ...form, type: value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Request Type</Label>
              <ComboBox
                emptystring="No request type found."
                placeholder="Select request type..."
                searchstring="Search request type..."
                options={
                  form.type === "llm"
                    ? [
                        { value: "completion", label: "Completion" },
                        { value: "chat", label: "Chat" },
                      ]
                    : form.type === "image"
                    ? [
                        { value: "generation", label: "Generation" },
                        { value: "edit", label: "Edit" },
                        { value: "variation", label: "Variation" },
                      ]
                    : []
                }
                value={form.request}
                setValue={(value) => setForm({ ...form, request: value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Model</Label>
              <ComboBox
                emptystring="No model found."
                placeholder="Select model..."
                searchstring="Search model..."
                options={
                  form.request === "chat"
                    ? ChatCompletionModels.map((model) => ({
                        value: model,
                        label: model,
                      }))
                    : form.request === "completion"
                    ? CompletionModels.map((model) => ({
                        value: model,
                        label: model,
                      }))
                    : ["generation", "edit", "variation"].includes(form.request)
                    ? [{ value: "dalle", label: "DallE" }]
                    : []
                }
                value={form.model}
                setValue={(value) => setForm({ ...form, model: value })}
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
                <AccordionTrigger className="text-sm">
                  System Prompt
                </AccordionTrigger>
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
                <Label htmlFor="temperature">Temperature</Label>
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
            <div className="grid gap-1.5 mb-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max">Max Tokens</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                  {form.max_tokens}
                </span>
              </div>
              <Slider
                id="max"
                max={4096}
                defaultValue={form.max_tokens}
                step={1}
                onValueChange={(value) =>
                  setForm({ ...form, max_tokens: value })
                }
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Max Tokens"
              />
            </div>
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
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestModal;
