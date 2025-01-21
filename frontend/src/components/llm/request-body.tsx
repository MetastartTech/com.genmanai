"use client";

import React, { useEffect, useState } from "react";
import { MessagesSquare, Play, Loader2 } from "lucide-react";
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
import { ChatCompletionModels } from "../../types/openai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import useUser from "@/provider/userContext/useUserContext";
import { modifyChat } from "@/api/llm";
import { requestById } from "@/api/llm/requests";
import useUserRequests from "@/provider/userRequestsContext/useUserRequestsContext";
import { Separator } from "../ui/separator";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import Welcome from "../dashboard/welcome";
import TabLoader from "../dashboard/tab-loader";
import ResponseLoader from "../dashboard/response-loader";
import { formatMillisecondsToSeconds } from "@/util/time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { closeAllRequests } from "@/actions/activeRequests";
import TooltipHover from "../common/tooltip-hover";
import {
  MAX_TOKENS,
  MODEL_SETTINGS,
  OUTPUT_SETTINGS,
  PARAMETER_SETTINGS,
  SYSTEM_PROMPT,
  TEMPERATURE,
  TOP_K,
  TOP_P,
} from "@/constants/tooltipName";
import { AnthropicMessageModels } from "@/types/anthropic";
import CodeViewer from "../dashboard/code-view";

