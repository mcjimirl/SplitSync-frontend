import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string | null;
};

export default function Select({ error, className = "", ...props }: SelectProps) {
  return (
    <div>
      <select
        {...props}
        className={`h-10 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/25 ${
          error ? "border-rose-400 dark:border-rose-500" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
