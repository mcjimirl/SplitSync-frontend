import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "neutral";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
      : "border border-slate-200/90 bg-white text-slate-800 shadow-sm hover:bg-zinc-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:disabled:bg-zinc-800";

  return (
    <button
      {...props}
      className={`h-10 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:focus-visible:ring-indigo-400/50 ${styles} ${className}`}
    />
  );
}
