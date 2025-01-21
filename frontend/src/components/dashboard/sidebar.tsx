"use client";

import { usePathname } from "next/navigation";
import {
  Repeat,
  Image as ImageIcon,
  Music,
  History,
  GitCompare,
  Image,
} from "lucide-react";

import LLMRequests from "../llm/llm-requests";
import ImageRequests from "../image/image-requests";

interface ISidebar {
  type: "history" | "image" | "llm";
}

const Sidebar: React.FC<ISidebar> = ({ type }) => {
  const pathname = usePathname();

  return (
    <div
      className={`hidden md:grid shrink-0 ${
        type !== "history" ? "w-96 grid-cols-4" : "w-24"
      }`}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <a href="/dashboard/llm">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/dashboard/llm")
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 items-center justify-center">
                  <Repeat className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  LLM
                </div>
              </button>
            </a>
            <a href="/dashboard/image">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/dashboard/image")
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 items-center justify-center">
                  <ImageIcon className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  Image
                </div>
              </button>
            </a>
            <button
              className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                pathname?.includes("/music")
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              disabled
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <Music className="h-[0.8rem] w-[0.8rem] shrink-0" />
                <div className="flex flex-col items-center">
                  <span>Music</span>
                  <span className="text-[8px] -mt-2">Coming soon</span>
                </div>
              </div>
            </button>
            <a href="/dashboard/compare/llm">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/dashboard/compare/llm")
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 items-center justify-center text-xs">
                  <GitCompare className="h-[1rem] w-[1rem] shrink-0" />
                  Compare LLM
                </div>
              </button>
            </a>
            <a href="/dashboard/compare/image">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/dashboard/compare/image")
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 items-center justify-center text-xs">
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
                    className="lucide lucide-images h-[1rem] w-[1rem]"
                  >
                    <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                    <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
                    <circle cx="12" cy="8" r="2" />
                    <rect width="16" height="16" x="6" y="2" rx="2" />
                  </svg>
                  Compare Image
                </div>
              </button>
            </a>
            <a href="/dashboard/history">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/dashboard/history")
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 items-center justify-center">
                  <History className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  History
                </div>
              </button>
            </a>
          </div>
        </div>
      </div>
      {type !== "history" ? (
        type === "llm" ? (
          <LLMRequests />
        ) : (
          <ImageRequests />
        )
      ) : null}
    </div>
  );
};

export default Sidebar;
