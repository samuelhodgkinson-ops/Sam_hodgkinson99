import Link from "next/link";
import { Match, Team } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatMatchDate, getCountdown } from "@/lib/utils";
import { TeamFlag } from "@/components/ui/TeamFlag";

export function FixturesList({ fixtures, teamId, allTeams, title = "Upcoming Fixtures", showCountdown = true }: { fixtures: Match[]; teamId: string; allTeams: Team[]; title?: string; showCountdown?: boolean }) {
  const getTeam = (id: string) => allTeams.find(t => t.id === id);

  if (!fixtures.length) {
    return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><p className="text-sm text-[var(--muted)]">No fixtures scheduled</p></Card>;
  }

  return (
    <Card padding={false}>
      <div className="p-4 sm:p-5 pb-0"><CardHeader><CardTitle>{title}</CardTitle></CardHeader></div>
      <div className="divide-y divide-[var(--card-border)]">
        {fixtures.map((match) => {
          const isHome = match.homeTeamId === teamId;
          const opponent = isHome ? getTeam(match.awayTeamId) : getTeam(match.homeTeamId);
          return (
            <Link key={match.id} href={`/matches/${match.id}`} className="block hover:bg-[var(--card-hover)] transition-colors">
              <div className="px-4 sm:px-5 py-3 flex items-center gap-4">
                <div className="text-center shrink-0 w-20">
                  <div className="text-xs text-[var(--muted)]">{formatMatchDate(match.date)}</div>
                  <div className="text-xs text-[var(--accent-light)]">{match.time} UTC</div>
                  {showCountdown && !match.isCompleted && <div className="text-xs text-[var(--muted)] mt-0.5">{getCountdown(match.date, match.time)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {opponent && <TeamFlag teamId={opponent.id} size="md" />}
                    <div>
                      <div className="text-sm font-medium text-white">vs {opponent?.name || "TBD"}</div>
                      <div className="text-xs text-[var(--muted)]">{isHome ? "Home" : "Away"} | {match.stage}{match.group ? ` | ${match.group}` : ""}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {match.isCompleted && match.homeScore !== undefined
                    ? <div className="text-lg font-bold">{match.homeScore} - {match.awayScore}</div>
                    : <div className="text-xs text-[var(--muted)]">{match.venue}</div>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
