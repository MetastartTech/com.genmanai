"use client";

import RequestBody from "@/components/llm/request-body";
import RequestHeader from "@/components/llm/request-header";
import { useSearchParams } from "next/navigation";

const Tab = () => {
  const params = useSearchParams();

  return (
    <main className="relative overflow-x-auto h-full min-w-[600px]">
      <RequestHeader reqid={params?.get("id") ?? ""} />
      <RequestBody />
    </main>
  );
};

export default Tab;
