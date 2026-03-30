export default function StateMessage({
  kind,
  message,
  tone = "light",
}: {
  kind: "success" | "error";
  message: string;
  /** Use "dark" on charcoal / black marketing surfaces only */
  tone?: "light" | "dark";
}) {
  if (tone === "dark") {
    const styles =
      kind === "success"
        ? "bg-emerald-500/15 text-emerald-200"
        : "bg-rose-500/15 text-rose-200";
    return <p className={`rounded-xl px-3 py-2 text-sm ${styles}`}>{message}</p>;
  }

  const styles =
    kind === "success"
      ? "border border-emerald-500/20 bg-emerald-50 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300"
      : "border border-rose-500/20 bg-rose-50 text-rose-900 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300";

  return <p className={`rounded-xl px-3 py-2 text-sm ${styles}`}>{message}</p>;
}
