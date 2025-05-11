"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./index";

export function ToggleTheme() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-[5vh] w-[5vh] p-0 flex items-center justify-center relative rounded-[0.4vh] border border-solid border-transparent outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 shadow-none hover:border-transparent "
        >
          <Sun className="h-[3vh] w-[3vh] transform rotate-0 scale-100 transition-transform duration-200 ease-in-out dark:rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 m-auto h-[3vh] w-[3vh] transform rotate-90 scale-0 transition-transform duration-200 ease-in-out dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="center" alignOffset={-20}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
