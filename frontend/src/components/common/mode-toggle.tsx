"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useTheme from "@/provider/themeContext/useThemeContext";

const ModeToggle = () => {
  const { toggleLightMode, toggleDarkMode, toggleSystemMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggleLightMode}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleDarkMode}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleSystemMode}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
