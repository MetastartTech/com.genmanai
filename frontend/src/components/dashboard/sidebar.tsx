"use client";

import { usePathname } from "next/navigation";
import {
  Repeat,
  Image as ImageIcon,
  Music,
  History,
  Loader,
} from "lucide-react";
import NewFolderModal from "./new-folder-modal";
import NewRequestModal from "./new-request-modal";
import { Input } from "../ui/input";
import Folder from "./folder";
import Request from "./request";
import { useEffect, useState } from "react";
import useUser from "@/provider/userContext/useUserContext";
import requests from "@/api/llm/requests";

const Sidebar: React.FC = () => {
  const { idToken } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [userRequests, setUserRequests] = useState([]);
  const pathname = usePathname();

  const history = pathname === "/dashboard/history";

  useEffect(() => {
    setLoading(true);
    requests(idToken ?? "")
      .then((data) => setUserRequests(data))
      .finally(() => setLoading(false));
  }, [idToken]);

  return (
    <div
      className={`grid shrink-0 ${
        history === false ? "w-96 grid-cols-4" : "w-24"
      }`}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <a href="/llm/1">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/llm")
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
            <button
              className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                pathname?.includes("/image")
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex flex-col gap-1 items-center justify-center">
                <ImageIcon className="h-[0.8rem] w-[0.8rem] shrink-0" />
                Image
              </div>
            </button>
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
            <a href="/history">
              <button
                className={`text-sm font-medium py-2 w-full rounded-md disabled:pointer-events-none disabled:opacity-50 ${
                  pathname?.includes("/history")
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
      {history === false && (
        <div className="space-y-4 py-4 col-span-3 border-l h-full">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin h-fit w-fit">
                <Loader strokeWidth={"1.2"} size={24} />
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  Requests
                </h2>
                <div className="flex items-center">
                  <NewFolderModal />
                  <NewRequestModal />
                </div>
              </div>
              <Input
                type="search"
                placeholder="Search Requests ..."
                className="mb-4"
              />

              <div className="space-y-1">
                {userRequests.length &&
                  userRequests.map((request) => (
                    <Request
                      key={request._id}
                      name={request.name}
                      type={request.type}
                      id={request._id}
                    />
                  ))}
                {/* <Folder
                  searchTerm={""}
                  currentFolder={{ id: "1", name: "GPT 3.5" }}
                >
                  <Request name="What is genman?" type="chat" active={true} />
                  <Request name="Product names" type="completion" />
                </Folder>
                <Folder
                  searchTerm={""}
                  currentFolder={{ id: "1", name: "Claude 2" }}
                /> */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
