import { useState } from "react";
import { isAxiosError } from "axios";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { signupWithPassword } from "../services/authService";

export default function SignupPage() {
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
    <div className="mx-auto mt-8 max-w-md px-4 md:mt-16">
      <form onSubmit={handleSubmit} className="clay-card space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input placeholder="Surname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <StateMessage kind="error" message={error} />}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-800 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
