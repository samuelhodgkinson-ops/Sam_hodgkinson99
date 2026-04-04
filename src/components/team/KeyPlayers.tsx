import { Player } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function KeyPlayers({ players }: { players: Player[] }) {
  if (!players.length) return null;
  return (
    <Card>
      <CardHeader><CardTitle>Key Players</CardTitle></CardHeader>
      <div className="space-y-2">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)]">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)] font-bold text-sm shrink-0">{p.shirtNumber}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm">{p.name}{p.isCaptain && <span className="ml-1 text-yellow-400">(C)</span>}</div>
              <div className="text-xs text-[var(--muted)]">{p.position} &middot; {p.club}</div>
              {p.keyPlayerRole && <div className="text-xs text-[var(--accent-light)] mt-0.5">{p.keyPlayerRole}</div>}
            </div>
            <div className="text-right text-xs shrink-0">
              <div className="text-[var(--muted)]">{p.caps} caps</div>
              <div className="font-semibold text-white">{p.goals} goals</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
