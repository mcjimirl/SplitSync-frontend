import { useState } from "react";
import { isAxiosError } from "axios";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import StateMessage from "../components/ui/StateMessage";
import AuthCenterLayout from "../components/marketing/AuthCenterLayout";
import { useAuth } from "../features/auth/AuthContext";
import { useTheme } from "../features/theme/ThemeContext";
import { signupWithPassword } from "../services/authService";

const SIGNUP_BACKDROP =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80";

export default function SignupPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo ?? "/app/profile";

  const card = isDark
    ? "border-white/10 bg-zinc-950/70"
    : "border-slate-200/90 bg-white/95 shadow-xl shadow-slate-900/10";
  const eyebrow = isDark ? "text-white/45" : "text-slate-500";
  const title = isDark ? "text-white" : "text-slate-900";
  const subtitle = isDark ? "text-zinc-400" : "text-slate-600";
  const label = isDark ? "text-zinc-500" : "text-slate-500";
  const linkMuted = isDark ? "text-zinc-500" : "text-slate-500";
  const linkAccent = isDark ? "text-white" : "text-slate-900";
  const inputVariant = isDark ? "dark" : "default";
  const inputClass = isDark ? "mt-2" : "mt-2 border border-slate-200 bg-white !text-slate-900";
  const submit = isDark
    ? "bg-white text-neutral-950 hover:bg-zinc-100"
    : "bg-slate-900 text-white hover:bg-slate-800";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName || !lastName || !email || password.length < 8) {
      setError("Provide first name, surname, valid email, and password with at least 8 characters.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = await signupWithPassword(firstName, lastName, email, password);
      login(token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Signup failed.");
      } else {
        setError("Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenterLayout backdropImage={SIGNUP_BACKDROP}>
      <div className={`rounded-2xl border p-8 backdrop-blur-md sm:p-10 ${card}`}>
        <p className={`text-center text-[10px] font-semibold uppercase tracking-[0.35em] ${eyebrow}`}>Join</p>
        <h1 className={`mt-3 text-center text-3xl font-bold uppercase tracking-tight ${title}`}>Sign up</h1>
        <p className={`mt-2 text-center text-sm ${subtitle}`}>Start building splits tailored to you.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label htmlFor="su-first" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
                First name
              </label>
              <Input
                id="su-first"
                variant={inputVariant}
                placeholder="First name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="su-last" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
                Surname
              </label>
              <Input
                id="su-last"
                variant={inputVariant}
                placeholder="Surname"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="su-email" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Email
            </label>
            <Input
              id="su-email"
              variant={inputVariant}
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="su-pass" className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${label}`}>
              Password
            </label>
            <Input
              id="su-pass"
              variant={inputVariant}
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <StateMessage kind="error" message={error} tone={isDark ? "dark" : "light"} />}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition disabled:cursor-not-allowed disabled:opacity-50 ${submit}`}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${linkMuted}`}>
          Already have an account?{" "}
          <Link to="/login" className={`font-semibold underline-offset-4 hover:underline ${linkAccent}`}>
            Log in
          </Link>
        </p>
      </div>
    </AuthCenterLayout>
  );
}
