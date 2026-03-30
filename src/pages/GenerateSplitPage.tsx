import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { generateSplit, getMyPlans } from "../services/workoutService";
import type { SplitRequest, WeeklyPlan } from "../types";

const initialPayload: SplitRequest = {
  age: 25,
  sex: "male",
  heightCm: 170,
  weightKg: 70,
  goal: "hypertrophy",
  activityLevel: "moderately_active",
  injuries: "None",
  medicalNotes: "No restrictions",
  equipmentAccess: "full_gym",
  sessionDurationMinutes: 60,
  daysPerWeek: 4,
  planDurationWeeks: 4,
};

export default function GenerateSplitPage() {
  const { token, user } = useAuth();
  const [payload, setPayload] = useState<SplitRequest>(initialPayload);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [daysError, setDaysError] = useState<string | null>(null);
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [existingPlansCount, setExistingPlansCount] = useState(0);

  useEffect(() => {
    if (!user || prefilledFromProfile) return;
    setPayload((prev) => ({
      ...prev,
      age: user.age ?? prev.age,
      sex: user.sex ?? prev.sex,
      heightCm: user.heightCm ?? prev.heightCm,
      weightKg: user.weightKg ?? prev.weightKg,
    }));
    setPrefilledFromProfile(true);
  }, [user, prefilledFromProfile]);

  useEffect(() => {
    if (!token) return;
    getMyPlans(token)
      .then((plans) => setExistingPlansCount(plans.length))
      .catch(() => setExistingPlansCount(0));
  }, [token, plan]);

  async function executeGeneration(replaceExisting: boolean) {
    if (!token) {
      setError("Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const generated = await generateSplit(token, payload, {
        replaceExisting,
      });
      setPlan(generated);
      setSuccess("Plan generated successfully.");
      setShowGeneratedModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate plan.");
    } finally {
      setLoading(false);
      setShowReplaceModal(false);
    }
  }

  async function handleGenerate() {
    setSuccess(null);
    setError(null);
    setDaysError(null);
    if (!token) {
      setError("Please log in again.");
      return;
    }
    if (payload.daysPerWeek < 2 || payload.daysPerWeek > 7) {
      setDaysError("Days per week must be between 2 and 7.");
      return;
    }
    if (payload.planDurationWeeks < 4) {
      setError("Plan duration must be at least 4 weeks.");
      return;
    }
    if (existingPlansCount > 0) {
      setShowReplaceModal(true);
      return;
    }
    await executeGeneration(false);
  }

  return (
    <section className="grid gap-4 text-slate-900 dark:text-zinc-100 xl:grid-cols-2">
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">Body Profile Form</h1>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Age
          <Input
            type="number"
            className="mt-1"
            value={payload.age}
            onChange={(e) =>
              setPayload((p) => ({ ...p, age: Number(e.target.value) }))
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Sex
          <Select
            className="mt-1"
            value={payload.sex}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                sex: e.target.value as SplitRequest["sex"],
              }))
            }
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
            Height (cm)
            <Input
              type="number"
              className="mt-1"
              value={payload.heightCm}
              onChange={(e) =>
                setPayload((p) => ({ ...p, heightCm: Number(e.target.value) }))
              }
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
            Weight (kg)
            <Input
              type="number"
              className="mt-1"
              value={payload.weightKg}
              onChange={(e) =>
                setPayload((p) => ({ ...p, weightKg: Number(e.target.value) }))
              }
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Goal
          <Select
            className="mt-1"
            value={payload.goal}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                goal: e.target.value as SplitRequest["goal"],
              }))
            }
          >
            <option value="strength">Strength</option>
            <option value="hypertrophy">Hypertrophy</option>
            <option value="fat_loss">Fat Loss</option>
          </Select>
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Activity Level
          <Select
            className="mt-1"
            value={payload.activityLevel}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                activityLevel: e.target.value as SplitRequest["activityLevel"],
              }))
            }
          >
            <option value="sedentary">Sedentary</option>
            <option value="lightly_active">Lightly Active</option>
            <option value="moderately_active">Moderately Active</option>
            <option value="very_active">Very Active</option>
          </Select>
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Available Equipment
          <Select
            className="mt-1"
            value={payload.equipmentAccess}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                equipmentAccess: e.target
                  .value as SplitRequest["equipmentAccess"],
              }))
            }
          >
            <option value="full_gym">Full Gym</option>
            <option value="dumbbells_only">Dumbbells Only</option>
            <option value="machines_only">Machines Only</option>
            <option value="bodyweight_only">Bodyweight Only</option>
          </Select>
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Session Duration (minutes)
          <Input
            type="number"
            className="mt-1"
            value={payload.sessionDurationMinutes}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                sessionDurationMinutes: Number(e.target.value),
              }))
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Injuries / Limitations
          <Input
            className="mt-1"
            value={payload.injuries}
            onChange={(e) =>
              setPayload((p) => ({ ...p, injuries: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Medical Notes
          <Input
            className="mt-1"
            value={payload.medicalNotes}
            onChange={(e) =>
              setPayload((p) => ({ ...p, medicalNotes: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Days Per Week
          <Input
            type="number"
            min={2}
            max={7}
            className="mt-1"
            value={payload.daysPerWeek}
            onChange={(e) =>
              setPayload((p) => ({ ...p, daysPerWeek: Number(e.target.value) }))
            }
            error={daysError}
          />
        </label>
        <label className="block text-sm font-medium text-slate-800 dark:text-zinc-200">
          Program Duration (weeks)
          <Select
            className="mt-1"
            value={payload.planDurationWeeks}
            onChange={(e) =>
              setPayload((p) => ({
                ...p,
                planDurationWeeks: Number(e.target.value),
              }))
            }
          >
            <option value={4}>4 weeks (1 month)</option>
            <option value={8}>8 weeks</option>
            <option value={12}>12 weeks</option>
          </Select>
        </label>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Personalized Plan"}
        </Button>
        {success && <StateMessage kind="success" message={success} />}
        {error && <StateMessage kind="error" message={error} />}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">
          {plan ? plan.title : "Your personalized weekly plan"}
        </h2>
        {!plan ? (
          <div className="mt-4">
            <EmptyState
              title="No plan yet"
              description="Complete your body profile and generate a workout plan."
            />
          </div>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-3"
          >
            {plan.schedule.map((item) => (
              <motion.li
                key={item.day}
                whileHover={{ x: 2 }}
                className="rounded-xl border border-slate-200/90 bg-white/90 p-3 dark:border-white/10 dark:bg-white/5"
              >
                <p className="font-semibold text-slate-900 dark:text-zinc-100">{item.day}</p>
                <p className="text-sm text-slate-800 dark:text-zinc-300">
                  {item.focus} - {item.estimatedDurationMinutes} min
                </p>
                <ul className="mt-2 space-y-1">
                  {item.exercises.map((exercise) => (
                    <li
                      key={`${item.day}-${exercise.name}`}
                      className="text-xs text-slate-700 dark:text-zinc-400"
                    >
                      {exercise.name} ({exercise.sets}x{exercise.reps}) -{" "}
                      {exercise.instruction}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
        )}
        {plan && (
          <div className="mt-4 rounded-xl border border-slate-200/90 bg-white/90 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Program timeline ({plan.planDurationWeeks} weeks)
            </p>
            <ul className="mt-2 space-y-1">
              {plan.weeklyBlocks.map((block) => (
                <li key={block.week} className="text-xs text-slate-700 dark:text-zinc-400">
                  Week {block.week}: {block.focus} - {block.notes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <Modal
        open={showGeneratedModal}
        title="Plan Generated"
        onClose={() => setShowGeneratedModal(false)}
        actions={
          <Button onClick={() => setShowGeneratedModal(false)}>Great</Button>
        }
      >
        Your personalized workout plan has been created and saved.
      </Modal>
      <Modal
        open={showReplaceModal}
        title="You already have an existing plan"
        onClose={() => setShowReplaceModal(false)}
        actions={
          <>
            <Button
              variant="neutral"
              onClick={() => void executeGeneration(false)}
            >
              Keep old and create new
            </Button>
            <Button onClick={() => void executeGeneration(true)}>
              Replace old plan
            </Button>
          </>
        }
      >
        You can create another plan, or replace your previous saved plans with
        this new one.
      </Modal>
    </section>
  );
}
