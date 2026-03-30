export default function LoadingBlocks() {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-xl bg-white/70" />
      ))}
    </div>
  );
}
