import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiExternalLink, FiLayers, FiTarget } from "react-icons/fi";
import Button from "../components/ui/Button";
import LoadingBlocks from "../components/ui/LoadingBlocks";
import Modal from "../components/ui/Modal";
import Icons8Image from "../components/guides/Icons8Image";
import { useAuth } from "../features/auth/AuthContext";
import { getExerciseGuides, getMyPlans, getWorkoutLibrary } from "../services/workoutService";
import type { DayPlan, Exercise, PlanGuide, StoredPlan } from "../types";
import { ICONS8_EMPTY_SLUG, ICONS8_LINK, icons8DayCandidates, icons8ExerciseCandidates } from "../utils/icons8";

type DaySection = {
  day: string;
  focus: string;
  minutes: number;
  guides: PlanGuide[];
};

function buildDaySections(guides: PlanGuide[], schedule: DayPlan[] | undefined): DaySection[] {
  const byDay = new Map<string, PlanGuide[]>();
  for (const g of guides) {
    const list = byDay.get(g.day) ?? [];
    list.push(g);
    byDay.set(g.day, list);
  }

  if (schedule?.length) {
    return schedule
      .map((d) => ({
        day: d.day,
        focus: d.focus,
        minutes: d.estimatedDurationMinutes,
        guides: byDay.get(d.day) ?? [],
      }))
      .filter((s) => s.guides.length > 0);
  }

  return Array.from(byDay.entries()).map(([day, g]) => ({
    day,
    focus: "Training session",
    minutes: 0,
    guides: g,
  }));
}

