import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  variant?: "default" | "dark";
};

export default function Input({ error, variant = "default", className = "", ...props }: InputProps) {
  const base =
    variant === "dark"
      ? `h-11 w-full border-0 border-b border-white/25 bg-transparent px-0 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white focus:ring-0 ${
          error ? "border-rose-400/80" : ""
        }`
      : `h-10 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${
          error ? "border-rose-400 dark:border-rose-500" : ""
        }`;

  return (
    <div>
      <input {...props} className={`${base} ${className}`} />
      {error && (
        <p className={`mt-1 text-xs ${variant === "dark" ? "text-rose-300" : "text-rose-600 dark:text-rose-400"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
