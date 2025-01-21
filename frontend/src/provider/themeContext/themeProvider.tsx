"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { IThemeContext } from "@/types/context";
import ThemeContext from "./context";
import { colorThemes } from "@/themes";

interface ThemeProviderProps {
  children: ReactNode;
}

const updateThemeWithColor = (
  color: string,
  mode: "light" | "dark" | "system"
) => {
  const root = window.document.documentElement;
  const colorTheme = colorThemes[color];
  for (let variable in colorTheme.root) {
    root.style.setProperty(
      variable,
      mode === "dark" ? colorTheme.dark[variable] : colorTheme.root[variable]
    );
  }
  localStorage.setItem("genmanColor", color);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [color, setColor] = useState<string>("gray");
  const [initialized, setInitialized] = useState(false);

  const setThemeAndColor = (
    newTheme: "light" | "dark" | "system",
    newColor: string
  ) => {
    setTheme(newTheme);
    setColor(newColor);
  };

  const toggleLightMode = () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    const colorTheme = colorThemes[color ?? "orange"];
    for (let variable in colorTheme.root) {
      root.style.setProperty(variable, colorTheme.root[variable]);
    }
    root.classList.add("light");
    setThemeAndColor("light", color);
  };

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    const colorTheme = colorThemes[color ?? "orange"];
    for (let variable in colorTheme.root) {
      root.style.setProperty(variable, colorTheme.dark[variable]);
    }
    root.classList.add("dark");
    setThemeAndColor("dark", color);
  };

  const toggleSystemMode = () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const colorTheme = colorThemes[color ?? "orange"];
    for (let variable in colorTheme.root) {
      root.style.setProperty(
        variable,
        systemTheme === "dark"
          ? colorTheme.dark[variable]
          : colorTheme.root[variable]
      );
    }
    root.classList.add(systemTheme);
    setThemeAndColor("system", color);
  };

  const handleColorSelection = (color: string) => {
    let mode = theme;
    if (mode === "system") {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    updateThemeWithColor(color, mode);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("genmanTheme") as
      | "light"
      | "dark"
      | "system"
      | null;
    const storedColor = localStorage.getItem("genmanColor") || "orange";

    if (storedTheme) {
      setThemeAndColor(storedTheme, storedColor);
    } else {
      setThemeAndColor("light", "orange");
    }

    setInitialized(true);

    const root = document.documentElement;
    const colorTheme = colorThemes[storedColor || "gray"];

    if (storedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      for (let variable in colorTheme.root) {
        root.style.setProperty(
          variable,
          systemTheme === "dark"
            ? colorTheme.dark[variable]
            : colorTheme.root[variable]
        );
      }
    } else {
      root.classList.add(storedTheme || "light");
      for (let variable in colorTheme.root) {
        root.style.setProperty(
          variable,
          storedTheme === "dark"
            ? colorTheme.dark[variable]
            : colorTheme.root[variable]
        );
      }
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("genmanTheme", theme);
      localStorage.setItem("genmanColor", color);
    }
  }, [theme, color, initialized]);

  const contextValue: IThemeContext = {
    theme,
    color,
    setThemeAndColor,
    toggleLightMode,
    toggleDarkMode,
    toggleSystemMode,
    handleColorSelection,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
