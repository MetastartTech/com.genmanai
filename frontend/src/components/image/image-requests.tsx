import { useState } from "react";
import useUser from "@/provider/userContext/useUserContext";
import NewFolderModal from "./new-folder-modal";
import NewRequestModal from "./new-request-modal";
import { Input } from "../ui/input";
import Folder from "./folder";
import Request from "./request";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";
import SidebarLoader from "../common/sidebar-loader";

const ImageRequests = () => {
  const { idToken } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const [isSidebarDragOver, setIsSidebarDragOver] = useState<boolean>(false);
  const [isFolderDragOver, setIsFolderDragOver] = useState<boolean>(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const {
    userRequests,
    sidebarLoading,
    handleAddNewRequest,
    activeTab,
    folders,
    addFolder,
    addRequestToFolder,
    addRequestOutsideFolder,
  } = useImageRequests();

  const handleDragOverSidebar = (e: any) => {
    e.preventDefault();
    if (e.target.classList.contains("folder")) {
      setDragId(e.target.getAttribute("data-folder-id"));
      setIsSidebarDragOver(false);
      setIsFolderDragOver(true);
    } else {
      setDragId(null);
      setIsSidebarDragOver(true);
      setIsFolderDragOver(false);
    }
  };

  const handleDragLeave = () => {
    setIsSidebarDragOver(false);
    setIsFolderDragOver(false);
  };

  const handleDropOnSidebar = async (e: any) => {
    e.preventDefault();

    const isFolderDrop = e.target.classList.contains("folder");

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (isFolderDrop) {
      setIsFolderDragOver(false);
      const folderId = e.target.getAttribute("data-folder-id");
      addRequestToFolder(idToken ?? "", folderId, data);
    } else {
      setIsSidebarDragOver(false);
      await addRequestOutsideFolder(idToken ?? "", data);
    }
  };

  const filteredUserRequests = userRequests?.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`space-y-4 py-2 md:py-4 md:col-span-3 md:border-l h-full md:md:h-[calc(100vh-65px)]`}
    >
      {sidebarLoading ? (
        <SidebarLoader />
      ) : (
        <div className="md:px-3 py-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold tracking-tight">Requests</h2>
            <div className="flex items-center">
              <NewFolderModal onAdd={addFolder} />
              <div className="hidden md:block">
                <NewRequestModal addRequest={handleAddNewRequest} />
              </div>
            </div>
          </div>
          <Input
            type="search"
            placeholder="Search Requests ..."
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div
            className={`space-y-2 overflow-y-auto grow outline outline-offset-4 pb-10 ${
              isSidebarDragOver ? "outline-1" : "outline-0"
            }`}
            onDrop={handleDropOnSidebar}
            onDragOver={handleDragOverSidebar}
            onDragLeave={handleDragLeave}
          >
            {filteredUserRequests?.map((request: any) => (
              <Request
                key={request._id}
                name={request.name}
                type={request.type}
                _id={request._id}
                active={request._id == activeTab}
              />
            ))}

            {folders?.length ? (
              folders.map((folder) => (
                <Folder
                  searchTerm={searchTerm}
                  key={folder._id}
                  currentFolder={folder}
                  isDragOver={isFolderDragOver && folder._id === dragId}
                >
                  {folder.requests
                    .filter((request) =>
                      request.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((request) => (
                      <Request
                        key={request._id}
                        name={request.name}
                        type={request.type}
                        _id={request._id}
                        active={request._id == activeTab}
                        folderId={request.folder ?? ""}
                      />
                    ))}
                </Folder>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageRequests;
