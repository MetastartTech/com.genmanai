import { useContext } from "react";
import UserRequestsContext from "./context";

const useUserRequests = () => {
  const context = useContext(UserRequestsContext);
  if (!context) {
    throw new Error("Encountered error!");
  }
  return context;
};

export default useUserRequests;
