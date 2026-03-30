const ROWS_DARK = [
  { bg: "bg-zinc-800", textClass: "text-white", label: "TRAIN WITHOUT FEAR · REAL PROGRESS · SPLIT SYNC" },
  { bg: "bg-white", textClass: "text-neutral-800", label: "RESULTS YOU CAN FEEL · MODERN TRAINING · YOUR PACE" },
  { bg: "bg-white", textClass: "text-black", label: "STRENGTH THAT LASTS · MOVE WITH CONFIDENCE · BUILD THE HABIT" },
] as const;

const ROWS_LIGHT = [
  { bg: "bg-slate-700", textClass: "text-white", label: "TRAIN WITHOUT FEAR · REAL PROGRESS · SPLIT SYNC" },
  { bg: "bg-slate-100", textClass: "text-slate-800", label: "RESULTS YOU CAN FEEL · MODERN TRAINING · YOUR PACE" },
  { bg: "bg-white", textClass: "text-slate-900", label: "STRENGTH THAT LASTS · MOVE WITH CONFIDENCE · BUILD THE HABIT" },
] as const;

function MarqueeRow({ line, textClass }: { line: string; textClass: string }) {
  const chunk = `${line} · ${line} · `;
  return (
    <div className="overflow-hidden py-2.5">
      <div
        className={`flex w-max font-black uppercase tracking-[0.06em] motion-reduce:animate-none ${textClass} animate-marquee text-xs sm:text-sm`}
      >
        <span className="inline-block shrink-0 px-4">{chunk}</span>
        <span className="inline-block shrink-0 px-4" aria-hidden>
          {chunk}
        </span>
      </div>
    </div>
  );
}

type HeroTickerProps = {
  theme?: "light" | "dark";
};

export default function HeroTicker({ theme = "dark" }: HeroTickerProps) {
  const rows = theme === "dark" ? ROWS_DARK : ROWS_LIGHT;

  return (
    <div className="relative -mb-2 mt-auto w-full select-none">
      <div className="flex flex-col gap-0">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`${row.bg} shadow-lg ${i === 0 ? "-rotate-1" : i === 1 ? "rotate-[2deg] -translate-y-1" : "-rotate-[1.5deg] translate-y-1"}`}
            style={{ transformOrigin: "center" }}
          >
            <MarqueeRow line={row.label} textClass={row.textClass} />
          </div>
        ))}
      </div>
    </div>
  );
}
