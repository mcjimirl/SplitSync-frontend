export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white/90 p-6 text-center dark:border-white/10 dark:bg-zinc-900/60">
      <p className="text-base font-semibold text-slate-800 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
