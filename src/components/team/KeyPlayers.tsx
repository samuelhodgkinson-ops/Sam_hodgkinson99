import { Player } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function KeyPlayers({ players }: { players: Player[] }) {
  if (!players.length) return null;
  return (
    <Card>
      <CardHeader><CardTitle>Key Players</CardTitle></CardHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)]">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)] font-bold text-sm">{p.shirtNumber}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">{p.name}{p.isCaptain && <span className="ml-1 text-yellow-400">(C)</span>}</div>
              <div className="text-xs text-[var(--muted)]">{p.position} | {p.club}</div>
              {p.keyPlayerRole && <div className="text-xs text-[var(--accent-light)] mt-0.5">{p.keyPlayerRole}</div>}
            </div>
            <div className="text-right text-xs">
              <div className="text-[var(--muted)]">{p.caps} caps</div>
              <div className="font-semibold text-white">{p.goals} goals</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
