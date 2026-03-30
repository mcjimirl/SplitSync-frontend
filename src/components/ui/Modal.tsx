import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
};

export default function Modal({ open, title, children, onClose, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="clay-card w-full max-w-md p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg bg-white/80 px-2 py-1 text-sm text-slate-700">
            <FiX />
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-600">{children}</div>
        {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
