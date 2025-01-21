"use client";

import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "../../ui/select";

interface FormProps {
  form: {
    name: string;
    request: string;
    model: string;
    prompt: string;
    size: string;
    n: string;
  };
  handleFormChange: (key: string, value: any) => void;
}

const CompareForm: React.FC<FormProps> = ({ form, handleFormChange }) => {
  return (
    <div className="flex flex-col gap-5 w-full md:basis-1/2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Model</Label>
        <Select
          value={form.model}
          onValueChange={(value: string) => handleFormChange("model", value)}
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
      <div className="grid gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Size</Label>
          <Select
            value={form.size}
            onValueChange={(value: string) => handleFormChange("size", value)}
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
    </div>
  );
};

export default CompareForm;
