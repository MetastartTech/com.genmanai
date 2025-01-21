"use client";

import CompareRequests from "@/components/compare/llm/compare-requests";

const Tab: React.FC = () => {
  return (
    <main className="relative overflow-x-auto h-full md:min-w-[600px]">
      <CompareRequests />
    </main>
  );
};

export default Tab;
