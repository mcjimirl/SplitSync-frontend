import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "neutral";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
      : "bg-white text-slate-800 hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:text-slate-400";

  return (
    <button
      {...props}
      className={`h-10 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 ${styles} ${className}`}
    />
  );
}
