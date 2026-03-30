import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { loginWithPassword } from "../services/authService";

export default function SuperAdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="mx-auto mt-8 max-w-md px-4 md:mt-16">
      <form onSubmit={handleSubmit} className="clay-card space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Super Admin Login</h1>
        <p className="text-sm text-slate-500">Use your super admin email and password.</p>
        <Input type="email" placeholder="Super admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <StateMessage kind="error" message={error} />}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Continue as Super Admin"}
        </Button>
        <p className="text-sm text-slate-500">
          Back to{" "}
          <Link to="/login" className="font-semibold text-slate-800 underline">
            normal login
          </Link>
        </p>
      </form>
    </div>
  );
}
