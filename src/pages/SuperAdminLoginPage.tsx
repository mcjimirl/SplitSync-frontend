import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import StateMessage from "../components/ui/StateMessage";
import AuthCenterLayout from "../components/marketing/AuthCenterLayout";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../features/theme/ThemeContext";
import { loginWithPassword } from "../services/authService";

export default function SuperAdminLoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const card = isDark
    ? "border-amber-500/25 bg-zinc-950/75"
    : "border-amber-300/60 bg-amber-50/95 shadow-xl shadow-amber-900/10";
  const eyebrow = isDark ? "text-amber-500/90" : "text-amber-800";
  const title = isDark ? "text-white" : "text-slate-900";
  const subtitle = isDark ? "text-zinc-400" : "text-slate-600";
  const label = isDark ? "text-zinc-500" : "text-slate-600";
  const linkMuted = isDark ? "text-zinc-500" : "text-slate-600";
  const linkAccent = isDark ? "text-white" : "text-slate-900";
  const inputVariant = isDark ? "dark" : "default";
  const inputClass = isDark ? "mt-2" : "mt-2 border border-slate-200 bg-white !text-slate-900";
  const submit = isDark
    ? "bg-white text-neutral-950 hover:bg-zinc-100"
    : "bg-slate-900 text-white hover:bg-slate-800";

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      navigate("/app/admin", { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || password.length < 8) {
      setError("Enter a valid super admin email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = await loginWithPassword(email, password);
      login(token);
      navigate("/app/admin", { replace: true });
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Super admin login failed.");
      } else {
        setError("Super admin login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenterLayout>
      <div className={`rounded-2xl border p-8 backdrop-blur-md sm:p-10 ${card}`}>
        <p className={`text-center text-[10px] font-semibold uppercase tracking-[0.35em] ${eyebrow}`}>Privileged access</p>
        <h1 className={`mt-3 text-center text-2xl font-bold uppercase tracking-tight sm:text-3xl ${title}`}>Super admin</h1>
        <p className={`mt-2 text-center text-sm ${subtitle}`}>Sign in with your super admin email and password.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div>
            <label htmlFor="sa-email" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Email
            </label>
            <Input
              id="sa-email"
              variant={inputVariant}
              type="email"
              autoComplete="username"
              placeholder="Super admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="sa-password" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Password
            </label>
            <Input
              id="sa-password"
              variant={inputVariant}
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <StateMessage kind="error" message={error} tone={isDark ? "dark" : "light"} />}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-50 ${submit}`}
          >
            {loading ? "Signing in…" : "Continue as super admin"}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${linkMuted}`}>
          <Link to="/login" className={`font-semibold underline-offset-4 hover:underline ${linkAccent}`}>
            ← Back to member login
          </Link>
        </p>
      </div>
    </AuthCenterLayout>
  );
}
