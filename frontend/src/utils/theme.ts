import { Theme } from "../interfaces";

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  switch (theme) {
    case "dark":
      root.classList.add("dark");
      break;
    case "light":
      root.classList.remove("dark");
      break;
    default:
      {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", isDark);
      }
      break;
  }
};
