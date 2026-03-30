import type { FormEvent } from "react";
import { useState } from "react";
import { isAxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import StateMessage from "../components/ui/StateMessage";
import AuthCenterLayout from "../components/marketing/AuthCenterLayout";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../features/theme/ThemeContext";
import { loginWithPassword } from "../services/authService";

export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("athlete@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ?? "/app";

  const card = isDark
    ? "border-white/10 bg-zinc-950/70"
    : "border-slate-200/90 bg-white/95 shadow-xl shadow-slate-900/10";
  const eyebrow = isDark ? "text-white/45" : "text-slate-500";
  const title = isDark ? "text-white" : "text-slate-900";
  const subtitle = isDark ? "text-zinc-400" : "text-slate-600";
  const label = isDark ? "text-zinc-500" : "text-slate-500";
  const linkMuted = isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-800";
  const linkAccent = isDark ? "text-white" : "text-slate-900";
  const inputVariant = isDark ? "dark" : "default";
  const inputLightClass = isDark ? "mt-2" : "mt-2 border border-slate-200 bg-white !text-slate-900";
  const submit = isDark
    ? "bg-white text-neutral-950 hover:bg-zinc-100"
    : "bg-slate-900 text-white hover:bg-slate-800";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || password.length < 8) {
      setError("Enter a valid email and at least 8 characters for password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = await loginWithPassword(email, password);
      login(token);
      setShowLoginModal(true);
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Unable to log in.");
      } else {
        setError("Unable to log in.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenterLayout>
      <div className={`rounded-2xl border p-8 backdrop-blur-md sm:p-10 ${card}`}>
        <p className={`text-center text-[10px] font-semibold uppercase tracking-[0.35em] ${eyebrow}`}>Account</p>
        <h1 className={`mt-3 text-center text-3xl font-bold uppercase tracking-tight ${title}`}>Log in</h1>
        <p className={`mt-2 text-center text-sm ${subtitle}`}>Use your email and password to continue.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div>
            <label htmlFor="login-email" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Email
            </label>
            <Input
              id="login-email"
              variant={inputVariant}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputLightClass}
            />
          </div>
          <div>
            <label htmlFor="login-password" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Password
            </label>
            <Input
              id="login-password"
              variant={inputVariant}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputLightClass}
            />
          </div>
          {error && <StateMessage kind="error" message={error} tone={isDark ? "dark" : "light"} />}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition disabled:cursor-not-allowed disabled:opacity-50 ${submit}`}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <Link
          to="/super-admin-login"
          className={`mt-6 block text-center text-[11px] font-semibold uppercase tracking-wider underline-offset-4 hover:underline ${linkMuted}`}
        >
          Super admin login
        </Link>
        <p className={`mt-8 text-center text-sm ${isDark ? "text-zinc-500" : "text-slate-500"}`}>
          New here?{" "}
          <Link to="/signup" className={`font-semibold underline-offset-4 hover:underline ${linkAccent}`}>
            Create account
          </Link>
        </p>
      </div>

      <Modal
        open={showLoginModal}
        title="Login successful"
        variant={isDark ? "dark" : "light"}
        onClose={() => {
          setShowLoginModal(false);
          navigate(redirectTo, { replace: true });
        }}
        actions={
          <Button
            className={isDark ? "bg-white! text-neutral-950! hover:bg-zinc-200!" : ""}
            onClick={() => {
              setShowLoginModal(false);
              navigate(redirectTo, { replace: true });
            }}
          >
            Continue
          </Button>
        }
      >
        Welcome back. You are now logged in.
      </Modal>
    </AuthCenterLayout>
  );
}
