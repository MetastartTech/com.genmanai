import { IUser } from "./schema";

export interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signIn: () => Promise<void>;
  logOut: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  idToken: string | null;
  setIdToken: (idToken: string | null) => void;
  initializing: boolean;
}

export interface IThemeContext {
  theme: "light" | "dark" | "system";
  color: string;
  setThemeAndColor: (
    newTheme: "light" | "dark" | "system",
    newColor: string
  ) => void;
  toggleLightMode: () => void;
  toggleDarkMode: () => void;
  toggleSystemMode: () => void;
  handleColorSelection: (color: string) => void
}
