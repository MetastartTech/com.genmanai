import { useContext } from "react";
import ImageRequestsContext from "./context";

const useImageRequests = () => {
  const context = useContext(ImageRequestsContext);
  if (!context) {
    throw new Error("Encountered error!");
  }
  return context;
};

export default useImageRequests;
