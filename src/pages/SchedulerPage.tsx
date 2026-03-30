import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
  FiTarget,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import LoadingBlocks from "../components/ui/LoadingBlocks";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { deleteAttendance, getAttendance, getMyPlans, markAttendance } from "../services/workoutService";
import type { AttendanceItem, StoredPlan } from "../types";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Local calendar date as YYYY-MM-DD (avoids UTC drift from toISOString). */
function toDateKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKeyLocal(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Week starting Sunday, matching the calendar grid. */
function startOfWeekSunday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  return x;
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

function computeStreak(attendanceMap: Record<string, AttendanceItem>, todayKey: string): number {
  let d = parseDateKeyLocal(todayKey);
  if (!attendanceMap[todayKey]?.attended) {
    d = addDays(d, -1);
  }
  let streak = 0;
  for (let i = 0; i < 400; i += 1) {
    const key = toDateKeyLocal(d);
    const item = attendanceMap[key];
    if (item?.attended === true) {
      streak += 1;
      d = addDays(d, -1);
    } else {
      break;
    }
  }
  return streak;
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
  const [selectedDate, setSelectedDate] = useState(() => toDateKeyLocal(new Date()));
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const todayKey = toDateKeyLocal(new Date());

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

  useEffect(() => {
    setNoteDraft(selectedAttendance?.note?.trim() ? selectedAttendance.note : "");
  }, [selectedDate, selectedAttendance?._id, selectedAttendance?.note]);

  const monthStats = useMemo(() => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let attended = 0;
    let missed = 0;
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = toDateKeyLocal(new Date(y, m, day));
      const item = attendanceMap[key];
      if (item?.attended === true) attended += 1;
      else if (item?.attended === false) missed += 1;
    }
    const totalMarked = attended + missed;
    const adherence = totalMarked > 0 ? Math.round((attended / totalMarked) * 100) : null;
    return { attended, missed, totalMarked, adherence, daysInMonth };
  }, [monthCursor, attendanceMap]);

  const streak = useMemo(() => computeStreak(attendanceMap, todayKey), [attendanceMap, todayKey]);

  const weekAroundSelected = useMemo(() => {
    const start = startOfWeekSunday(parseDateKeyLocal(selectedDate));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    const now = new Date();
    setMonthCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(toDateKeyLocal(now));
  }, []);

  async function handleMark(date: string, attended: boolean) {
    if (!token || !selectedPlanId) return;
    const note = noteDraft.trim() || undefined;
    const result = await markAttendance(token, {
      planId: selectedPlanId,
      date,
      attended,
      note,
    });
    setAttendance((prev) => [...prev.filter((item) => item.date !== date), result]);
    setMessage(`Saved ${date}: ${attended ? "attended" : "missed"}.`);
  }

  async function handleClearDay() {
    if (!token || !selectedPlanId || !selectedAttendance) return;
    try {
      await deleteAttendance(token, selectedPlanId, selectedDate);
      setAttendance((prev) => prev.filter((item) => item.date !== selectedDate));
      setNoteDraft("");
      setMessage(`Cleared mark for ${selectedDate}.`);
    } catch {
      setMessage("Could not clear that day.");
    }
  }

  async function handleSaveNoteOnly() {
    if (!token || !selectedPlanId || !selectedAttendance) {
      setMessage("Mark this day first, then you can add a note.");
      return;
    }
    const trimmed = noteDraft.slice(0, 200);
    setSavingNote(true);
    try {
      const result = await markAttendance(token, {
        planId: selectedPlanId,
        date: selectedDate,
        attended: selectedAttendance.attended,
        note: trimmed,
      });
      setAttendance((prev) => [...prev.filter((item) => item.date !== selectedDate), result]);
      setMessage("Note saved.");
    } finally {
      setSavingNote(false);
    }
  }

  const monthLabel = monthCursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const monthShort = monthCursor.toLocaleString(undefined, { month: "short" });

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <FiCalendar className="h-5 w-5 shrink-0" aria-hidden />
            <p className="text-sm font-medium">Schedule &amp; attendance</p>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Attendance tracker</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">
            Tap a day to review or update. Marks use your local calendar date.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingBlocks />
        </div>
      ) : plans.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No generated plans yet"
            description="Generate a workout plan first to start tracking attendance."
          />
        </div>
      ) : (
        <>
          <label className="mt-6 block text-sm font-medium text-slate-800">
            Plan
            <select
              className="mt-2 h-11 w-full max-w-md rounded-xl border border-slate-200/80 bg-white/90 px-3 text-sm shadow-sm outline-none ring-indigo-500/0 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/15"
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
            <div className="mt-4">
              <StateMessage kind="success" message={message} />
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white px-4 py-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                <FiCheck className="h-3.5 w-3.5" aria-hidden />
                Attended ({monthShort})
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{monthStats.attended}</p>
            </div>
            <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-white px-4 py-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-700">
                <FiX className="h-3.5 w-3.5" aria-hidden />
                Missed
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{monthStats.missed}</p>
            </div>
            <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-white px-4 py-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <FiTarget className="h-3.5 w-3.5" aria-hidden />
                Hit rate
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                {monthStats.adherence !== null ? `${monthStats.adherence}%` : "—"}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">Of days marked this month</p>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white px-4 py-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <FiTrendingUp className="h-3.5 w-3.5" aria-hidden />
                Streak
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{streak}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Consecutive attended days</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-inner">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/90"
                onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                <FiChevronLeft className="h-4 w-4" aria-hidden />
                Prev
              </button>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <p className="min-w-[10rem] text-center text-base font-semibold text-slate-900">{monthLabel}</p>
                <button
                  type="button"
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100"
                  onClick={goToToday}
                >
                  Today
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/90"
                onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                Next
                <FiChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                Attended
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" aria-hidden />
                Missed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-white" aria-hidden />
                Not marked
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full ring-2 ring-indigo-400 ring-offset-1" aria-hidden />
                Selected
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${monthCursor.getFullYear()}-${monthCursor.getMonth()}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-7 gap-1.5 sm:gap-2"
              >
                {weekDays.map((day) => (
                  <p key={day} className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                    {day}
                  </p>
                ))}
                {calendarCells.map(({ date, inCurrentMonth }) => {
                  const dateKey = toDateKeyLocal(date);
                  const item = attendanceMap[dateKey];
                  const selected = selectedDate === dateKey;
                  const isToday = dateKey === todayKey;
                  let statusClass = "border-slate-200/90 bg-white/90";
                  if (item?.attended === true) statusClass = "border-emerald-300/90 bg-emerald-50/90";
                  else if (item?.attended === false) statusClass = "border-rose-300/90 bg-rose-50/90";

                  return (
                    <button
                      type="button"
                      key={`${dateKey}-${inCurrentMonth}`}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`relative min-h-[72px] rounded-xl border p-2 text-left transition hover:brightness-[1.02] sm:min-h-[76px] ${statusClass} ${selected ? "ring-2 ring-indigo-400 ring-offset-1" : ""} ${inCurrentMonth ? "opacity-100" : "opacity-40"}`}
                    >
                      {isToday && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" title="Today" />
                      )}
                      <p className="text-sm font-semibold text-slate-800">{date.getDate()}</p>
                      <div className="mt-1 flex items-center gap-1">
                        {item?.attended === true && <FiCheck className="h-3.5 w-3.5 text-emerald-600" aria-label="Attended" />}
                        {item?.attended === false && <FiX className="h-3.5 w-3.5 text-rose-600" aria-label="Missed" />}
                        <p className="text-[10px] font-medium leading-tight text-slate-600 sm:text-[11px]">
                          {!item ? "—" : item.attended ? "Done" : "Missed"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Week of selected day</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekAroundSelected.map((d) => {
                const key = toDateKeyLocal(d);
                const item = attendanceMap[key];
                const sel = key === selectedDate;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => {
                      setSelectedDate(key);
                      setMonthCursor(new Date(d.getFullYear(), d.getMonth(), 1));
                    }}
                    className={`flex min-w-[2.75rem] flex-col items-center rounded-xl border px-2 py-1.5 text-center text-xs transition ${
                      sel ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className="text-[10px] font-medium text-slate-500">{weekDays[d.getDay()]}</span>
                    <span className="font-semibold text-slate-900">{d.getDate()}</span>
                    <span
                      className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                        item?.attended === true
                          ? "bg-emerald-500"
                          : item?.attended === false
                            ? "bg-rose-500"
                            : "bg-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedDate}</p>
                <p className="mt-0.5 text-sm text-slate-600">
                  {selectedDate === todayKey ? "Today · " : ""}
                  Status:{" "}
                  <span className="font-medium text-slate-800">
                    {!selectedAttendance ? "Not marked" : selectedAttendance.attended ? "Attended" : "Missed"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                onClick={() => void handleMark(selectedDate, true)}
              >
                <FiCheck className="h-4 w-4" aria-hidden />
                Attended
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                onClick={() => void handleMark(selectedDate, false)}
              >
                <FiX className="h-4 w-4" aria-hidden />
                Missed
              </button>
              {selectedAttendance && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => void handleClearDay()}
                >
                  <FiRotateCcw className="h-4 w-4" aria-hidden />
                  Clear day
                </button>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="attendance-note" className="text-sm font-medium text-slate-800">
                Note (optional, max 200 characters)
              </label>
              <textarea
                id="attendance-note"
                rows={3}
                maxLength={200}
                placeholder={selectedAttendance ? "Session details, how it felt…" : "Mark attendance first to attach a note."}
                disabled={!selectedAttendance}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/0 transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:bg-slate-100"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[11px] text-slate-500">{noteDraft.length}/200</p>
                <button
                  type="button"
                  disabled={!selectedAttendance || savingNote}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
                  onClick={() => void handleSaveNoteOnly()}
                >
                  {savingNote ? "Saving…" : "Save note"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
