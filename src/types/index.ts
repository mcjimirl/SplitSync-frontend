export type TrainingGoal = "strength" | "hypertrophy" | "fat_loss";
export type BiologicalSex = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active";
export type EquipmentAccess = "full_gym" | "dumbbells_only" | "bodyweight_only" | "machines_only";

export type SplitRequest = {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  goal: TrainingGoal;
  activityLevel: ActivityLevel;
  injuries: string;
  medicalNotes: string;
  equipmentAccess: EquipmentAccess;
  sessionDurationMinutes: number;
  daysPerWeek: number;
  planDurationWeeks: number;
};

export type ExerciseGuide = {
  name: string;
  sets: string;
  reps: string;
  instruction: string;
};

export type DayPlan = {
  day: string;
  focus: string;
  estimatedDurationMinutes: number;
  exercises: ExerciseGuide[];
};

export type WeeklyPlan = {
  id: string;
  title: string;
  planDurationWeeks: number;
  weeklyBlocks: Array<{
    week: number;
    focus: string;
    notes: string;
  }>;
  profileSummary: {
    age: number;
    sex: BiologicalSex;
    heightCm: number;
    weightKg: number;
    bmi: number;
    activityLevel: ActivityLevel;
    injuries: string;
    equipmentAccess: EquipmentAccess;
    sessionDurationMinutes: number;
  };
  goal: TrainingGoal;
  schedule: DayPlan[];
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: "easy" | "moderate" | "hard";
  instruction?: string;
};

export type AttendanceItem = {
  _id: string;
  userId: string;
  planId: string;
  date: string;
  attended: boolean;
  note: string;
};

export type StoredPlan = WeeklyPlan & {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
};

export type PlanGuide = {
  day: string;
  name: string;
  instruction: string;
};

export type UserRole = "SUPER_ADMIN" | "USER";

export type AuthUser = {
  sub: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  age?: number | null;
  sex?: BiologicalSex | null;
  heightCm?: number | null;
  weightKg?: number | null;
  avatarUrl?: string | null;
};
