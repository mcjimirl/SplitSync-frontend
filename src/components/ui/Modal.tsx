import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  variant?: "light" | "dark";
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  variant = "light",
}: ModalProps) {
  if (!open) return null;

  const panel =
    variant === "dark"
      ? "rounded-2xl border border-white/10 bg-zinc-950 p-5 text-zinc-100 shadow-2xl shadow-black/50"
      : "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-zinc-900";

  const titleClass =
    variant === "dark"
      ? "text-lg font-semibold text-white"
      : "text-lg font-semibold text-slate-900 dark:text-zinc-100";
  const bodyClass =
    variant === "dark" ? "text-sm text-zinc-400" : "text-sm text-slate-600 dark:text-zinc-400";
  const closeClass =
    variant === "dark"
      ? "rounded-lg bg-white/10 px-2 py-1 text-sm text-zinc-200 hover:bg-white/15"
      : "rounded-lg bg-slate-100 px-2 py-1 text-sm text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15";

  return (
    <div
      className={`fixed inset-0 z-9999 grid place-items-center p-4 backdrop-blur-[2px] ${
        variant === "dark" ? "bg-black/70" : "bg-black/40 dark:bg-black/60"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className={`w-full max-w-md ${panel}`}>
        <div className="flex items-start justify-between gap-3">
          <h2 className={titleClass}>{title}</h2>
          <button type="button" onClick={onClose} className={closeClass} aria-label="Close dialog">
            <FiX />
          </button>
        </div>
        <div className={`mt-3 ${bodyClass}`}>{children}</div>
        {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
