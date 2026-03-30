import { Link } from "react-router-dom";
import { FiArrowLeft, FiInfo } from "react-icons/fi";
import Card from "../components/ui/Card";
import Icons8Image from "../components/guides/Icons8Image";
import { dietWeekHighlights } from "../data/dietPlans";
import { ICONS8_LINK, icons8DietHeaderCandidates, icons8DietMealCandidates } from "../utils/icons8";

export default function DietPage() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <FiArrowLeft /> Back to dashboard
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-1 shadow-sm">
            <Icons8Image candidates={icons8DietHeaderCandidates()} alt="" className="h-full w-full rounded-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Diet & nutrition ideas</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              A seven-day sample of meal themes to support your training—not a medical prescription. Adjust portions to your
              weight goal, and consult a professional for medical diets.
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900">
          <FiInfo className="mt-0.5 shrink-0" />
          <p>
            Tip: align higher carbs around workout days and keep protein steady across the week. Hydration and sleep matter as
            much as the plate.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dietWeekHighlights.map((meal, idx) => (
          <Card key={meal.day} className="flex flex-col overflow-hidden p-0">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-100 via-white to-lime-50 p-4">
              <div className="h-28 w-28 rounded-3xl border-4 border-white bg-white p-2 shadow-lg shadow-lime-900/5">
                <Icons8Image candidates={icons8DietMealCandidates(idx)} alt="" className="h-full w-full rounded-2xl" />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-lime-700">{meal.day}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{meal.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{meal.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {meal.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-auto pt-4 text-sm font-semibold text-slate-500">~{meal.calories} kcal (guide)</p>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-[11px] text-slate-400">
        <a href={ICONS8_LINK} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-600">
          Illustrations by Icons8
        </a>
      </p>
    </section>
  );
}
