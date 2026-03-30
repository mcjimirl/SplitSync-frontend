import { FiBell, FiMenu, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useTheme } from "../../features/theme/ThemeContext";
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
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
    return avatarUrl;
  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
}
export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { toggle } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitle(location.pathname);

  return (
    <header className="flex flex-col gap-3 rounded-2xl bg-white/80 p-3 shadow-sm shadow-slate-200/50 md:flex-row md:items-center md:justify-between md:gap-4 md:p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="icon-btn shrink-0 bg-slate-900 flex justify-center items-center md:h-10 md:w-10"
          onClick={toggle}
          aria-label="Open menu"
        >
          <FiMenu className="text-lg" />
        </button>
        <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto md:flex-1 md:max-w-xl">
        <div className="relative w-full flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-full border border-transparent bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-slate-200 transition focus:ring-2"
            placeholder="Search plans, guides, diet..."
            aria-label="Search"
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            className="icon-btn text-slate-600 sm:grid flex justify-center items-center"
            aria-label="Notifications"
          >
            <FiBell />
          </button>
          <button
            type="button"
            className="icon-btn bg-lime-300 text-slate-900 flex justify-center items-center"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            to="/app/profile"
            className="flex max-w-[200px] items-center justify-center gap-2 rounded-full border border-white/80 bg-white p-1 shadow-sm transition hover:bg-slate-50"
          >
            {user?.avatarUrl ? (
              <img
                src={resolveAvatarUrl(user.avatarUrl)}
                alt=""
                className="h-9 w-9 rounded-full object-cover "
              />
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
