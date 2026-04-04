import { Team, Standing, Match } from "@/types";
import { GroupBadge, ConfederationBadge } from "@/components/ui/Badge";
import { TeamFlag } from "@/components/ui/TeamFlag";
import { formatMatchDate } from "@/lib/utils";

export function TeamHeader({ team, standing, nextMatch, allTeams }: { team: Team; standing?: Standing; nextMatch?: Match; allTeams: Team[] }) {
  const getOpponent = (match: Match) => {
    const opId = match.homeTeamId === team.id ? match.awayTeamId : match.homeTeamId;
    return allTeams.find(t => t.id === opId);
  };

  return (
    <div className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <TeamFlag teamId={team.id} size="xl" />
            <div>
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <GroupBadge group={team.group} />
                <ConfederationBadge confederation={team.confederation} />
                <span className="text-sm text-[var(--muted)]">FIFA Ranking #{team.fifaRanking}</span>
              </div>
            </div>
          </div>
          <div className="md:ml-auto flex flex-wrap gap-6 text-sm">
            <div>
              <div className="text-xs text-[var(--muted)] mb-0.5">Coach</div>
              <div className="font-medium">{team.coach}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)] mb-0.5">Status</div>
              <div className="font-medium">{team.tournamentStatus}</div>
            </div>
            {standing && standing.played > 0 && (
              <div>
                <div className="text-xs text-[var(--muted)] mb-0.5">Record</div>
                <div className="font-medium">{standing.won}W {standing.drawn}D {standing.lost}L | {standing.points} pts</div>
              </div>
            )}
            {nextMatch && (() => {
              const op = getOpponent(nextMatch);
              return (
                <div>
                  <div className="text-xs text-[var(--muted)] mb-0.5">Next Match</div>
                  <div className="font-medium flex items-center gap-1">
                    vs {op && <TeamFlag teamId={op.id} size="xs" />} {op?.shortName || 'TBD'}
                    <span className="text-[var(--muted)] ml-1">{formatMatchDate(nextMatch.date)}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <div className="mt-4 text-sm text-[var(--muted)]">
          <span className="text-[var(--muted-light)]">Qualification: </span>{team.qualificationRoute}
        </div>
      </div>
    </div>
  );
}
