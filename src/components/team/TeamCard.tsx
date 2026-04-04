import Link from "next/link";
import { Team, Standing, Match } from "@/types";
import { Card } from "@/components/ui/Card";
import { GroupBadge, ConfederationBadge } from "@/components/ui/Badge";
import { TeamFlag } from "@/components/ui/TeamFlag";
import { formatMatchDate } from "@/lib/utils";

export function TeamCard({ team, standing, nextMatch, allTeams }: { team: Team; standing?: Standing; nextMatch?: Match; latestResult?: Match; allTeams?: Team[] }) {
  const getOpponent = (match: Match) => {
    if (!allTeams) return null;
    const opId = match.homeTeamId === team.id ? match.awayTeamId : match.homeTeamId;
    return allTeams.find(t => t.id === opId) || null;
  };

  return (
    <Link href={`/teams/${team.id}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <TeamFlag teamId={team.id} size="lg" />
            <div>
              <h3 className="font-semibold text-white">{team.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <GroupBadge group={team.group} />
                <ConfederationBadge confederation={team.confederation} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--muted)]">FIFA Ranking</div>
            <div className="text-lg font-bold text-[var(--accent-light)]">#{team.fifaRanking}</div>
          </div>
        </div>

        {standing && standing.played > 0 && (
          <div className="flex items-center gap-4 text-xs text-[var(--muted-light)] mb-3 px-2 py-1.5 rounded bg-[var(--surface)]">
            <span>{standing.played}P</span>
            <span className="text-[var(--success)]">{standing.won}W</span>
            <span>{standing.drawn}D</span>
            <span className="text-[var(--danger)]">{standing.lost}L</span>
            <span className="ml-auto font-semibold text-white">{standing.points} pts</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs border-t border-[var(--card-border)] pt-3 mt-auto">
          {nextMatch ? (() => {
            const op = getOpponent(nextMatch);
            return (
              <div className="flex items-center gap-1">
                <span className="text-[var(--muted)]">Next: vs </span>
                {op && <TeamFlag teamId={op.id} size="xs" />}
                <span className="text-[var(--foreground)]">{op?.shortName || 'TBD'}</span>
                <span className="text-[var(--muted)] ml-1">{formatMatchDate(nextMatch.date)}</span>
              </div>
            );
          })() : (
            <span className="text-[var(--muted)]">Tournament starts June 2026</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
