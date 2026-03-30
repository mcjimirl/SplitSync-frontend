import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiTarget, FiTrendingUp, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingBlocks from "../components/ui/LoadingBlocks";
import Icons8Image from "../components/guides/Icons8Image";
import { dietWeekHighlights } from "../data/dietPlans";
import { useAuth } from "../features/auth/AuthContext";
import { ICONS8_LINK, icons8DietMealCandidates } from "../utils/icons8";
import { getAttendance, getMyPlans } from "../services/workoutService";
import type { AttendanceItem, StoredPlan } from "../types";

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeekMonday(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<StoredPlan[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getMyPlans(token)
      .then(async (items) => {
        setPlans(items);
        const firstId = items[0]?._id;
        if (firstId) {
          const att = await getAttendance(token, firstId);
          setAttendance(att);
        } else {
          setAttendance([]);
        }
      })
      .catch(() => {
        setPlans([]);
        setAttendance([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const latest = plans[0];
  const adherence = useMemo(() => {
    if (attendance.length === 0) return 0;
    const ok = attendance.filter((a) => a.attended).length;
    return Math.round((ok / attendance.length) * 100);
  }, [attendance]);

  const weekBars = useMemo(() => {
    const map = attendance.reduce<Record<string, boolean>>((acc, a) => {
      acc[a.date] = a.attended;
      return acc;
    }, {});
    const start = startOfWeekMonday(new Date());
    return weekLabels.map((label, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = toDateKey(date);
      const raw = map[key];
      const attended: boolean | null = raw === undefined ? null : raw;
      const height = attended === true ? 88 : attended === false ? 28 : 12;
      return { label, height, attended };
    });
  }, [attendance]);

  const dietPreview = dietWeekHighlights.slice(0, 3);

  if (loading) {
    return (
      <div className="py-8">
        <LoadingBlocks />
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-lime-200/40 blur-2xl" />
            <div className="absolute -bottom-10 left-1/3 h-36 w-36 rounded-full bg-sky-200/35 blur-2xl" />
            <p className="text-sm font-medium text-slate-500">Welcome back</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Train smart. Eat well. Stay consistent.
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              Your dashboard brings workouts, attendance, and diet ideas
              together—similar to a health hub, tuned for SplitSync.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/app/generate">
                <Button>{latest ? "Update plan" : "Build your plan"}</Button>
              </Link>
              <Link to="/app/diet">
                <Button variant="neutral">View diet ideas</Button>
              </Link>
            </div>
          </Card>
        </div>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-6e shadow-lg shadow-blue-500/25">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative">
            <p className="text-sm font-medium ">Active program</p>
            <p className="mt-2 text-lg font-bold leading-snug">
              {latest?.title ?? "No plan yet"}
            </p>
            {latest && (
              <p className="mt-2 text-sm ">
                {latest.schedule.length} days/week · Goal: {latest.goal}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
              <div>
                <p className="text-xs ">Adherence</p>
                <p className="text-2xl font-bold">{adherence}%</p>
              </div>
              <Link
                to="/app/attendance"
                className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/30"
              >
                Track
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600">
            <FiZap className="text-xl" />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">Plans saved</p>
            <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
            <FiTrendingUp className="text-xl" />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">Attendance</p>
            <p className="text-2xl font-bold text-slate-900">{adherence}%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-600">
            <FiCalendar className="text-xl" />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">Days / week</p>
            <p className="text-2xl font-bold text-slate-900">
              {latest?.schedule.length ?? "—"}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
            <FiTarget className="text-xl" />
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">Goal</p>
            <p className="truncate text-lg font-bold capitalize text-slate-900">
              {latest?.goal ?? "Set in plan"}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Your activity
            </h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              This week
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Marked attendance height shows training days.
          </p>
          <div className="mt-6 flex h-40 items-end justify-between gap-2 border-b border-slate-200/80 pb-1">
            {weekBars.map((b) => (
              <div
                key={b.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`w-full max-w-[2.5rem] rounded-t-lg transition ${
                    b.attended === true
                      ? "bg-gradient-to-t from-emerald-500 to-lime-400"
                      : b.attended === false
                        ? "bg-rose-200"
                        : "bg-slate-200"
                  }`}
                  style={{ height: `${b.height}%` }}
                />
                <span className="text-[10px] font-medium text-slate-500">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900">Overview</h3>
          <p className="mt-1 text-sm text-slate-500">
            Quick split of your training focus.
          </p>
          <div className="relative mx-auto mt-6 h-36 w-36">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(rgb(52 211 153) 0% ${adherence}%, rgb(226 232 240) ${adherence}% 100%)`,
              }}
            />
            <div className="absolute inset-4 rounded-full bg-[#eff2f7] shadow-inner flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-slate-900">
                {adherence}%
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                on track
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex justify-between">
              <span>Plans</span>
              <span className="font-semibold text-slate-900">
                {plans.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Logged days</span>
              <span className="font-semibold text-slate-900">
                {attendance.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Exercises (latest)</span>
              <span className="font-semibold text-slate-900">
                {latest
                  ? latest.schedule.reduce((n, d) => n + d.exercises.length, 0)
                  : "—"}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Recommended meals
            </h3>
            <p className="text-sm text-slate-500">
              Sample diet ideas by day—pair with your training goal.
            </p>
          </div>
          <Link
            to="/app/diet"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            See full week <FiArrowRight />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {dietPreview.map((meal, idx) => (
            <Card key={meal.day} className="overflow-hidden p-0">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-lime-100 to-emerald-50 p-3">
                <div className="h-20 w-20 rounded-2xl border border-white/80 bg-white/90 p-1 shadow-sm">
                  <Icons8Image candidates={icons8DietMealCandidates(idx)} alt="" className="h-full w-full rounded-xl" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-lime-700">
                  {meal.day}
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {meal.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">{meal.subtitle}</p>
                <p className="mt-2 text-xs text-slate-400">
                  ~{meal.calories} kcal suggested
                </p>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          <a href={ICONS8_LINK} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-slate-600">
            Illustrations by Icons8
          </a>
        </p>
      </div>
    </section>
  );
}
