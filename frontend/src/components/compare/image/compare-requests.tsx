/* eslint-disable @next/next/no-img-element */
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
import "katex/dist/katex.min.css";
import ResponseLoader from "../../dashboard/response-loader";
import { formatMillisecondsToSeconds } from "@/util/time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CompareForm from "./compare-form";
import compare from "@/api/image/compare";

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
  const [accordionValue, setAccordionValue] = useState("configure-comparison");

  const [form1, setForm1] = useState({
    name: "",
    request: "generation",
    model: "dall-e-2",
    prompt: "",
    size: "1024x1024",
    n: "1",
  });
  const [form2, setForm2] = useState({
    name: "",
    request: "generation",
    model: "dall-e-3",
    prompt: "",
    size: "1024x1024",
    n: "1",
  });
  const [responses, setResponses] = useState([]);

  const handleForm1Change = (key: string, value: any) => {
    setForm1((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleForm2Change = (key: string, value: any) => {
    setForm2((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleSubmit = async () => {
    const { name: name1, n: n1, ...rest1 } = form1;
    const { name: name2, n: n2, ...rest2 } = form2;

    let input1;
    let input2;

    input1 = {
      ...rest1,
      prompt: userMessage,
      n: 1,
    };

    input2 = {
      ...rest2,
      prompt: userMessage,
      n: 1,
    };

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
              tokenUsage: result.response.imageRequest.versions[0].tokenUsage,
              responseTime:
                result.response.imageRequest.versions[0].responseTime,
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
      error: (e) => {
        console.log(e);
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-images h-5 w-5"
            >
              <path d="M18 22H4a2 2 0 0 1-2-2V6" />
              <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
              <circle cx="12" cy="8" r="2" />
              <rect width="16" height="16" x="6" y="2" rx="2" />
            </svg>
            Compare Images
          </div>
          <Button
            className="flex items-center gap-1 fixed right-10 z-10"
            disabled={
              form1.model === "" ||
              form1.n === "" ||
              form2.model === "" ||
              form2.n === "" ||
              userMessage === "" ||
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
                Compare{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-images h-4 w-4"
                >
                  <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                  <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
                  <circle cx="12" cy="8" r="2" />
                  <rect width="16" height="16" x="6" y="2" rx="2" />
                </svg>
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
                  className="h-[150px] hidden md:block"
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
                    <span>Time: </span>
                    <span className="text-primary">
                      {formatMillisecondsToSeconds(
                        responseParams[key].responseTime ?? 0
                      )}{" "}
                      s
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4 mt-4 md:mx-4">
                <div className="p-2 rounded-md bg-secondary text-sm h-[300px] md:w-[410px] w-full shrink-0">
                  <img
                    src={response}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/images/image-expired.png";
                    }}
                    alt={userMessage}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
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
