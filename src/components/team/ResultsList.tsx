import { RecentResult } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ResultBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export function ResultsList({ results, title = "Recent Results" }: { results: RecentResult[]; title?: string }) {
  if (!results.length) return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><p className="text-sm text-[var(--muted)]">No recent results</p></Card>;

  return (
    <Card padding={false}>
      <div className="p-4 sm:p-5 pb-0"><CardHeader><CardTitle>{title} ({results.length})</CardTitle></CardHeader></div>
      <div className="divide-y divide-[var(--card-border)]">
        {results.map((r) => (
          <div key={r.matchId} className="px-4 sm:px-5 py-3 flex items-center gap-4">
            <ResultBadge result={r.result} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">vs {r.opponent}</div>
              <div className="text-xs text-[var(--muted)]">{r.competition}{r.venue ? ` | ${r.venue}` : ""}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-white">{r.score}</div>
              <div className="text-xs text-[var(--muted)]">{formatDate(r.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
