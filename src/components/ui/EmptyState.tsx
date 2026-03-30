export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-white/75 p-6 text-center">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
