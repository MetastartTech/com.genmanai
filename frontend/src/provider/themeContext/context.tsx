import { IThemeContext } from "@/types/context";
import { createContext } from "react";

const defaultContext: IThemeContext = {
  color: "gray",
  theme: "system",
  setThemeAndColor: () => {
    return;
  },
  toggleDarkMode: () => {
    return;
  },
  toggleLightMode: () => {
    return;
  },
  toggleSystemMode: () => {
    return;
  },
  handleColorSelection: () => {
    return;
  },
};

const ThemeContext = createContext<IThemeContext>(defaultContext);

export default ThemeContext;