const RequestBody: React.FC = () => {
  const { idToken, user, setUserCredits } = useUser();
  const router = useRouter();
  const [isFormModified, setFormModified] = useState<boolean>(false);
  const { activeTab, activeTabName, tabsLoading } = useUserRequests();
  const [tab, setTab] = useState<"prompt" | "model" | "parameter" | "output">(
    "prompt"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [versions, setVersions] = useState<{ id: string; createdAt: string }[]>(
    []
  );
  const [request, setRequest] = useState<any>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [responseParams, setReponseParams] = useState({
    tokenUsage: {
      completion: 0,
      prompt: 0,
      total: 0,
    },
    responseTime: 0,
  });
  const [initialForm, setInitialForm] = useState({
    name: "",
    llm: "openai",
    temperature: [0.2],
    max_tokens: [256],
    top_p: [0.9],
    top_k: [1],
    request: "chat",
    model: "",
    type: "llm",
    userMessage: "",
    systemMessage: "",
    n: 1,
  });
  const [form, setForm] = useState({
    name: "",
    llm: "openai",
    temperature: [0.2],
    max_tokens: [256],
    top_p: [0.9],
    top_k: [1],
    request: "chat",
    model: "",
    type: "llm",
    userMessage: "",
    systemMessage: "",
    n: "1",
  });
  const [responses, setResponses] = useState([]);

  const initializeState = (request: any, data: any) => {
    if (data.llm) {
      setInitialForm({
        name: request.name,
        temperature: [data.config.temperature],
        max_tokens: [data.config.max_tokens],
        top_p: [data.config.top_p ?? 1],
        top_k: [data.config.top_k ?? 1],
        request: request.type,
        model: data.config.model,
        llm: data.llm,
        type: "llm",
        userMessage:
          data.llm === "gemini"
            ? data.config.messages.find(
                (message: { role: "user" | "model"; content: string }) =>
                  message.role === "user"
              ).parts[0].text
            : data.config.messages.find(
                (message: { role: "user" | "system"; content: string }) =>
                  message.role === "user"
              ).content,
        systemMessage:
          data.llm === "gemini"
            ? data.config.messages.find(
                (message: { role: "user" | "model"; content: string }) =>
                  message.role === "model"
              ).parts[0].text
            : data.llm === "anthropic"
            ? data.config.system
            : data.config.messages.find(
                (message: { role: "user" | "system"; content: string }) =>
                  message.role === "system"
              ).content ?? "",
        n: data.config.n.toString(),
      });
      setForm({
        name: request.name,
        temperature: [data.config.temperature],
        max_tokens: [data.config.max_tokens],
        top_p: [data.config.top_p ?? 1],
        top_k: [data.config.top_k ?? 1],
        request: request.type,
        model: data.config.model,
        type: "llm",
        llm: data.llm,
        userMessage:
          data.llm === "gemini"
            ? data.config.messages.find(
                (message: { role: "user" | "model"; content: string }) =>
                  message.role === "user"
              ).parts[0].text
            : data.config.messages.find(
                (message: { role: "user" | "system"; content: string }) =>
                  message.role === "user"
              ).content,
        systemMessage:
          data.llm === "gemini"
            ? data.config.messages.find(
                (message: { role: "user" | "model"; content: string }) =>
                  message.role === "model"
              ).parts[0].text
            : data.llm === "anthropic"
            ? data.config.system
            : data.config.messages.find(
                (message: { role: "user" | "system"; content: string }) =>
                  message.role === "system"
              ).content ?? "",
        n: data.config.n.toString(),
      });
      setReponseParams({
        tokenUsage: data.tokenUsage,
        responseTime: data.responseTime,
      });
      setResponses(data.response);
    }
  };

  const formatDateString = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h12",
    });
  };

  const isFormDataChanged = (initialForm: any, form: any) => {
    for (let key in initialForm) {
      if (Array.isArray(initialForm[key])) {
        if (initialForm[key][0] !== form[key][0]) {
          return true;
        }
      } else if (initialForm[key] !== form[key]) {
        return true;
      }
    }
    return false;
  };

  const handleFormChange = (key: string, value: any) => {
    if (key === "llm") {
      setForm((prevForm) => ({
        ...prevForm,
        [key]: value,
        model:
          value === "openai"
            ? "gpt-3.5-turbo"
            : value === "anthropic"
            ? "claude-3-opus-20240229"
            : "gemini-pro",
        max_tokens:
          ["openai", "anthropic"].includes(value) &&
          prevForm.max_tokens[0] > 4096
            ? [4090]
            : prevForm.max_tokens,
      }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [key]: value }));
    }
  };

  const handleRun = async () => {
    if (!user?.creditsWallet.llm || user.creditsWallet.llm <= 0) {
      toast.error(
        "Your LLM request limit has been reached, Please buy more requests"
      );
      router.push("/subscribe");
    } else {
      await handleModifyChat();
    }
  };

  const handleModifyChat = async () => {
    const {
      name,
      top_p,
      top_k,
      n,
      request,
      userMessage,
      systemMessage,
      llm,
      ...rest
    } = form;

    let input;

    if (llm === "openai") {
      input = {
        ...rest,
        llm,
        max_tokens: rest.max_tokens[0],
        temperature: rest.temperature[0],
        top_p: top_p[0],
        top_k: top_k[0],
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
        top_p: top_p[0],
        top_k: top_k[0],
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
        top_p: top_p[0],
        top_k: top_k[0],
        system: systemMessage,
        messages: [{ role: "user", content: userMessage }],
      };
    }

    setRequestLoading(true);
    toast.promise(modifyChat(idToken ?? "", activeTab, input), {
      loading: "Modifying request",
      success: (response) => {
        const data = response.request.versions.sort(
          (a: { createdAt: string }, b: { createdAt: string }) => {
            return +new Date(b.createdAt) - +new Date(a.createdAt);
          }
        )[0];
        setVersions(
          response.request.versions.map((version: any) => ({
            id: version._id,
            createdAt: version.createdAt,
          }))
        );
        setRequest(response.request);
        setVersion(data._id);
        initializeState(response.request, {
          ...data,
          response: response.responses,
        });
        setUserCredits(response.credits);
        setRequestLoading(false);
        return "Request Modified";
      },
      error: () => {
        setRequestLoading(false);
        return "Failed to modify request";
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab != "" && activeTab != "0") {
      requestById(idToken ?? "", activeTab)
        .then((request) => {
          const data = request.versions.sort(
            (a: { createdAt: string }, b: { createdAt: string }) => {
              return +new Date(b.createdAt) - +new Date(a.createdAt);
            }
          )[0];
          setRequest(request);
          setVersion(data._id);
          setVersions(
            request.versions.map((version: any) => ({
              id: version._id,
              createdAt: version.createdAt,
            }))
          );
          initializeState(request, data);
          setLoading(false);
        })
        .catch((e) => {
          setRequest(null);
          setVersion(null);
          setVersions([]);
          closeAllRequests(user?.email ?? "", "llm");
          setLoading(false);
        });
    }
  }, [activeTab, idToken, user?.email]);

  useEffect(() => {
    setFormModified(isFormDataChanged(initialForm, form));
  }, [initialForm, form, loading]);

  useEffect(() => {
    if (request && version) {
      const data = request.versions.find(
        (reqVersion: any) => reqVersion._id === version
      );
      if (data) initializeState(request, data);
    }
  }, [request, version]);

  if (tabsLoading) {
    return <TabLoader />;
  } else if (!activeTab || activeTab == "" || activeTab == "0") {
    return <Welcome type="llm" />;
  } else if (loading) {
    return <TabLoader />;
  }

  return (
    <div className="">
      <div className="p-5 relative overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <MessagesSquare className="w-5 h-5" />
            {activeTabName}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <CodeViewer
              llm={form.llm as "openai" | "anthropic" | "gemini"}
              model={form.model}
              system={form.systemMessage.replace("\n", " ")}
              user={form.userMessage.replace("\n", " ")}
            />
            <Button
              className="flex items-center gap-1"
              disabled={
                form.name === "" ||
                form.max_tokens[0] === 0 ||
                form.model === "" ||
                form.n === "" ||
                form.userMessage === "" ||
                form.systemMessage === "" ||
                form.llm === "" ||
                !isFormModified ||
                requestLoading
              }
              onClick={handleRun}
            >
              {requestLoading ? (
                <div className="h-fit w-fit animate-spin">
                  <Loader2 className="w-4 h-4" />
                </div>
              ) : (
                <>
                  Run <Play className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid w-full gap-1.5">
            <Label>Version</Label>
            <div className="flex items-center gap-4">
              <Select
                value={version ?? versions[0]?.id}
                onValueChange={(value) => setVersion(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>History Version</SelectLabel>
                    {versions.map((version) => (
                      <SelectItem value={version.id} key={version.id}>
                        {formatDateString(version.createdAt)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {version && version === versions[0].id && (
                <Badge>Latest Version</Badge>
              )}
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
              <TooltipHover
                name={MODEL_SETTINGS}
                displayName="Model Settings"
              />
            </button>
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "parameter"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("parameter")}
            >
              <TooltipHover
                name={PARAMETER_SETTINGS}
                displayName="Parameter Settings"
              />
            </button>
            <button
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center border-b-2 whitespace-nowrap focus:outline-none ${
                tab === "output"
                  ? "border-black dark:border-white"
                  : "text-gray-600 border-transparent dark:text-white"
              }`}
              onClick={() => setTab("output")}
            >
              <TooltipHover
                name={OUTPUT_SETTINGS}
                displayName="Output Settings"
              />
            </button>
          </div>

          {tab === "prompt" && (
            <>
              <div className="grid w-full gap-1.5 my-6">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  placeholder="Type your prompt here."
                  value={form.userMessage}
                  onChange={(e) =>
                    handleFormChange("userMessage", e.target.value)
                  }
                  id="prompt"
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
                        handleFormChange("systemMessage", e.target.value)
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}

          {tab === "model" && (
            <>
              <div className="flex flex-col gap-1.5 mt-6 text-sm">
                <Label htmlFor="name">LLM</Label>
                <ComboBox
                  emptystring="No llm found."
                  placeholder="Select llm..."
                  searchstring="Search llm..."
                  options={
                    [
                      {
                        value: "openai",
                        label: "openai",
                      },
                      {
                        value: "gemini",
                        label: "gemini",
                      },
                      {
                        value: "anthropic",
                        label: "anthropic",
                      },
                    ] ?? []
                  }
                  value={form.llm}
                  setValue={(value) => handleFormChange("llm", value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 mt-6 text-sm">
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
                      : [
                          {
                            value: "gemini-pro",
                            label: "gemini-pro",
                          },
                        ] ?? []
                  }
                  value={form.model}
                  setValue={(value) => handleFormChange("model", value)}
                />
              </div>
            </>
          )}

          {tab === "parameter" && (
            <div className="grid lg:grid-cols-2 gap-10 items-center mt-6">
              <div className="grid gap-4">
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
                    handleFormChange("temperature", value)
                  }
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  aria-label="Temperature"
                />
              </div>

              <div className="grid gap-4">
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
                    onValueChange={(value) =>
                      setForm({ ...form, top_k: value })
                    }
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    aria-label="Top K"
                  />
                </div>
              )}
            </div>
          )}

          {tab === "output" && (
            <>
              {form.llm === "openai" && (
                <div className="flex flex-col gap-1.5 mt-6">
                  <Label htmlFor="name">Number of responses</Label>
                  <Select
                    value={form.n}
                    onValueChange={(value) => handleFormChange("n", value)}
                  >
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
              )}
              <div className="grid gap-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Label htmlFor="max_tokens" className="mr-2">
                      Max Tokens
                    </Label>
                    <TooltipHover name={MAX_TOKENS} />
                  </div>
                  <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                    {form.max_tokens}
                  </span>
                </div>
                <Slider
                  id="max_tokens"
                  max={form.model === "gemini-pro" ? 8192 : 4096}
                  defaultValue={form.max_tokens}
                  step={1}
                  onValueChange={(value) =>
                    handleFormChange("max_tokens", value)
                  }
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  aria-label="Max Tokens"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Separator className="mt-8" />

      {requestLoading ? (
        <ResponseLoader />
      ) : (
        <div className="p-3 md:p-5 h-full">
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
                  {formatMillisecondsToSeconds(responseParams.responseTime)} s
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {responses.map((response, index) => (
              <div key={index} className="p-4 rounded-md bg-secondary text-sm">
                <Markdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          language={match[1]}
                          style={vscDarkPlus}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {response}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBody;
