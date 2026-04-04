import { MatchResult } from "@/types";

export function ResultBadge({ result }: { result: MatchResult }) {
  const c = { W: "bg-[var(--success)]", D: "bg-[var(--warning)]", L: "bg-[var(--danger)]" };
  return <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold text-white ${c[result]}`}>{result}</span>;
}

export function FormStrip({ form }: { form: MatchResult[] }) {
  if (!form?.length) return <span className="text-[var(--muted)] text-sm">-</span>;
  return <div className="flex gap-1">{form.map((r, i) => <ResultBadge key={i} result={r} />)}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const c = status === "Available" ? "bg-green-900/30 text-green-400" : status === "Injured" ? "bg-red-900/30 text-red-400" : status === "Suspended" ? "bg-yellow-900/30 text-yellow-400" : "bg-[var(--surface-light)] text-[var(--muted-light)]";
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${c}`}>{status}</span>;
}

export function GroupBadge({ group }: { group: string }) {
  return <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-[var(--accent)]/20 text-[var(--accent-light)]">{group}</span>;
}

export function ConfederationBadge({ confederation }: { confederation: string }) {
  const colors: Record<string, string> = { UEFA: "bg-blue-900/30 text-blue-400", CONMEBOL: "bg-green-900/30 text-green-400", CONCACAF: "bg-yellow-900/30 text-yellow-400", CAF: "bg-orange-900/30 text-orange-400", AFC: "bg-red-900/30 text-red-400", OFC: "bg-purple-900/30 text-purple-400" };
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${colors[confederation] || ""}`}>{confederation}</span>;
}
