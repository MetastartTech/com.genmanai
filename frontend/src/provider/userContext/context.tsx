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
  signUpWithEmailPassword: (
    email: string,
    password: string,
    fullName: string,
    code: string = ""
  ) => {
    return;
  },
  signInWithEmailPassword: (email: string, password: string) => {
    return;
  },
  setUserCredits: (wallet) => {
    return;
  },
};

const UserContext = createContext<IUserContext>(defaultContext);

export default UserContext;
