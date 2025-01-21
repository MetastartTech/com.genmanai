/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
import useUser from "@/provider/userContext/useUserContext";
import { requestById } from "@/api/image/requests";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";
import { Separator } from "../ui/separator";
import { modify } from "@/api/image";
import Welcome from "../dashboard/welcome";
import TabLoader from "../dashboard/tab-loader";
import ResponseLoader from "../dashboard/response-loader";
import ImageAlert from "./image-alert";
import { formatMillisecondsToSeconds } from "@/util/time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { closeAllRequests } from "@/actions/activeRequests";
import TooltipHover from "../common/tooltip-hover";
import { MODEL_SETTINGS, OUTPUT_SETTINGS } from "@/constants/tooltipName";

const RequestBody: React.FC = () => {
  const { idToken, user, setUserCredits } = useUser();
  const router = useRouter();
  const [isFormModified, setFormModified] = useState<boolean>(false);
  const { activeTab, activeTabName, tabsLoading } = useImageRequests();
  const [tab, setTab] = useState<"prompt" | "model" | "parameter" | "output">(
    "prompt",
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [versions, setVersions] = useState<{ id: string; createdAt: string }[]>(
    [],
  );
  const [request, setRequest] = useState<any>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [responseParams, setReponseParams] = useState({
    responseTime: 0,
  });
  const [initialForm, setInitialForm] = useState({
    name: "",
    request: "generation",
    model: "dall-e-2",
    prompt: "",
    size: "1024x1024",
    n: "1",
  });
  const [form, setForm] = useState({
    name: "",
    request: "generation",
    model: "dall-e-2",
    prompt: "",
    size: "1024x1024",
    n: "1",
  });
  const [responses, setResponses] = useState([]);

  const initializeState = (request: any, data: any) => {
    setInitialForm({
      name: request.name,
      size: data.config.size,
      request: request.type,
      model: data.config.model,
      prompt: data.config.prompt,
      n: data.config.n.toString(),
    });
    setForm({
      name: request.name,
      size: data.config.size,
      request: request.type,
      model: data.config.model,
      prompt: data.config.prompt,
      n: data.config.n.toString(),
    });
    setReponseParams({
      responseTime: data.responseTime,
    });
    setResponses(data.response);
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
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const handleRun = async () => {
    if (!user?.creditsWallet.image || user.creditsWallet.image <= 0) {
      toast.error(
        "Your Image request limit has been reached, Please buy more requests",
      );
      router.push("/subscribe");
    } else {
      await handleModifyImage();
    }
  };

  const handleModifyImage = async () => {
    const { name, n, request, ...rest } = form;
    const input = {
      ...rest,
      n: rest.model === "dall-e-2" ? Number(n) : 1,
    };
    setRequestLoading(true);
    toast.promise(modify(idToken ?? "", activeTab, input), {
      loading: "Modifying request",
      success: (response) => {
        const data = response.request.versions.sort(
          (a: { createdAt: string }, b: { createdAt: string }) => {
            return +new Date(b.createdAt) - +new Date(a.createdAt);
          },
        )[0];
        setVersions(
          response.request.versions.map((version: any) => ({
            id: version._id,
            createdAt: version.createdAt,
          })),
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
            },
          )[0];
          setRequest(request);
          setVersion(data._id);
          setVersions(
            request.versions.map((version: any) => ({
              id: version._id,
              createdAt: version.createdAt,
            })),
          );
          initializeState(request, data);
          setLoading(false);
        })
        .catch(() => {
          setRequest(null);
          setVersion(null);
          setVersions([]);
          setLoading(false);
          closeAllRequests(user?.email ?? "", "image");
        });
    }
  }, [activeTab, idToken, user?.email]);

  useEffect(() => {
    setFormModified(isFormDataChanged(initialForm, form));
  }, [initialForm, form, loading]);

  useEffect(() => {
    if (request && version) {
      const data = request.versions.find(
        (reqVersion: any) => reqVersion._id === version,
      );
      if (data) initializeState(request, data);
    }
  }, [request, version]);

  if (tabsLoading) {
    return <TabLoader />;
  } else if (!activeTab || activeTab == "" || activeTab == "0") {
    return <Welcome type="image" />;
  } else if (loading) {
    return <TabLoader />;
  }

  return (
    <div>
      <div className="p-5 relative overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {activeTabName}
          </div>
          <Button
            className="flex items-center gap-1"
            disabled={
              form.name === "" ||
              form.prompt === "" ||
              form.model === "" ||
              form.n === "" ||
              form.size === "" ||
              !isFormModified ||
              requestLoading
            }
            onClick={handleRun}
          >
            {requestLoading ? (
              <div className="h-fit w-fit animate-spin">
                <Loader2 className="h-4 w-4" />
              </div>
            ) : (
              <>
                Run <Play className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        <div className="mt-6">
          <ImageAlert />
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
                  value={form.prompt}
                  onChange={(e) => handleFormChange("prompt", e.target.value)}
                  id="prompt"
                />
              </div>
            </>
          )}

          {tab === "model" && (
            <>
              <div className="flex flex-col gap-1.5 my-6">
                <Label htmlFor="name">Model</Label>
                <Select
                  value={form.model}
                  onValueChange={(value) => setForm({ ...form, model: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a model...</SelectLabel>
                      <SelectItem value="dall-e-2">DallE 2</SelectItem>
                      <SelectItem value="dall-e-3">DallE 3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {tab === "output" && (
            <>
              {form.model === "dall-e-2" && (
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
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Size</Label>
                  <Select
                    value={form.size}
                    onValueChange={(value) => setForm({ ...form, size: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a size..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a size...</SelectLabel>
                        <SelectItem value="256x256">256x256</SelectItem>
                        <SelectItem value="512x512">512x512</SelectItem>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Separator className="mt-8" />

      {requestLoading ? (
        <ResponseLoader />
      ) : (
        <div className="p-3 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm">Response</p>
            <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-500">
              <div className="flex items-center gap-1">
                <span>Time: </span>
                <span className="text-primary">
                  {formatMillisecondsToSeconds(responseParams.responseTime)} s
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4 mt-4 md:mx-4">
            {responses.map((response, index) => (
              <div
                key={index}
                className="p-2 rounded-md bg-secondary text-sm h-[300px] md:w-[410px] w-full shrink-0"
              >
                <img
                  src={response}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Avoid infinite loop if alternate image is also not found
                    target.src = "/images/image-expired.png"; // Replace "alternate.jpg" with the path to your alternate image
                  }}
                  alt={form.prompt}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBody;
