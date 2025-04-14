import { FC, PropsWithChildren, useEffect } from "react";

import { selectTheme } from "@/app/providers/ThemeProvider";
import { useAppSelector } from "@/shared/lib/hooks";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
};
