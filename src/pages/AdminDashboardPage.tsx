import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import LoadingBlocks from "../components/ui/LoadingBlocks";
import { useAuth } from "../features/auth/AuthContext";
import { getAllPlans, getAllUsers } from "../services/workoutService";
import type { StoredPlan } from "../types";

type AdminUser = { _id: string; name: string; email: string; role: string };

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<StoredPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAllUsers(token), getAllPlans(token)])
      .then(([usersData, plansData]) => {
        setUsers(usersData);
        setPlans(plansData);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <section className="space-y-4">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Super Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">View all user profiles and monitor their generated workout plans.</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
        {loading ? (
          <div className="mt-4">
            <LoadingBlocks />
          </div>
        ) : users.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No users found" description="Users will appear here once they register." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {users.map((user) => (
              <li key={user._id} className="rounded-xl bg-white/80 p-3">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-600">
                  {user.email} - {user.role}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">All Workout Plans</h2>
        {loading ? (
          <div className="mt-4">
            <LoadingBlocks />
          </div>
        ) : plans.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No plans yet" description="Generated user plans will be listed here." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {plans.map((plan) => (
              <li key={plan._id} className="rounded-xl bg-white/80 p-3">
                <p className="font-semibold">{plan.title}</p>
                <p className="text-sm text-slate-600">
                  {plan.userName} ({plan.userEmail}) - {plan.goal}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
