import { X, AlignCenter, MessagesSquare } from "lucide-react";
import TabMenu from "./tab-menu";
import NewRequestModal from "../dashboard/new-request-modal";

const buttons = [
  {
    label: "What is genman?",
    type: "chat",
    id: "1",
  },
  {
    label: "Product Names",
    type: "completion",
    id: "2",
  },
];

interface IRequestHeader {
  reqid: string;
}

const RequestHeader: React.FC<IRequestHeader> = ({ reqid }) => {
  return (
    <div className="flex sticky top-0 inset-x-0 bg-background z-10">
      <div className="flex overflow-x-auto scrollbar scrollbar-none whitespace-nowrap">
        {buttons.map((button, index) => (
          <a href={`/llm/${button.id}`} key={index}>
            <button
              className={`group relative shrink-0 overflow-x-hidden inline-flex items-center h-10 w-32 px-2 py-1 text-xs text-gray-700 dark:text-white whitespace-nowrap cursor-base focus:outline-none ${
                button.id === reqid
                  ? `${
                      index === 0 ? "border-l-0" : ""
                    } border border-b-0 border-t-2 border-t-primary italic border-r-gray-300 border-l-gray-300 dark:border-r-gray-500 dark:border-l-gray-500`
                  : "border-b border-gray-300 dark:border-gray-500"
              }`}
            >
              {button.type === "chat" ? (
                <MessagesSquare className="h-3.5 w-3.5 mr-1" />
              ) : (
                <AlignCenter className="h-3.5 w-3.5 mr-1" />
              )}
              {button.label}
              {button.id === reqid &&
                index > 0 &&
                index < buttons.length - 1 && (
                  <div className="h-6 w-[1px] dark:bg-gray-500 bg-gray-300 absolute right-0" />
                )}
              {button.id === reqid &&
                index === 0 &&
                buttons[index + 1].id === reqid && (
                  <div className="h-6 w-[1px] dark:bg-gray-500 bg-gray-300 absolute right-0" />
                )}
              {button.id === reqid &&
                index === buttons.length - 1 &&
                buttons[index - 1].id === reqid && (
                  <div className="h-6 w-[1px] dark:bg-gray-500 bg-gray-300 absolute right-0" />
                )}
              <div
                className={`absolute ${
                  button.id === reqid ? "right-0" : "right-[1px]"
                } px-1.5 w-6 h-full flex items-center group-hover:bg-background bg-gradient-to-l from-background via-background to-transparent`}
              >
                <X className="h-3 w-3 group-hover:block hidden" />
              </div>
            </button>
          </a>
        ))}
      </div>

      <div className="h-10 grow py-1 px-2 flex items-center gap-2 border-b dark:border-gray-500 border-gray-300">
        <NewRequestModal size="sm" />
        <TabMenu />
      </div>
    </div>
  );
};

export default RequestHeader;
