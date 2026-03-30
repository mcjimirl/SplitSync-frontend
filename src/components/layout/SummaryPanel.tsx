import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { getAttendance, getMyPlans } from "../../services/workoutService";
import type { AttendanceItem, StoredPlan } from "../../types";

function initialsFromName(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) return avatarUrl;
  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
}

export default function SummaryPanel() {
  const { token, user } = useAuth();
  const [plans, setPlans] = useState<StoredPlan[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    getMyPlans(token)
      .then((planItems) => {
        setPlans(planItems);
        return planItems[0]?._id ? getAttendance(token, planItems[0]._id) : [];
      })
      .then((items) => setAttendance(items))
      .catch(() => {
        setPlans([]);
        setAttendance([]);
      });
  }, [token]);

  const adherence = useMemo(() => {
    if (attendance.length === 0) return 0;
    const attended = attendance.filter((item) => item.attended).length;
    return Math.round((attended / attendance.length) * 100);
  }, [attendance]);

  const recentDays = useMemo(() => {
    const map = attendance.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.date] = item.attended;
      return acc;
    }, {});
    return Array.from({ length: 12 }).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (11 - idx));
      const key = date.toISOString().slice(0, 10);
      return map[key] ?? false;
    });
  }, [attendance]);

  const latestPlan = plans[0];
  const attendedCount = attendance.filter((item) => item.attended).length;
  const shouldShowAvatar = Boolean(user?.avatarUrl) && !avatarLoadFailed;

  return (
    <aside className="rounded-[24px] bg-black p-4 text-white">
      <div className="rounded-2xl border border-white/20 p-4 text-center">
        {shouldShowAvatar ? (
          <img
            src={resolveAvatarUrl(user?.avatarUrl)}
            alt="Profile"
            onError={() => setAvatarLoadFailed(true)}
            className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-lime-300 object-cover"
          />
        ) : (
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border-2 border-lime-300 bg-zinc-900 text-2xl font-semibold">
            {initialsFromName(user?.name)}
          </div>
        )}
        <p className="text-xl font-semibold">{user?.name ?? "User"}</p>
        <p className="text-sm text-zinc-400">{user?.email ?? "Not signed in"}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{user?.role ?? "USER"}</p>
      </div>
      <div className="mt-4 rounded-2xl border border-white/15 p-4">
        <p className="text-sm text-zinc-300">Summary</p>
        <p className="mt-2 text-4xl font-bold text-lime-300">{adherence}%</p>
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          <p>Plans: {plans.length}</p>
          <p>Days/week: {latestPlan?.schedule.length ?? 0}</p>
          <p>Sessions done: {attendedCount}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-zinc-900 p-4">
        <p className="text-sm text-zinc-300">Recent activity flow</p>
        <div className="mt-3 grid grid-cols-12 gap-1">
          {recentDays.map((didAttend, i) => (
            <span key={i} className={`h-8 rounded-full ${didAttend ? "bg-lime-300/90" : "bg-zinc-700"}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}
