import { Link } from "react-router-dom";
import { FiChevronRight, FiMoon, FiSun, FiUser } from "react-icons/fi";
import Card from "../components/ui/Card";
import { useTheme } from "../features/theme/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="mx-auto max-w-xl space-y-4">
      <Card className="p-5">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Appearance and quick links.</p>
      </Card>

      <Card className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-white/60"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              {theme === "dark" ? <FiMoon /> : <FiSun />}
            </span>
            <span>
              <span className="block font-semibold text-slate-900">Theme</span>
              <span className="text-sm text-slate-500">Currently {theme === "dark" ? "dark" : "light"} mode</span>
            </span>
          </span>
          <FiChevronRight className="text-slate-400" />
        </button>
        <div className="border-t border-slate-200/80" />
        <Link
          to="/app/profile"
          className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/60"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <FiUser />
            </span>
            <span>
              <span className="block font-semibold text-slate-900">Account & profile</span>
              <span className="text-sm text-slate-500">Name, metrics, avatar</span>
            </span>
          </span>
          <FiChevronRight className="text-slate-400" />
        </Link>
      </Card>

      <p className="px-1 text-center text-xs text-slate-400">SplitSync — workout plans, attendance, and diet ideas.</p>
    </section>
  );
}
