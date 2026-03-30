import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../features/theme/ThemeContext";
import ThemeToggleButton from "../ui/ThemeToggleButton";

type PublicNavProps = {
  /** Landing shows center anchor links; auth shows minimal nav */
  variant?: "landing" | "auth";
};

export default function PublicNav({ variant = "landing" }: PublicNavProps) {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isAuth = variant === "auth";
  const isDark = theme === "dark";

  const bar = isDark
    ? "border-white/5 bg-black/20 backdrop-blur-md"
    : "border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-md";

  const brand = isDark ? "text-white" : "text-slate-900";
  const navLink = isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const textLink = isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const join = isDark
    ? "bg-white text-neutral-950 hover:bg-zinc-100"
    : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 border-b ${bar}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link to="/" className={`text-sm font-black uppercase tracking-[0.2em] sm:text-base ${brand}`}>
          SplitSync
        </Link>

        {!isAuth && (
          <nav
            className={`flex max-w-[50vw] flex-1 flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.2em] sm:max-w-none sm:gap-6 sm:text-[10px] md:tracking-[0.25em] lg:gap-10 lg:text-[11px] ${navLink}`}
            aria-label="Marketing"
          >
            <a href="/#philosophy" className="transition">
              Philosophy
            </a>
            <a href="/#stories" className="transition">
              Stories
            </a>
            <a href="/#pricing" className="transition">
              Pricing
            </a>
          </nav>
        )}

        {isAuth && <div className="hidden flex-1 md:block" aria-hidden />}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggleButton chrome={isDark ? "dark" : "light"} />
          {pathname !== "/login" && (
            <Link
              to="/login"
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition sm:text-[11px] ${textLink}`}
            >
              Log in
            </Link>
          )}
          {pathname !== "/signup" && (
            <Link
              to="/signup"
              className={`rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm transition sm:px-6 sm:text-[11px] ${join}`}
            >
              Join now
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
