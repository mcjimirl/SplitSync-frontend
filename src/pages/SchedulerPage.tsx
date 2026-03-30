import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import LoadingBlocks from "../components/ui/LoadingBlocks";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { getAttendance, getMyPlans, markAttendance } from "../services/workoutService";
import type { AttendanceItem, StoredPlan } from "../types";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getCalendarCells(monthCursor: Date) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ date: Date; inCurrentMonth: boolean }> = [];

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const date = new Date(year, month, -i);
    cells.push({ date, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const nextIndex = cells.length - (startWeekday + daysInMonth) + 1;
    const date = new Date(year, month + 1, nextIndex);
    cells.push({ date, inCurrentMonth: false });
  }

  return cells;
}

export default function SchedulerPage() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<StoredPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));

  useEffect(() => {
    if (!token) return;
    getMyPlans(token)
      .then((items) => {
        setPlans(items);
        const first = items[0]?._id ?? "";
        setSelectedPlanId(first);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedPlanId) return;
    getAttendance(token, selectedPlanId).then(setAttendance);
  }, [token, selectedPlanId]);

  const attendanceMap = useMemo(
    () =>
      attendance.reduce<Record<string, AttendanceItem>>((acc, item) => {
        acc[item.date] = item;
        return acc;
      }, {}),
    [attendance],
  );
  const calendarCells = useMemo(() => getCalendarCells(monthCursor), [monthCursor]);
  const selectedAttendance = attendanceMap[selectedDate];

  async function handleMark(date: string, attended: boolean) {
    if (!token || !selectedPlanId) return;
    const result = await markAttendance(token, { planId: selectedPlanId, date, attended });
    setAttendance((prev) => [...prev.filter((item) => item.date !== date), result]);
    setMessage(`Marked ${date} as ${attended ? "attended" : "missed"}.`);
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-slate-900">Attendance Tracker</h1>
      {loading ? (
        <div className="mt-4">
          <LoadingBlocks />
        </div>
      ) : plans.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No generated plans yet" description="Generate a workout plan first to start tracking attendance." />
        </div>
      ) : (
        <>
          <label className="mt-3 block text-sm font-medium">
            Select Plan
            <select
              className="mt-1 h-10 w-full rounded-xl border border-transparent bg-white/80 px-3 text-sm outline-none"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.title}
                </option>
              ))}
            </select>
          </label>
          {message && (
            <div className="mt-3">
              <StateMessage kind="success" message={message} />
            </div>
          )}
          <div className="mt-4 rounded-xl bg-white/70 p-3">
            <div className="mb-3 flex items-center justify-between">
              <button
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
                onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                <span className="inline-flex items-center gap-1">
                  <FiChevronLeft />
                  Prev
                </span>
              </button>
              <p className="font-semibold text-slate-900">
                {monthCursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </p>
              <button
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
                onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                <span className="inline-flex items-center gap-1">
                  Next
                  <FiChevronRight />
                </span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <p key={day} className="text-center text-xs font-semibold text-slate-500">
                  {day}
                </p>
              ))}
              {calendarCells.map(({ date, inCurrentMonth }) => {
                const dateKey = toDateKey(date);
                const item = attendanceMap[dateKey];
                const selected = selectedDate === dateKey;
                const statusClass = item ? (item.attended ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-transparent bg-white";

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`min-h-[70px] rounded-lg border p-2 text-left transition ${statusClass} ${selected ? "ring-2 ring-indigo-400" : ""} ${inCurrentMonth ? "opacity-100" : "opacity-45"}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{date.getDate()}</p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {item ? (item.attended ? "Attended" : "Missed") : "Not marked"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-white/80 p-3">
            <p className="font-semibold text-slate-900">Selected Date: {selectedDate}</p>
            <p className="mt-1 text-sm text-slate-600">
              Status: {selectedAttendance ? (selectedAttendance.attended ? "Attended" : "Missed") : "Not marked"}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                onClick={() => void handleMark(selectedDate, true)}
              >
                Mark Attended
              </button>
              <button
                className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                onClick={() => void handleMark(selectedDate, false)}
              >
                Mark Missed
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
