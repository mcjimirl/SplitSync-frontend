import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiCamera } from "react-icons/fi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import StateMessage from "../components/ui/StateMessage";
import { useAuth } from "../features/auth/AuthContext";
import { updateMe, uploadMyAvatar } from "../services/authService";
import { getMyPlans } from "../services/workoutService";
import type { StoredPlan } from "../types";

function resolveAvatarUrl(avatarUrl?: string | null) {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
    return avatarUrl;
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

export default function ProfilePage() {
  const { logout, user, token, refresh } = useAuth();
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<number | null | undefined>(undefined);
  const [heightCm, setHeightCm] = useState<number | null | undefined>(
    undefined,
  );
  const [weightKg, setWeightKg] = useState<number | null | undefined>(
    undefined,
  );
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
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
    () =>
      `${effectiveFirstName} ${effectiveLastName}`.trim() || user?.name || "",
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
    <section className="space-y-4">
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900  pb-2">
          Profile Section
        </h1>
        <div className="rounded-xl bg-white/70 p-3">
          <p className="text-sm font-medium text-slate-700">Profile Picture</p>
          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="relative h-24 w-24">
              {selectedAvatarFile ? (
                <img
                  src={URL.createObjectURL(selectedAvatarFile)}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border-2 border-lime-300 object-cover bg-slate-200"
                />
              ) : user?.avatarUrl && !avatarLoadFailed ? (
                <img
                  src={resolveAvatarUrl(user.avatarUrl)}
                  alt="Profile preview"
                  onError={() => setAvatarLoadFailed(true)}
                  className="h-24 w-24 rounded-full border-2 border-white object-cover bg-slate-200"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-white bg-zinc-800 text-2xl font-semibold text-white">
                  {initialsFromName(composedName || user?.name)}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white bg-slate-900 text-white shadow-md transition hover:bg-slate-700"
                aria-label="Upload profile photo"
              >
                <FiCamera size={16} />
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
            <p className="text-xs text-slate-500">
              {selectedAvatarFile
                ? "Image selected and ready to save."
                : "No image selected."}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Upload JPG/PNG image up to 5MB.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            First Name
            <Input
              className="mt-1"
              value={effectiveFirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            Surname
            <Input
              className="mt-1"
              value={effectiveLastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            Age
            <Input
              className="mt-1"
              type="number"
              value={effectiveAge ?? ""}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Height (cm)
            <Input
              className="mt-1"
              type="number"
              value={effectiveHeightCm ?? ""}
              onChange={(e) =>
                setHeightCm(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Weight (kg)
            <Input
              className="mt-1"
              type="number"
              value={effectiveWeightKg ?? ""}
              onChange={(e) =>
                setWeightKg(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
          <p className=" flex flex-col">
            Signed in as{" "}
            <span className="font-semibold bg-white p-2 text-[14px] rounded-lg mb-2">
              {user?.email ?? "unknown"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void handleSave()}>Save changes</Button>
          <Button variant="neutral" onClick={logout}>
            Logout
          </Button>
        </div>
        {message && <StateMessage kind="success" message={message} />}
        {error && <StateMessage kind="error" message={error} />}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Saved Plans</h2>
        {plans.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No saved plans yet"
              description="Generate a workout plan and it will appear here."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {plans.map((plan) => (
              <li key={plan._id} className="rounded-xl bg-white/80 p-3">
                <p className="font-semibold">{plan.title}</p>
                <p className="text-sm text-slate-600">
                  Goal: {plan.goal} • Days/week: {plan.schedule.length} • BMI:{" "}
                  {plan.profileSummary.bmi}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={showSavedModal}
        title="Profile Updated"
        onClose={() => setShowSavedModal(false)}
        actions={<Button onClick={() => setShowSavedModal(false)}>OK</Button>}
      >
        Your profile information has been saved successfully.
      </Modal>
    </section>
  );
}
