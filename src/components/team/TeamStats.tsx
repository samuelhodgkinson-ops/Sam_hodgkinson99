import { TeamStats as TStats } from "@/types";
import { Card, CardHeader, CardTitle, StatCard } from "@/components/ui/Card";

export function TeamStatsSection({ stats }: { stats: TStats }) {
  return (
    <Card>
      <CardHeader><CardTitle>Team Statistics</CardTitle></CardHeader>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatCard label="Matches" value={stats.matchesPlayed} />
        <StatCard label="Wins" value={stats.wins} />
        <StatCard label="Draws" value={stats.draws} />
        <StatCard label="Losses" value={stats.losses} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatCard label="Goals Scored" value={stats.goalsScored} />
        <StatCard label="Goals Conceded" value={stats.goalsConceded} />
        <StatCard label="Goal Diff" value={stats.goalDifference > 0 ? `+${stats.goalDifference}` : `${stats.goalDifference}`} />
        <StatCard label="Clean Sheets" value={stats.cleanSheets} />
      </div>
      <div className="space-y-3">
        <PerfBar label="Possession" value={stats.possessionAvg} max={100} suffix="%" />
        <PerfBar label="Pass Accuracy" value={stats.passAccuracy} max={100} suffix="%" />
        <PerfBar label="Shots / Game" value={stats.shotsPerGame} max={25} />
        <PerfBar label="On Target / Game" value={stats.shotsOnTargetPerGame} max={12} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <StatCard label="Corners" value={stats.corners} />
        <StatCard label="Fouls" value={stats.fouls} />
        <StatCard label="Yellow Cards" value={stats.yellowCards} />
        <StatCard label="Red Cards" value={stats.redCards} />
      </div>
    </Card>
  );
}

function PerfBar({ label, value, max, suffix = "" }: { label: string; value: number; max: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs text-[var(--muted)] shrink-0">{label}</div>
      <div className="flex-1 stat-bar"><div className="stat-bar-fill bg-[var(--accent)]" style={{ width: `${Math.min((value / max) * 100, 100)}%` }} /></div>
      <div className="w-16 text-right text-sm font-medium">{value}{suffix}</div>
    </div>
  );
}
