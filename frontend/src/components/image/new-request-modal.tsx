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
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ComboBox from "../dashboard/combobox";
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
import useUser from "@/provider/userContext/useUserContext";
import { IImageTabRequest } from "@/types/schema";
import { generation } from "@/api/image";
import { useRouter } from "next/navigation";
import TooltipHover from "../common/tooltip-hover";
import { MODEL } from "@/constants/tooltipName";

interface INewRequestModal {
  size?: "sm" | "md";
  addRequest?: (req: IImageTabRequest, folderId: string) => void;
  folderId?: string;
  text?: string;
  but?: boolean;
}

let initalFormState = {
  name: "",
  request: "generation",
  model: "dall-e-2",
  prompt: "",
  size: "1024x1024",
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
    if (!user?.creditsWallet.image || user.creditsWallet.image <= 0) {
      toast.error(
        "Your Image request limit has been reached, Please buy more requests",
      );
      router.push("/subscribe");
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = async () => {
    const { name, n, ...rest } = form;
    const input = {
      ...rest,
      n: rest.model === "dall-e-2" ? Number(n) : 1,
    };

    toast.promise(generation(idToken ?? "", name, input), {
      loading: `Creating Request: ${name}`,
      success: (data) => {
        if (addRequest) {
          addRequest(
            {
              _id: data.request._id,
              type: data.request.type,
              name: data.request.name,
            },
            folderId ?? "",
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
              <Label htmlFor="name">Request Type</Label>
              <ComboBox
                emptystring="No request type found."
                placeholder="Select request type..."
                searchstring="Search request type..."
                options={[{ value: "generation", label: "Generation" }]}
                value={form.request}
                setValue={(value) => setForm({ ...form, request: value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center">
                <Label htmlFor="name" className="mr-2">
                  Model
                </Label>
                <TooltipHover name={MODEL} />
              </div>
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
            <div className="grid w-full gap-1.5">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                placeholder="Type your prompt here."
                id="prompt"
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              />
            </div>
            {form.model === "dall-e-2" && (
              <div className="flex flex-col gap-1.5">
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
              form.prompt === "" ||
              form.model === "" ||
              form.n === "" ||
              form.size === ""
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
