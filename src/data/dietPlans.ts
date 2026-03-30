export type DietDayCard = {
  day: string;
  title: string;
  subtitle: string;
  calories: number;
  tags: string[];
};

/** Sample 7-day meal highlights for the diet dashboard feature */
export const dietWeekHighlights: DietDayCard[] = [
  {
    day: "Day 1",
    title: "Lean protein & greens",
    subtitle: "Breakfast focus · High protein start",
    calories: 420,
    tags: ["Protein", "Low carb"],
  },
  {
    day: "Day 2",
    title: "Balanced bowl",
    subtitle: "Lunch · Whole grains + veg",
    calories: 520,
    tags: ["Fiber", "Balanced"],
  },
  {
    day: "Day 3",
    title: "Recovery fuel",
    subtitle: "Post-workout · Carbs + lean meat",
    calories: 580,
    tags: ["Recovery", "Carbs"],
  },
  {
    day: "Day 4",
    title: "Omega-rich salad",
    subtitle: "Light dinner · Fish or tofu",
    calories: 380,
    tags: ["Healthy fats"],
  },
  {
    day: "Day 5",
    title: "Meal prep mix",
    subtitle: "Batch-friendly · Repeatable",
    calories: 510,
    tags: ["Meal prep"],
  },
  {
    day: "Day 6",
    title: "Flexible day",
    subtitle: "Social meal · Portion mindful",
    calories: 650,
    tags: ["Flexible"],
  },
  {
    day: "Day 7",
    title: "Reset & hydrate",
    subtitle: "Soup + fruit · Easy digestion",
    calories: 440,
    tags: ["Reset"],
  },
];
