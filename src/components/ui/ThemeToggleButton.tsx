import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../features/theme/ThemeContext";

type ThemeToggleButtonProps = {
  /** Visual style for dark vs light chrome (e.g. marketing nav) */
  chrome?: "dark" | "light";
  className?: string;
};

export default function ThemeToggleButton({ chrome = "dark", className = "" }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();

  const base =
    chrome === "dark"
      ? "rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
      : "rounded-full border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid h-9 w-9 shrink-0 place-items-center ${base} ${className}`}
    >
      {theme === "dark" ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
    </button>
  );
}
