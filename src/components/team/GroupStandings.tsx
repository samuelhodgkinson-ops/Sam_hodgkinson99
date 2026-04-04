import Link from "next/link";
import { Standing, Team } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormStrip } from "@/components/ui/Badge";

export function GroupStandings({ standings, allTeams, currentTeamId, group, compact = false }: { standings: Standing[]; allTeams: Team[]; currentTeamId?: string; group: string; compact?: boolean }) {
  const sorted = [...standings].sort((a, b) => b.points !== a.points ? b.points - a.points : b.goalDifference !== a.goalDifference ? b.goalDifference - a.goalDifference : b.goalsFor - a.goalsFor);
  const getTeam = (id: string) => allTeams.find(t => t.id === id);

  return (
    <Card padding={false}>
      <div className="p-4 sm:p-5 pb-0"><CardHeader><CardTitle>{group} Standings</CardTitle></CardHeader></div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="w-8">#</th><th>Team</th><th className="text-center">P</th><th className="text-center">W</th><th className="text-center">D</th><th className="text-center">L</th><th className="text-center">GF</th><th className="text-center">GA</th><th className="text-center">GD</th><th className="text-center font-bold">Pts</th>
              {!compact && <th className="hidden sm:table-cell">Form</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const team = getTeam(s.teamId);
              const isCurrent = s.teamId === currentTeamId;
              return (
                <tr key={s.teamId} className={isCurrent ? "bg-[var(--accent)]/10" : ""}>
                  <td className="text-center text-[var(--muted)]">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${i < 2 ? "bg-[var(--success)]/20 text-[var(--success)]" : i === 2 ? "bg-[var(--warning)]/20 text-[var(--warning)]" : "text-[var(--muted)]"}`}>{i + 1}</span>
                  </td>
                  <td>
                    {team ? (
                      <Link href={`/teams/${s.teamId}`} className="flex items-center gap-2 hover:text-[var(--accent-light)]">
                        <span className="text-lg">{team.flag}</span>
                        <span className={`text-sm font-medium ${isCurrent ? "text-[var(--accent-light)]" : "text-white"}`}>{team.shortName}</span>
                      </Link>
                    ) : (
                      <span className="text-sm text-[var(--muted)]">{s.teamId}</span>
                    )}
                  </td>
                  <td className="text-center">{s.played}</td>
                  <td className="text-center text-[var(--success)]">{s.won}</td>
                  <td className="text-center">{s.drawn}</td>
                  <td className="text-center text-[var(--danger)]">{s.lost}</td>
                  <td className="text-center">{s.goalsFor}</td>
                  <td className="text-center">{s.goalsAgainst}</td>
                  <td className="text-center font-medium">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                  <td className="text-center font-bold text-white">{s.points}</td>
                  {!compact && <td className="hidden sm:table-cell"><FormStrip form={s.form} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
