"use client";

import React, { useState } from "react";
import { Loader2, GitCompare } from "lucide-react";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import useUser from "@/provider/userContext/useUserContext";
import { Separator } from "../../ui/separator";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import ResponseLoader from "../../dashboard/response-loader";
import { formatMillisecondsToSeconds } from "@/util/time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CompareForm from "./compare-form";
import compare from "@/api/llm/compare";
import TooltipHover from "../../common/tooltip-hover";
import { SYSTEM_PROMPT } from "@/constants/tooltipName";

const CompareRequests: React.FC = () => {
  const { idToken, user, setUserCredits } = useUser();

  const router = useRouter();
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [responseParams, setReponseParams] = useState([
    {
      tokenUsage: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
      responseTime: 0,
    },
  ]);

  const [userMessage, setUserMessage] = useState("");
  const [systemMessage, setSystemMessage] = useState("");
  const [accordionValue, setAccordionValue] = useState("configure-comparison");

  const [form1, setForm1] = useState({
    name: "",
    llm: "openai",
    temperature: [0.1],
    max_tokens: [256],
    top_p: [0.9],
    top_k: [1],
    request: "chat",
    model: "gpt-3.5-turbo",
    type: "llm",
    userMessage: "",
    systemMessage: "",
    n: "1",
  });
  const [form2, setForm2] = useState({
    name: "",
    llm: "openai",
    temperature: [0.1],
    max_tokens: [256],
    top_p: [0.9],
    top_k: [1],
    request: "chat",
    model: "gpt-4",
    type: "llm",
    userMessage: "",
    systemMessage: "",
    n: "1",
  });
  const [responses, setResponses] = useState([]);

  const handleForm1Change = (key: string, value: any) => {
    if (key === "llm") {
      setForm1((prevForm) => ({
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
      setForm1((prevForm) => ({ ...prevForm, [key]: value }));
    }
  };

  const handleForm2Change = (key: string, value: any) => {
    if (key === "llm") {
      setForm2((prevForm) => ({
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
      setForm2((prevForm) => ({ ...prevForm, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    const { name: name1, n: n1, llm: llm1, ...rest1 } = form1;
    const { name: name2, n: n2, llm: llm2, ...rest2 } = form2;

    let input1;
    let input2;

    if (llm1 === "openai") {
      input1 = {
        ...rest1,
        llm: llm1,
        max_tokens: rest1.max_tokens[0],
        temperature: rest1.temperature[0],
        top_p: rest1.top_p[0],
        top_k: rest1.top_k[0],
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        n: Number(n1),
      };
    } else if (llm1 === "gemini") {
      input1 = {
        ...rest1,
        llm: llm1,
        max_tokens: rest1.max_tokens[0],
        temperature: rest1.temperature[0],
        top_p: rest1.top_p[0],
        top_k: rest1.top_k[0],
        messages: [
          { role: "model", parts: [{ text: systemMessage }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
      };
    } else if (llm1 === "anthropic") {
      input1 = {
        ...rest1,
        llm: llm1,
        max_tokens: rest1.max_tokens[0],
        temperature: rest1.temperature[0],
        top_p: rest1.top_p[0],
        top_k: rest1.top_k[0],
        system: systemMessage,
        messages: [{ role: "user", content: userMessage }],
      };
    }

    if (llm2 === "openai") {
      input2 = {
        ...rest2,
        llm: llm2,
        max_tokens: rest2.max_tokens[0],
        temperature: rest2.temperature[0],
        top_p: rest2.top_p[0],
        top_k: rest2.top_k[0],
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        n: Number(n2),
      };
    } else if (llm2 === "gemini") {
      input2 = {
        ...rest2,
        llm: llm2,
        max_tokens: rest2.max_tokens[0],
        temperature: rest2.temperature[0],
        top_p: rest2.top_p[0],
        top_k: rest2.top_k[0],
        messages: [
          { role: "model", parts: [{ text: systemMessage }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
      };
    } else if (llm2 === "anthropic") {
      input2 = {
        ...rest2,
        llm: llm2,
        max_tokens: rest2.max_tokens[0],
        temperature: rest2.temperature[0],
        top_p: rest2.top_p[0],
        top_k: rest2.top_k[0],
        system: systemMessage,
        messages: [{ role: "user", content: userMessage }],
      };
    }

    setRequestLoading(true);
    toast.promise(compare(idToken ?? "", input1, input2), {
      loading: `Creating comparison`,
      success: (data) => {
        const responses = data.results.map((result: any) => {
          if (result.status === "fulfilled") {
            return result.response.responses[0];
          }
          return "The request failed due to content filtering";
        });
        const responseParams = data.results.map((result: any) => {
          if (result.status === "fulfilled") {
            return {
              tokenUsage: result.response.llmRequest.versions[0].tokenUsage,
              responseTime: result.response.llmRequest.versions[0].responseTime,
            };
          }
          return "The request failed due to content filtering";
        });
        setReponseParams(responseParams);
        setResponses(responses);
        setUserCredits(data.credits);
        setRequestLoading(false);
        return `Comparison created!`;
      },
      error: () => {
        setRequestLoading(false);
        return `Failed to create comparison!`;
      },
    });
  };

  const handleRun = async () => {
    setAccordionValue("");
    if (!user?.creditsWallet?.llm || user.creditsWallet?.llm <= 1) {
      toast.error("Your LLM request limit is low, Please buy more requests");
      router.push("/subscribe");
    } else {
      await handleSubmit();
    }
  };

  return (
    <div className="">
      <div className="p-5 relative overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Compare Requests
          </div>
          <Button
            className="flex items-center gap-1 fixed right-10 z-10"
            disabled={
              form1.max_tokens[0] === 0 ||
              form1.model === "" ||
              form1.n === "" ||
              form1.llm === "" ||
              form2.max_tokens[0] === 0 ||
              form2.model === "" ||
              form2.n === "" ||
              form2.llm === "" ||
              userMessage === "" ||
              systemMessage === "" ||
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
                Compare <GitCompare className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <div className="grid w-full gap-1.5 my-6">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            placeholder="Type your prompt here."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            id="prompt"
          />
        </div>

        <div className="grid w-full gap-1.5 my-6">
          <div className="flex items-center">
            <Label className="text-sm mr-2">System Prompt</Label>
            <TooltipHover name={SYSTEM_PROMPT} />
          </div>
          <Textarea
            placeholder="Type your prompt here."
            id="system-prompt"
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Accordion
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
          >
            <AccordionItem
              value="configure-comparison"
              className="border-b-transparent"
            >
              <AccordionTrigger className="text-sm">
                Configure your comparison
              </AccordionTrigger>
              <AccordionContent className="flex flex-col md:flex-row justify-center items-center md:space-x-14 px-3">
                <CompareForm
                  form={form1}
                  handleFormChange={handleForm1Change}
                />
                <Separator
                  orientation="vertical"
                  className="h-[350px] hidden md:block"
                />
                <CompareForm
                  form={form2}
                  handleFormChange={handleForm2Change}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Separator className="mt-8" />

      {requestLoading ? (
        <ResponseLoader />
      ) : (
        <div className="p-3 md:p-5 h-full flex flex-col md:flex-row justify-center gap-10">
          {responses?.map((response, key) => (
            <div key={key} className="basis-1/2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Response</p>
                <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>Input: </span>
                    <span className="text-primary">
                      {responseParams[key].tokenUsage.prompt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Output: </span>
                    <span className="text-primary">
                      {responseParams[key].tokenUsage.completion}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Total: </span>
                    <span className="text-primary">
                      {responseParams[key].tokenUsage.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Time: </span>
                    <span className="text-primary">
                      {formatMillisecondsToSeconds(
                        responseParams[key].responseTime
                      )}{" "}
                      s
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <div className="p-4 rounded-md bg-secondary text-sm">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompareRequests;
