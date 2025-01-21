import NewRequestModal from "../llm/new-request-modal";
import NewImageRequestModal from "../image/new-request-modal";
import useUserRequests from "@/provider/userRequestsContext/useUserRequestsContext";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";

interface IWelcome {
  type: "llm" | "image";
}

const Welcome: React.FC<IWelcome> = ({ type }) => {
  const { handleAddNewRequest } = useUserRequests();
  const { handleAddNewRequest: handleAddImageRequest } = useImageRequests();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <h2 className="text-xl font-medium">Welcome to GenMan</h2>
      <p className="text-sm mb-2">Start by creating a request</p>

      {type === "llm" ? (
        <NewRequestModal
          text="Add a request"
          but={true}
          addRequest={handleAddNewRequest}
        />
      ) : (
        <NewImageRequestModal
          text="Add a request"
          but={true}
          addRequest={handleAddImageRequest}
        />
      )}
    </div>
  );
};

export default Welcome;
