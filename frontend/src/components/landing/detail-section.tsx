import Image from "next/image";
import React from "react";

const DetailSection = () => {
    return (
      <div
        id="about"
        className="detail flex items-center p-10 h-[350px] md:h-[450px] lg:h-[750px] justify-between"
      >
        <div className="w-full lg:w-2/5 flex justify-center md:ml-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Test and Optimize AI Prompts
            <span className="inline-block text-xl dark:hidden w-6 h-6 md:w-10 md:h-10">
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/star-light.svg"
              />
            </span>
            <span className="hidden text-xl dark:inline-block w-6 h-6 md:w-10 md:h-10">
              <Image
                width={100}
                height={100}
                alt=""
                src="/images/star-dark.svg"
              />
            </span>{" "}
            with Precision and Ease
          </h1>
        </div>
        <div className="mr-24 hidden lg:flex w-2/5">
          <Image
            src="/images/3dimage.svg"
            width={700}
            height={700}
            alt=""
            draggable={false}
            className="h-[700px] w-[700px] dark:hidden"
          />
          <Image
            src="/images/3dimage-dark.svg"
            alt=""
            width={700}
            height={700}
            draggable={false}
            className="hidden h-[700px] w-[700px] dark:block"
          />
        </div>
      </div>
    );
};

export default DetailSection;
