/**
 * Icons8 illustration URLs (PNG).
 * Hotlinking is allowed; free tier requires attribution — show "Illustrations by Icons8" with link to https://icons8.com
 * @see https://icons8.com
 */

export const ICONS8_LINK = "https://icons8.com";

/** 3D Fluency reads as illustration-style on the dashboard */
const STYLE = "3d-fluency";
const SIZE = 94;

export function icons8Url(slug: string): string {
  return `https://img.icons8.com/${STYLE}/${SIZE}/${slug}.png`;
}

/** Day / section headers */
export const ICONS8_DAY_SLUG = "personal-trainer";
export const ICONS8_EMPTY_SLUG = "dumbbell";

/** Explicit slugs for exercises produced by the split generator (Icons8 kebab-style names) */
const EXERCISE_SLUG_BY_NAME: Record<string, string> = {
  "Back Squat": "squats",
  "Bench Press": "bench-press",
  "Romanian Deadlift": "deadlift",
  "Overhead Press": "dumbbell",
  "Dumbbell Incline Press": "dumbbell",
  "Lat Pulldown": "pull-up-bar",
  "Leg Press": "leg",
  "Cable Row": "rowing-machine",
  "Bodyweight Squat": "squats",
  "Kettlebell Swing": "kettlebell",
  "Push-up": "pushups",
  "Mountain Climbers": "treadmill",
  "Bodyweight Alternative": "gym",
};

const MUSCLE_SLUG: Record<string, string> = {
  legs: "squats",
  chest: "bench-press",
  back: "pull-up-bar",
  shoulders: "dumbbell",
  hamstrings: "deadlift",
  arms: "dumbbell",
  biceps: "dumbbell",
  triceps: "dumbbell",
  core: "abs",
  cardio: "treadmill",
};

function slugFromKeywords(text: string): string | null {
  const t = text.toLowerCase();
  if (/squat|leg press|lunge|leg\b/.test(t)) return "squats";
  if (/bench|fly|chest|push-up|pushup|dip/.test(t)) return "bench-press";
  if (/deadlift|rdl|hinge|hamstring/.test(t)) return "deadlift";
  if (/lat|pulldown|pull-up|row|cable row/.test(t)) return "pull-up-bar";
  if (/press|shoulder|overhead/.test(t)) return "dumbbell";
  if (/curl|arm|tricep|bicep/.test(t)) return "dumbbell";
  if (/kettlebell|swing/.test(t)) return "kettlebell";
  if (/mountain|climber|plank|core|ab/.test(t)) return "abs";
  if (/run|cardio|jump|bike/.test(t)) return "treadmill";
  return null;
}

/**
 * Ordered candidate slugs for <img onError /> fallback chain.
 */
export function icons8ExerciseCandidates(exerciseName: string, muscleGroup?: string): string[] {
  const explicit = EXERCISE_SLUG_BY_NAME[exerciseName];
  const fromMuscle = muscleGroup ? MUSCLE_SLUG[muscleGroup.toLowerCase()] : undefined;
  const fromKeywords = slugFromKeywords(exerciseName) ?? slugFromKeywords(muscleGroup ?? "");
  const unique = [explicit, fromMuscle, fromKeywords, "dumbbell", "gym"].filter(
    (s, i, arr): s is string => Boolean(s) && arr.indexOf(s) === i,
  );
  return unique.length ? unique : ["dumbbell"];
}

export function icons8DayCandidates(): string[] {
  return [ICONS8_DAY_SLUG, "calendar", "gym"];
}

/** Diet / meal cards (same Icons8 style for consistency across app) */
export function icons8DietHeaderCandidates(): string[] {
  return ["vegetarian-food", "healthy-food", "apple"];
}

const DIET_CARD_ROTATION = [
  ["vegetarian-food", "broccoli", "healthy-food"],
  ["avocado", "salad", "orange"],
  ["steak", "fish", "chicken"],
  ["banana", "water", "bottle"],
  ["rice-bowl", "noodles", "sushi"],
  ["eggs", "milk", "cheese"],
  ["bread", "jam", "croissant"],
] as const;

export function icons8DietMealCandidates(cardIndex: number): string[] {
  return [...DIET_CARD_ROTATION[cardIndex % DIET_CARD_ROTATION.length]];
}
