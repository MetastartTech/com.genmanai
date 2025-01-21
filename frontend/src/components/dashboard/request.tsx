import { AlignCenter, MessagesSquare } from "lucide-react";
import RequestMenu from "./request-menu";
import { useRouter } from "next/navigation";

interface IRequest {
  active?: boolean;
  name: string;
  type: "chat" | "completion";
  id: string;
}

const Request: React.FC<IRequest> = ({ active = false, type, name, id }) => {
  const router = useRouter();

  return (
    <div
      className="relative flex items-center pl-5 w-full cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/llm/${id}`);
      }}
    >
      <div className="h-10 w-[2px] bg-black dark:bg-white"></div>
      <div
        className={`pr-2 h-10 pl-4 flex items-center gap-2 hover:bg-secondary/80 text-sm w-full ${
          active ? "bg-secondary/80" : ""
        }`}
      >
        {type === "chat" ? (
          <MessagesSquare className="h-4 w-4" />
        ) : (
          <AlignCenter className="h-4 w-4" />
        )}
        {name}
      </div>
      <div className="absolute right-1">
        <RequestMenu />
      </div>
    </div>
  );
};

export default Request;
