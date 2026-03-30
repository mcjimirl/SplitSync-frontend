import { isAxiosError } from "axios";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FiCamera, FiLayers, FiMail, FiUser } from "react-icons/fi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { updateMe, uploadMyAvatar } from "../services/authService";
import { getMyPlans } from "../services/workoutService";
import type { StoredPlan, TrainingGoal } from "../types";

const GOAL_LABEL: Record<TrainingGoal, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  fat_loss: "Fat loss",
};

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) return avatarUrl;
  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
}

function initialsFromName(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-slate-900 dark:text-zinc-200">{children}</span>;
}

export default function ProfilePage() {
  const { logout, user, token, refresh } = useAuth();
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<number | null | undefined>(undefined);
  const [heightCm, setHeightCm] = useState<number | null | undefined>(undefined);
  const [weightKg, setWeightKg] = useState<number | null | undefined>(undefined);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<StoredPlan[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const effectiveFirstName = firstName ?? user?.firstName ?? "";
  const effectiveLastName = lastName ?? user?.lastName ?? "";
  const effectiveAge = age ?? user?.age ?? null;
  const effectiveHeightCm = heightCm ?? user?.heightCm ?? null;
  const effectiveWeightKg = weightKg ?? user?.weightKg ?? null;
  const composedName = useMemo(
    () => `${effectiveFirstName} ${effectiveLastName}`.trim() || user?.name || "",
    [effectiveFirstName, effectiveLastName, user?.name],
  );

  useEffect(() => {
    if (!token) return;
    getMyPlans(token)
      .then(setPlans)
      .catch(() => setPlans([]));
  }, [token]);

  async function handleSave() {
    if (!token) return;
    setMessage(null);
    setError(null);
    try {
      await updateMe(token, {
        name: composedName,
        firstName: effectiveFirstName,
        lastName: effectiveLastName,
        age: effectiveAge,
        heightCm: effectiveHeightCm,
        weightKg: effectiveWeightKg,
      });
      if (selectedAvatarFile) {
        await uploadMyAvatar(token, selectedAvatarFile);
        setSelectedAvatarFile(null);
      }
      await refresh();
      setMessage("Profile updated.");
      setShowSavedModal(true);
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Failed to update profile.");
      } else {
        setError("Failed to update profile.");
      }
    }
  }

  return (
    <section className="space-y-6 text-slate-900 dark:text-zinc-100">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <FiUser className="h-5 w-5" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Account</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-zinc-400">
          Your name, photo, and metrics are used when generating plans and tracking attendance. Keep them up to date.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200/80 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-violet-500/[0.05] px-6 pb-6 pt-6 dark:border-white/10">
            <div className="relative mx-auto w-fit">
              <div className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 p-[3px] shadow-lg shadow-indigo-500/20 dark:from-indigo-400 dark:to-violet-500">
                <div className="rounded-full bg-white p-[2px] dark:bg-zinc-900">
                  {selectedAvatarFile ? (
                    <img
                      src={URL.createObjectURL(selectedAvatarFile)}
                      alt=""
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : user?.avatarUrl && !avatarLoadFailed ? (
                    <img
                      src={resolveAvatarUrl(user.avatarUrl)}
                      alt=""
                      onError={() => setAvatarLoadFailed(true)}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-3xl font-semibold text-white">
                      {initialsFromName(composedName || user?.name)}
                    </div>
                  )}
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md transition hover:bg-slate-800 dark:border-zinc-900 dark:bg-white dark:text-neutral-950 dark:hover:bg-zinc-200"
                aria-label="Upload profile photo"
              >
                <FiCamera className="h-5 w-5" />
              </label>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAvatarLoadFailed(false);
                setSelectedAvatarFile(e.target.files?.[0] ?? null);
              }}
              className="hidden"
            />
            <p className="mt-4 text-center text-lg font-semibold text-slate-900 dark:text-zinc-50">
              {composedName || "Your name"}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-zinc-500">
              <FiMail className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{user?.email ?? "—"}</span>
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-center text-xs text-slate-600 dark:text-zinc-500">
              {selectedAvatarFile ? (
                <span className="font-medium text-indigo-600 dark:text-indigo-400">New photo selected — save to apply.</span>
              ) : (
                "JPG or PNG, up to 5MB."
              )}
            </p>
          </div>
        </Card>

        <Card className="space-y-6 p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">Personal details</h2>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-500">Used for plan generation and display.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <FieldLabel>First name</FieldLabel>
              <Input className="mt-1.5" value={effectiveFirstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className="block">
              <FieldLabel>Surname</FieldLabel>
              <Input className="mt-1.5" value={effectiveLastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label className="block">
              <FieldLabel>Age</FieldLabel>
              <Input
                className="mt-1.5"
                type="number"
                min={13}
                max={100}
                value={effectiveAge ?? ""}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
              />
            </label>
            <label className="block">
              <FieldLabel>Height (cm)</FieldLabel>
              <Input
                className="mt-1.5"
                type="number"
                value={effectiveHeightCm ?? ""}
                onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : null)}
              />
            </label>
            <label className="block sm:col-span-2">
              <FieldLabel>Weight (kg)</FieldLabel>
              <Input
                className="mt-1.5 max-w-xs"
                type="number"
                value={effectiveWeightKg ?? ""}
                onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : null)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button className="min-w-[140px]" onClick={() => void handleSave()}>
                Save changes
              </Button>
              <Button variant="neutral" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
          {message && <StateMessage kind="success" message={message} />}
          {error && <StateMessage kind="error" message={error} />}
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FiLayers className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">Library</span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Saved plans</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Plans you&apos;ve generated are stored here.</p>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No saved plans yet"
              description="Use Generate plan to create your first weekly split — it will show up here."
            />
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {plans.map((plan) => (
              <li
                key={plan._id}
                className="group flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-4 transition hover:border-indigo-300/60 hover:shadow-md dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-indigo-500/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-zinc-100">{plan.title}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-zinc-400">
                    {GOAL_LABEL[plan.goal]} · {plan.schedule.length} days/week · BMI {plan.profileSummary.bmi.toFixed(1)}
                  </p>
                </div>
                <span className="shrink-0 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-zinc-300 sm:self-center">
                  {plan.planDurationWeeks} wk
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={showSavedModal}
        title="Profile updated"
        onClose={() => setShowSavedModal(false)}
        actions={<Button onClick={() => setShowSavedModal(false)}>OK</Button>}
      >
        Your profile information has been saved successfully.
      </Modal>
    </section>
  );
}
