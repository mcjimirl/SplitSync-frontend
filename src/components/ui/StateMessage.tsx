export default function StateMessage({ kind, message }: { kind: "success" | "error"; message: string }) {
  return (
    <p
      className={`rounded-xl px-3 py-2 text-sm ${
        kind === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {message}
    </p>
  );
}