const dayAccent = [
  "from-violet-500/15 to-fuchsia-500/10 border-violet-200/80",
  "from-sky-500/15 to-cyan-500/10 border-sky-200/80",
  "from-emerald-500/15 to-teal-500/10 border-emerald-200/80",
  "from-amber-500/15 to-orange-500/10 border-amber-200/80",
  "from-rose-500/15 to-pink-500/10 border-rose-200/80",
  "from-indigo-500/15 to-blue-500/10 border-indigo-200/80",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function WorkoutLibraryPage() {
  const { token } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [guides, setGuides] = useState<PlanGuide[]>([]);
  const [latestPlan, setLatestPlan] = useState<StoredPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<(PlanGuide & { matched?: Exercise }) | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getWorkoutLibrary(token), getExerciseGuides(token), getMyPlans(token)])
      .then(([libraryData, guideData, plans]) => {
        setExercises(libraryData);
        setGuides(guideData);
        setLatestPlan(plans[0] ?? null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const daySections = useMemo(
    () => buildDaySections(guides, latestPlan?.schedule),
    [guides, latestPlan?.schedule],
  );

  const planTitle = latestPlan?.title;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-indigo-100/90 via-white to-lime-50/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_rgba(15,23,42,0.08)] md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm">
              <FiLayers className="text-sm" />
              From your latest plan
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Exercise guides</h1>
            <p className="mt-2 text-slate-600">
              Movements grouped by training day, with Icons8 illustrations and quick cues. Tap a card for steps and demo
              links.
            </p>
            {planTitle && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiTarget className="text-indigo-600" />
                {planTitle}
              </p>
            )}
          </div>
          <div className="mx-auto shrink-0 md:mx-0">
            <div className="relative h-36 w-36 rounded-3xl border border-white/80 bg-white/90 p-2 shadow-lg shadow-indigo-900/10 md:h-40 md:w-40">
              <Icons8Image
                candidates={icons8DayCandidates()}
                alt=""
                className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-white"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[24px] bg-white/50 p-8">
          <LoadingBlocks />
        </div>
      ) : guides.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-10 text-center shadow-inner">
          <div className="mx-auto mb-4 h-28 w-28 rounded-3xl border border-white bg-gradient-to-br from-slate-50 to-slate-100 p-2 shadow-sm">
            <Icons8Image candidates={[ICONS8_EMPTY_SLUG, "gym", "dumbbell"]} alt="" className="h-full w-full rounded-2xl" />
          </div>
          <p className="text-lg font-semibold text-slate-800">No guides yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Generate a workout plan first. Your exercises will appear here, organized by day.
          </p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          {daySections.map((section, sectionIdx) => {
            const accent = dayAccent[sectionIdx % dayAccent.length];
            return (
              <motion.section
                key={section.day}
                variants={item}
                className={`rounded-[24px] border bg-gradient-to-br p-1 shadow-[0_12px_32px_rgba(15,23,42,0.06)] ${accent}`}
              >
                <div className="rounded-[22px] bg-white/95 p-5 backdrop-blur-sm md:p-6">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="hidden h-16 w-16 shrink-0 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-1 sm:block">
                        <Icons8Image
                          candidates={icons8DayCandidates()}
                          alt=""
                          className="h-full w-full rounded-xl"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{section.day}</h2>
                        <p className="mt-1 text-sm font-medium text-indigo-600">{section.focus}</p>
                        {section.minutes > 0 && (
                          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <FiClock />
                            ~{section.minutes} min session
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white">
                      {section.guides.length} exercise{section.guides.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <motion.ul
                    layout
                    className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {section.guides.map((guide) => {
                      const matched = exercises.find((exercise) => exercise.name === guide.name);
                      const candidates = icons8ExerciseCandidates(guide.name, matched?.muscleGroup);
                      return (
                        <motion.li key={`${section.day}-${guide.name}`} variants={item} layout>
                          <button
                            type="button"
                            onClick={() => setSelectedGuide({ ...guide, matched })}
                            className="group flex w-full gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 text-left shadow-sm transition hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-500/5"
                          >
                            <div className="h-24 w-24 shrink-0 rounded-2xl border border-white bg-gradient-to-br from-indigo-50/80 via-white to-lime-50/50 p-2 shadow-inner">
                              <Icons8Image candidates={candidates} alt="" className="h-full w-full rounded-xl" />
                            </div>
                            <div className="min-w-0 flex-1 py-0.5">
                              <p className="font-bold text-slate-900 group-hover:text-indigo-800">{guide.name}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {matched && (
                                  <>
                                    <span className="rounded-lg bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800">
                                      {matched.muscleGroup}
                                    </span>
                                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                      {matched.equipment}
                                    </span>
                                    <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 capitalize">
                                      {matched.difficulty}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{guide.instruction}</p>
                              <p className="mt-2 text-xs font-semibold text-slate-700">
                                {guide.sets} sets · {guide.reps} reps
                              </p>
                              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-indigo-600 opacity-80 group-hover:opacity-100">
                                Open guide →
                              </p>
                            </div>
                          </button>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      )}

      <p className="text-center text-[11px] text-slate-400">
        <a href={ICONS8_LINK} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-600">
          Illustrations by Icons8
        </a>
      </p>

      <Modal
        open={Boolean(selectedGuide)}
        title={selectedGuide ? selectedGuide.name : "Exercise Guide"}
        onClose={() => setSelectedGuide(null)}
        actions={<Button onClick={() => setSelectedGuide(null)}>Close</Button>}
      >
        {selectedGuide && (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="mx-auto h-32 w-32 shrink-0 rounded-2xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-white p-2 sm:mx-0">
                <Icons8Image
                  candidates={icons8ExerciseCandidates(selectedGuide.name, selectedGuide.matched?.muscleGroup)}
                  alt=""
                  className="h-full w-full rounded-xl"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">Day:</span> {selectedGuide.day}
                </p>
                {selectedGuide.matched && (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">
                      {selectedGuide.matched.muscleGroup}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {selectedGuide.matched.equipment}
                    </span>
                    <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold capitalize text-amber-900">
                      {selectedGuide.matched.difficulty}
                    </span>
                  </div>
                )}
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Sets/reps:</span> {selectedGuide.sets} sets ·{" "}
                  {selectedGuide.reps} reps
                </p>
                <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Coach cue:</span> {selectedGuide.instruction}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">Sample steps</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "Set your stance and brace your core before the first rep.",
                  "Move with control through a full comfortable range.",
                  "Exhale on the hardest part of the rep; avoid rushing the lowering phase.",
                  "Stop if you feel sharp pain and adjust load or technique.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${selectedGuide.name} exercise form tutorial`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500"
              >
                Watch demo videos <FiExternalLink />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
