import Image from "next/image";
import React from "react";
import TooltipHover from "../common/tooltip-hover";
import {
  ANALYZE_RESULTS,
  CONFIGURE_TEST,
  REFINE_DEPLOY,
} from "@/constants/tooltipName";
import { Settings } from "lucide-react";

// const StepsSection = () => {
//     return (
//         <div className="steps flex justify-center items-center lg:items-self p-10 h-[350px] md:h-[600px] lg:h-[700px]">
//             <Image
//                 src="/images/steps2.svg"
//                 width={700}
//                 height={700}
//                 alt=""
//                 draggable={false}
//                 className="h-[300px] md:h-[500px] w-[450px] md:w-[750px] bg-cover bg-no-repeat"
//             />
//         </div>
//     );
// };

const StepsSection = () => {
  return (
    <div className="flex flex-col justify-around items-center mb-16">
      <div
        id="steps"
        className="flex flex-col justify-around w-full p-5 lg:p-0 lg:w-3/4 h-[400px] md:h-[600px]"
      >
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex items-center">
              <img
                src="/images/1.svg"
                className="w-11 h-11 md:w-24 md:h-24 mr-1"
              />
              <h2 className="font-normal text-2xl md:text-4xl lg:text-5xl mr-3 cursor-pointer">
                <TooltipHover
                  name={CONFIGURE_TEST}
                  displayName={CONFIGURE_TEST}
                  placement="bottom"
                  offset={25}
                />
              </h2>
              {/* <img
                src="/images/settings.svg"
                className="h-4 w-4 md:w-6 md:h-6"
              /> */}
              <Settings className="h-4 w-4 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/steps-line.svg"
            className="w-full pl-5 pr-5 md:p-2 md:pl-11 md:pr-11"
          />
        </div>
        <div className="flex flex-row-reverse">
          <div className="flex flex-col">
            <div className="flex flex-row-reverse items-center">
              <img
                src="/images/2.svg"
                className="w-11 h-11 md:w-24 md:h-24 ml-1"
              />
              <h2 className="font-normal text-2xl md:text-4xl lg:text-5xl ml-3 cursor-pointer">
                <TooltipHover
                  name={ANALYZE_RESULTS}
                  displayName={ANALYZE_RESULTS}
                  placement="top"
                  offset={25}
                />
              </h2>
              <img
                src="/images/lightning.svg"
                className="h-4 w-4 md:w-6 md:h-6"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/steps-line-2.svg"
            className="w-full pl-5 pr-5 md:p-2 md:pl-11 md:pr-11"
          />
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex items-center">
              <img
                src="/images/3.svg"
                className="w-11 h-11 md:w-24 md:h-24 mr-1"
              />
              <h2 className="font-normal text-2xl md:text-4xl lg:text-5xl mr-3 cursor-pointer">
                <TooltipHover
                  name={REFINE_DEPLOY}
                  displayName={REFINE_DEPLOY}
                  placement="top"
                  offset={25}
                />
              </h2>
              <img src="/images/cube.svg" className="h-4 w-4 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsSection;
