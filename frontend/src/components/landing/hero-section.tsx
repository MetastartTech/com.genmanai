import Image from "next/image";
// import bg from "@/assets/bg.webp";
// import bg from "/images/bg.webp";
import Link from "next/link";
import { CubeIcon } from "../icons";
export default function HeroSection() {
    return (
      <div id="hero-section">
        <div className="relative flex flex-col text-center h-[100dvh] w-full justify-center items-center">
          <h1 className="text-5xl lg:text-8xl lg:tracking-[-4px] font-bold -mt-12">
            GenMan
          </h1>
          <p className=" w-10/12 text-sm md:text-base font-medium mt-3">
            The ultimate prompt testing tool for developers and prompt engineers
          </p>
          <Link
            href="/dashboard/llm/"
            className="bg-black flex gap-2 mt-6 px-8 text-sm p-3 rounded-md text-white"
          >
            Try It Out <CubeIcon />
          </Link>
          <Link href={"#"} className="dotted-bdr font-medium px-1 text-xs mt-4">
            Learn more ↗
          </Link>
          <img
            className="z-[-100] opacity-30 object-cover h-[100dvh] w-full absolute top-0 left-0"
            src={"/images/bg.webp"}
            alt=""
          />
        </div>
      </div>
    );
}
