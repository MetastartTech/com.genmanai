"use client";
import { X, AlignCenter, MessagesSquare } from "lucide-react";
import TabMenu from "./tab-menu";
import NewRequestModal from "./new-request-modal";
import useUserRequests from "@/provider/userRequestsContext/useUserRequestsContext";

const RequestHeader: React.FC = () => {

  const {
    tabsLoading,
    tabRequests,
    handleRemoveTabRequest,
    makeRequestTabActive,
    handleAddNewRequest,
    activeTab,
    closeAllTabs,
    closeAllButSelectedTab,
  } = useUserRequests();


  return (
    <div className="block md:sticky md:top-0 inset-x-0 bg-background z-10">
      <div className="flex">
        <div className="flex overflow-x-auto scrollbar scrollbar-none whitespace-nowrap">
          {!tabsLoading &&
            tabRequests?.map((button, index) => (
              <a key={index}>
                <button
                  className={`group relative shrink-0 overflow-x-hidden inline-flex items-center h-10 w-32 px-2 py-1 text-xs text-gray-700 dark:text-white whitespace-nowrap cursor-base focus:outline-none ${
                    button._id === activeTab
                      ? `${
                          index === 0 ? "border-l-0" : ""
                        } border border-b-0 border-t-2 border-t-primary italic border-r-gray-300 border-l-gray-300 dark:border-r-gray-500 dark:border-l-gray-500`
                      : "border-b border-gray-300 dark:border-gray-500"
                  }`}
                  onClick={() => {
                    makeRequestTabActive(button._id, button.name);
                  }}
                >
                  {button.type === "chat" ? (
                    <MessagesSquare className="h-3.5 w-3.5 mr-1 shrink-0" />
                  ) : (
                    <AlignCenter className="h-3.5 w-3.5 mr-1 shrink-0" />
                  )}
                  {button.name}
                  {!(
                    tabRequests[index + 1] &&
                    tabRequests[index + 1]._id === activeTab
                  ) && (
                    <div className="h-6 w-[0.5px] dark:bg-gray-500 bg-gray-300 absolute right-[0.1px]" />
                  )}
                  <div
                    className={`absolute ${
                      button._id === activeTab ? "right-0" : "right-[1px]"
                    } px-1.5 w-6 h-full flex items-center group-hover:bg-background bg-gradient-to-l from-background via-background to-transparent`}
                  >
                    <X
                      className="h-3 w-3 group-hover:block hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTabRequest(button._id);
                      }}
                    />
                  </div>
                </button>
              </a>
            ))}
        </div>

        <div className="h-10 grow py-1 px-2 flex items-center gap-2 border-b dark:border-gray-500 border-gray-300">
          <NewRequestModal size="sm" addRequest={handleAddNewRequest} />
          <TabMenu
            closeAllTabs={() => {
              closeAllTabs();
            }}
            closeAllButSelectedTab={() => {
              closeAllButSelectedTab(activeTab);
            }}
            closeSelectedTab={() => handleRemoveTabRequest(activeTab)}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
