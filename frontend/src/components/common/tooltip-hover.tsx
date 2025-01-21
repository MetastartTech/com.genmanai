// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import tooltipContent from "@/constants/tooltipContent";
import { Info } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";

interface ITooltipHover {
  name: string;
  displayName?: string;
  placement?: string;
  offset?: number;
}

// const TooltipHover: React.FC<ITooltipHover> = ({ name }) => {
//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild className="z-20">
//           {/* <p className="hover:cursor-default hover:text-blue-500">i</p> */}
//           <Info className="w-4 h-4 hover:text-blue-500" />
//         </TooltipTrigger>

//         <div className="ml-10">
//           <TooltipContent>
//             <div className="w-[250px] md:w-[450px] ">
//               <p>{tooltipContent[name]}</p>
//             </div>
//           </TooltipContent>
//         </div>
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

const TooltipHover: React.FC<ITooltipHover> = ({
  name,
  displayName,
  placement = "top",
  offset = 5,
}) => {
  return (
    <Tooltip
      enterTouchDelay={0}
      className=" bg-black text-white dark:bg-white dark:text-black z-[100] "
      content={
        <div className="w-[250px] md:w-[450px]">{tooltipContent[name]}</div>
      }
      placement={placement}
      offset={offset}
    >
      {!displayName ? (
        <Info className="w-4 h-4 hover:text-blue-500" />
      ) : (
        displayName
      )}
    </Tooltip>
  );
};

export default TooltipHover;
