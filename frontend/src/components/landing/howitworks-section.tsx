import Image from "next/image";
import React from "react";

const HowItWorksSection = () => {
    return (
      <div className="howItWorks flex items-center justify-center md:mt-40 md:mb-32">
        <button className="bg-black bg-[url('/images/team.png')] p-2 md:rounded-xl bg-cover h-[360px] md:h-[15rem] w-full md:w-4/5 lg:w-2/3 text-white dark:bg-white dark:text-black flex items-center justify-center font-normal text-3xl md:text-4xl lg:text-5xl">
          Simplify Your Workflow in Three Steps
          {/* <span className="inline-block h-11 w-11 md:h-14 md:w-14 lg:h-20  lg:w-20">
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/play-light.svg"
            />
          </span>{" "} */}
        </button>
      </div>
    );
};

export default HowItWorksSection;
