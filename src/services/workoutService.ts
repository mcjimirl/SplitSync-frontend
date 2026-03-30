import type {
  AttendanceItem,
  Exercise,
  PlanGuide,
  SplitRequest,
  StoredPlan,
  WeeklyPlan,
} from "../types";
import { api } from "./api";

function authHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function generateSplit(
  token: string,
  payload: SplitRequest,
  options?: { replaceExisting?: boolean },
): Promise<WeeklyPlan> {
  const { data } = await api.post<{ plan: WeeklyPlan }>(
    "/splits/generate",
    { ...payload, replaceExisting: options?.replaceExisting ?? false },
    authHeader(token),
  );
  return data.plan;
}

export async function getWorkoutLibrary(token: string): Promise<Exercise[]> {
  const { data } = await api.get<{ exercises: Exercise[] }>("/workouts/library", authHeader(token));
  return data.exercises;
}

export async function getMyPlans(token: string): Promise<StoredPlan[]> {
  const { data } = await api.get<{ plans: StoredPlan[] }>("/scheduler/plans", authHeader(token));
  return data.plans;
}

export async function getAttendance(token: string, planId: string): Promise<AttendanceItem[]> {
  const { data } = await api.get<{ attendance: AttendanceItem[] }>(`/scheduler/attendance?planId=${encodeURIComponent(planId)}`, authHeader(token));
  return data.attendance;
}

export async function markAttendance(
  token: string,
  payload: { planId: string; date: string; attended: boolean; note?: string },
): Promise<AttendanceItem> {
  const { data } = await api.put<{ attendance: AttendanceItem }>("/scheduler/attendance", payload, authHeader(token));
  return data.attendance;
}

export async function getExerciseGuides(token: string): Promise<PlanGuide[]> {
  const { data } = await api.get<{ guides: PlanGuide[] }>("/workouts/guides", authHeader(token));
  return data.guides;
}

export async function getAllUsers(token: string) {
  const { data } = await api.get<{ users: Array<{ _id: string; name: string; email: string; role: string }> }>("/admin/users", authHeader(token));
  return data.users;
}

export async function getAllPlans(token: string): Promise<StoredPlan[]> {
  const { data } = await api.get<{ plans: StoredPlan[] }>("/admin/plans", authHeader(token));
  return data.plans;
}
