"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/lib/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
      className="relative grid h-9 w-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full glass glass-hover text-ink"
    >
      <SunIcon
        className={`absolute h-4.5 w-4.5 transition-all duration-500 ${
          dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <MoonIcon
        className={`absolute h-4.5 w-4.5 transition-all duration-500 ${
          dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      />
    </button>
  );
}
