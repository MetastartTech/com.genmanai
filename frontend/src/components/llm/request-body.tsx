"use client";

import React, { useEffect, useState } from "react";
import { MessagesSquare, Play } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import ComboBox from "../dashboard/combobox";
import { ChatCompletionModels, CompletionModels } from "../../types/openai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useParams } from "next/navigation";
import useUser from "@/provider/userContext/useUserContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

const RequestBody: React.FC = () => {
  const { idToken } = useUser();
  const params = useParams();
  const [tab, setTab] = useState<"prompt" | "model" | "parameter" | "output">(
    "prompt"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [responseParams, setReponseParams] = useState({
    tokenUsage: {
      completion: 0,
      prompt: 0,
      total: 0,
    },
    responseTime: 0,
  });
  const [form, setForm] = useState({
    name: "",
    temperature: [0.2],
    max: [256],
    topp: [0.9],
    request: "chat",
    model: "",
    type: "llm",
    userMessage: "",
    systemMessage: "",
  });
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/v1/api/request/${params.id}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          temperature: [data.config.temperature],
          max: [data.config.max_tokens],
          topp: [0.9],
          request: data.type,
          model: data.config.model,
          type: "llm",
          userMessage: data.config.messages.find(
            (message) => message.role === "user"
          ).content,
          systemMessage: data.config.messages.find(
            (message) => message.role === "system"
          ).content,
        });
        setReponseParams({
          tokenUsage: data.tokenUsage,
          responseTime: data.responseTime,
        });
        setResponses(data.response);
        setLoading(false);
      });
  }, []);

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <MessagesSquare className="w-5 h-5" />
            {form.name}
          </div>
          <Button className="flex items-center gap-1">
            Run <Play className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-6">
          <div className="grid w-full gap-1.5">
            <Label>Version</Label>
            <div className="flex items-center gap-4">
              <Select defaultValue="1">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>History Version</SelectLabel>
                    <SelectItem value="1">Latest Version</SelectItem>
                    <SelectItem value="2">3/10/23, 10:00 AM</SelectItem>
                    <SelectItem value="3">2/10/23, 10:00 PM</SelectItem>
                    <SelectItem value="4">2/10/23, 9:00 PM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Badge>Latest Version</Badge>
            </div>
          </div>

          <div className="mt-4 flex overflow-x-auto overflow-y-hidden border-b border-gray-200 whitespace-nowrap dark:border-gray-700">
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "prompt"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("prompt")}
            >
              Prompt
            </button>
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "model"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("model")}
            >
              Model Settings
            </button>
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "parameter"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("parameter")}
            >
              Parameter Settings
            </button>
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "output"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("output")}
            >
              Output Settings
            </button>
          </div>

          {tab === "prompt" && (
            <>
              <div className="grid w-full gap-1.5 my-6">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  placeholder="Type your prompt here."
                  value={form.userMessage}
                  id="prompt"
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
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}

          {tab === "model" && (
            <>
              <div className="flex flex-col gap-1.5 mt-6">
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
              <div className="flex flex-col gap-1.5 mt-6 text-sm">
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
                      : ["generation", "edit", "variation"].includes(
                          form.request
                        )
                      ? [{ value: "dalle", label: "DallE" }]
                      : []
                  }
                  value={form.model}
                  setValue={(value) => setForm({ ...form, model: value })}
                />
              </div>
            </>
          )}

          {tab === "parameter" && (
            <div className="grid lg:grid-cols-2 gap-10 items-center mt-6">
              <div className="grid gap-4">
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

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="topp">Top P</Label>
                  <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                    {form.topp}
                  </span>
                </div>
                <Slider
                  id="topp"
                  max={1}
                  defaultValue={form.topp}
                  step={0.1}
                  onValueChange={(value) => setForm({ ...form, topp: value })}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  aria-label="Top P"
                />
              </div>
            </div>
          )}

          {tab === "output" && (
            <>
              <div className="flex flex-col gap-1.5 mt-6">
                <Label htmlFor="name">Number of responses</Label>
                <Select>
                  <SelectTrigger className="w-52">
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
              <div className="grid gap-4 mt-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max">Max Tokens</Label>
                  <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                    {form.max}
                  </span>
                </div>
                <Slider
                  id="max"
                  max={4096}
                  defaultValue={form.max}
                  step={1}
                  onValueChange={(value) => setForm({ ...form, max: value })}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  aria-label="Max Tokens"
                />
              </div>
            </>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="mt-8" />
      <ResizablePanel className="p-5 overflow-y-auto h-full">
        <div className="flex items-center justify-between">
          <p className="text-sm">Response</p>
          <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-500">
            <div className="flex items-center gap-1">
              <span>Input: </span>
              <span className="text-primary">
                {responseParams.tokenUsage.prompt}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Output: </span>
              <span className="text-primary">
                {responseParams.tokenUsage.completion}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Total: </span>
              <span className="text-primary">
                {responseParams.tokenUsage.total}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Time: </span>
              <span className="text-primary">
                {responseParams.responseTime} ms
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {responses.map((response, index) => (
            <div key={index} className="p-4 rounded-md bg-secondary text-sm">
              {response}
            </div>
          ))}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RequestBody;
