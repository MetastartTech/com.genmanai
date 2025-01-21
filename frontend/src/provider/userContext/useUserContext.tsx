import { useContext } from "react";
import AppContext from "./context";

const useUser = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Encountered error!");
  }
  return context;
};

export default useUser;
