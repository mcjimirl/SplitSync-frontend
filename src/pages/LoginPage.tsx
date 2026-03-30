import type { FormEvent } from "react";
import { useState } from "react";
import { isAxiosError } from "axios";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { loginWithPassword } from "../services/authService";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("athlete@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ??
    "/app";

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
    <div className="mx-auto mt-8 max-w-md px-4 md:mt-16">
      <form onSubmit={handleSubmit} className="clay-card space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <StateMessage kind="error" message={error} />}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </Button>
        <Link to="/super-admin-login" className="block text-center text-sm font-semibold text-slate-800 underline">
          Super Admin Login
        </Link>
        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-slate-800 underline">
            Create account
          </Link>
        </p>
      </form>
      <Modal
        open={showLoginModal}
        title="Login Successful"
        onClose={() => {
          setShowLoginModal(false);
          navigate(redirectTo, { replace: true });
        }}
        actions={
          <Button
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
    </div>
  );
}
