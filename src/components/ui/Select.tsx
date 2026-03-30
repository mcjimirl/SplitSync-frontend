import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string | null;
};

export default function Select({ error, className = "", ...props }: SelectProps) {
  return (
    <div>
      <select
        {...props}
        className={`h-10 w-full rounded-xl border bg-white/80 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-lime-300 ${
          error ? "border-rose-300" : "border-transparent"
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
