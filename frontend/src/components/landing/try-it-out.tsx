import React from "react";
import { CubeIcon } from "../icons";
import Link from "next/link";

const TryItOut = () => {
  return (
    <div
      id="tryitout"
      className="flex flex-col items-center justify-center p-10 mb-10"
    >
      <h1 className="text-4xl lg:text-6xl -tracking-[0.06em] mb-3">
        Transform the way you test and develop AI models.
      </h1>
      <Link
        href="/dashboard/llm/"
        className="bg-black flex gap-2 mt-6 px-8 text-sm p-3 rounded-md text-white"
      >
        Try It Out <CubeIcon />
      </Link>
    </div>
  );
};

export default TryItOut;
