"use client";

import RequestBody from "@/components/llm/request-body";
import RequestHeader from "@/components/llm/request-header";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Tab: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get("name")) {
      toast.success(`Successfully bought ${params.get("name")}`);
      router.replace("/dashboard/llm");
    }
  }, [params, router]);

  return (
    <main className="relative overflow-x-auto h-full md:min-w-[600px]">
      <RequestHeader />
      <RequestBody />
    </main>
  );
};

export default Tab;
