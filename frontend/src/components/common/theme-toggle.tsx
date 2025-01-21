"use client";

import { Paintbrush } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useTheme from "@/provider/themeContext/useThemeContext";

const colors = [
  { type: "gray", color: "#4b5563" },
  { type: "orange", color: "#ea580c" },
  { type: "rose", color: "#e11d48" },
  { type: "blue", color: "#3b82f6" },
  { type: "green", color: "#22c55e" },
];

const ThemeToggle = () => {
  const { handleColorSelection } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
          <span className="sr-only">Toggle colour</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.type}
            onClick={() => handleColorSelection(color.type)}
            style={{ "--theme-primary": color.color } as React.CSSProperties}
            className="flex gap-2 items-center"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]`}
            ></span>
            <span className="capitalize font-medium">{color.type}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
