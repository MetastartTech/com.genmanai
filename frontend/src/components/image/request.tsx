import { AlignCenter, MessagesSquare, Image as ImageIcon } from "lucide-react";
import RequestMenu from "./request-menu";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";

interface IRequest {
  name: string;
  type: "edit" | "generation";
  _id: string;
  active: boolean;
  folderId?: string;
}

const Request: React.FC<IRequest> = ({ type, name, _id, active, folderId }) => {
  const { handleTabRequestAdd, handleDeleteRequest, handleEditRequestName } =
    useImageRequests();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type, name, _id }));
  };

  const handleRenameRequest = async (name: string) => {
    await handleEditRequestName({
      _id,
      name,
      type: "generation",
    });
  };

  return (
    <div
      draggable
      className="relative flex items-center md:pl-5 w-full cursor-pointer"
      onClick={() => {
        handleTabRequestAdd({ name, type, _id });
      }}
      onDragStart={handleDragStart}
    >
      <div className="h-10 w-[2px] bg-black dark:bg-white"></div>
      <div
        className={`pr-2 h-10 pl-4 flex items-center gap-2 hover:bg-secondary/80 text-sm w-full ${
          active ? "bg-secondary/80" : ""
        }`}
      >
        {type === "generation" ? (
          <ImageIcon className="h-4 w-4" />
        ) : (
          <AlignCenter className="h-4 w-4" />
        )}
        {name}
      </div>
      <div className="absolute right-1">
        <RequestMenu
          delRequest={() => {
            handleDeleteRequest(_id, folderId ?? "");
          }}
          handleRenameRequest={handleRenameRequest}
          oldName={name}
        />
      </div>
    </div>
  );
};

export default Request;
