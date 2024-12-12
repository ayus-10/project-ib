import { LIGHT, THEME, Theme } from "@/constants";
import { useEffect, useState } from "react";

export default function useThemes() {
  const [theme, setTheme] = useState<Theme>(LIGHT);

  const applyTheme = (t: Theme) =>
    document.documentElement.setAttribute("data-theme", t);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME);
    if (!savedTheme) return;
    setTheme(savedTheme as Theme);
    applyTheme(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME, theme);
    applyTheme(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
