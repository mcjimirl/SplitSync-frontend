import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useTheme } from "../../features/theme/ThemeContext";
import ThemeToggleButton from "../ui/ThemeToggleButton";
import { useSidebar } from "./SidebarContext";

const titles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/generate": "Generate Plan",
  "/app/attendance": "Attendance",
  "/app/guides": "Exercise Guides",
  "/app/diet": "Diet",
  "/app/profile": "Profile",
  "/app/settings": "Settings",
  "/app/admin": "Admin",
};

function pageTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  return "SplitSync";
}

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) return avatarUrl;
  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
}

export default function TopBar() {
  const { theme } = useTheme();
  const { toggle } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitle(location.pathname);
  const toggleChrome = theme === "dark" ? "dark" : "light";

  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900/90 md:flex-row md:items-center md:justify-between md:gap-4 md:p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="icon-btn flex shrink-0 items-center justify-center bg-slate-900 text-white dark:bg-white dark:text-neutral-950 md:h-10 md:w-10"
          onClick={toggle}
          aria-label="Open menu"
        >
          <FiMenu className="text-lg" />
        </button>
        <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto md:flex-1 md:max-w-xl">
        <div className="relative w-full flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            className="w-full rounded-full border border-slate-200/90 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25"
            placeholder="Search plans, guides, diet..."
            aria-label="Search"
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            className="icon-btn flex items-center justify-center text-slate-600 dark:text-zinc-300"
            aria-label="Notifications"
          >
            <FiBell />
          </button>
          <ThemeToggleButton chrome={toggleChrome} />
          <Link
            to="/app/profile"
            className="flex max-w-[200px] items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white p-1 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            {user?.avatarUrl ? (
              <img src={resolveAvatarUrl(user.avatarUrl)} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-200 text-xs font-semibold text-slate-700 dark:bg-zinc-600 dark:text-zinc-100">
                {(user?.firstName?.[0] ?? user?.name?.[0] ?? "?").toUpperCase()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
