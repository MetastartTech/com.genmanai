import { createContext } from "react";
import type { IUserContext } from "../../types/context";

const defaultContext: IUserContext = {
  user: null,
  setUser: () => {
    return;
  },
  signIn: async () => {
    return;
  },
  logOut: () => {
    return;
  },
  loading: false,
  setLoading: () => {
    return;
  },
  idToken: null,
  setIdToken: () => {
    return;
  },
  initializing: true,
};

const UserContext = createContext<IUserContext>(defaultContext);

export default UserContext;
