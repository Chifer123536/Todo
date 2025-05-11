"use client";

import { ToggleTheme } from "./ToggleTheme";

export function ToggleThemeWrapper() {
  return (
    <div className="fixed top-[10vh] left-[1vw] z-50 h-[5vh] w-[5vh]">
      <ToggleTheme />
    </div>
  );
}
