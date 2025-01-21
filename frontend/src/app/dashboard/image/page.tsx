"use client";

import RequestBody from "@/components/image/request-body";
import RequestHeader from "@/components/image/request-header";

const Tab: React.FC = () => {
  return (
    <main className="relative overflow-x-auto h-full md:min-w-[600px]">
      <RequestHeader />
      <RequestBody />
    </main>
  );
};

export default Tab;
