"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { teams } from "@/data/teams";
import { matches } from "@/data/matches";
import { standings } from "@/data/standings";
import { squads } from "@/data/squads";
import { dataSources } from "@/data/update-log";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamOverview } from "@/components/team/TeamOverview";
import { SquadTable } from "@/components/team/SquadTable";
import { KeyPlayers } from "@/components/team/KeyPlayers";
import { TeamStatsSection } from "@/components/team/TeamStats";
import { FixturesList } from "@/components/team/FixturesList";
import { ResultsList } from "@/components/team/ResultsList";
import { GroupStandings } from "@/components/team/GroupStandings";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { getTeamById, getTeamUpcomingFixtures, getGroupStandings, getKeyPlayers, getSquadAverageAge, generateRecentResults, generateTeamStats, getNextMatch } from "@/lib/utils";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = getTeamById(teams, teamId);

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Team not found</h1>
        <p className="text-[var(--muted)] mb-6">The team &quot;{teamId}&quot; could not be found.</p>
        <Link href="/teams" className="text-[var(--accent-light)] hover:underline">Back to all teams</Link>
      </div>
    );
  }

  const standing = standings.find(s => s.teamId === team.id) || { teamId: team.id, group: team.group, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, position: 0, form: [] as import("@/types").MatchResult[] };
  const groupStandingsList = getGroupStandings(standings, team.group);
  const upcomingFixtures = getTeamUpcomingFixtures(matches, team.id);
  const nextMatch = getNextMatch(matches, team.id);
  const squad = squads[team.id] || [];
  const keyPlayers = getKeyPlayers(squad);
  const recentResults = generateRecentResults(team);
  const teamStats = generateTeamStats(team);
  const avgAge = getSquadAverageAge(squad);
  const groupTeams = teams.filter(t => t.group === team.group);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <Link href="/teams" className="text-sm text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors">&larr; Back to all teams</Link>
      </div>
      <TeamHeader team={team} standing={standing} nextMatch={nextMatch} allTeams={teams} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TeamOverview team={team} standing={standing} />
            <ResultsList results={recentResults} />
            <FixturesList fixtures={upcomingFixtures} teamId={team.id} allTeams={teams} />
            <GroupStandings standings={groupStandingsList} allTeams={groupTeams} currentTeamId={team.id} group={team.group} />
            <SquadTable squad={squad} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
              <div className="space-y-3">
                {[
                  ["FIFA Ranking", `#${team.fifaRanking}`],
                  ["Confederation", team.confederation],
                  ["Coach", team.coach],
                  ["Squad Size", `${squad.length} players`],
                  ["Average Age", avgAge > 0 ? `${avgAge} years` : "N/A"],
                  ["Group", team.group],
                  ["Status", team.tournamentStatus],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <KeyPlayers players={keyPlayers} />
            <TeamStatsSection stats={teamStats} />

            <Card>
              <CardHeader><CardTitle>Form &amp; Trends</CardTitle></CardHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Last 5 results</span><span className="font-medium">{recentResults.filter(r => r.result === 'W').length}W {recentResults.filter(r => r.result === 'D').length}D {recentResults.filter(r => r.result === 'L').length}L</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Goals scored (last 5)</span><span className="font-medium">{recentResults.reduce((s, r) => s + parseInt(r.score.split('-')[0]), 0)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Goals conceded (last 5)</span><span className="font-medium">{recentResults.reduce((s, r) => s + parseInt(r.score.split('-')[1]), 0)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Clean sheets (last 5)</span><span className="font-medium">{recentResults.filter(r => r.score.split('-')[1] === '0').length}</span></div>
              </div>
            </Card>

            <Card hover>
              <Link href={`/compare?team1=${team.id}`} className="block text-center">
                <div className="text-2xl mb-2">⚖️</div>
                <h3 className="font-semibold text-white">Compare {team.shortName}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Compare with another team</p>
              </Link>
            </Card>

            <Card>
              <CardHeader><CardTitle>Data Sources</CardTitle></CardHeader>
              <div className="space-y-2">
                {dataSources.map((ds, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-[var(--muted)]">{ds.domain}</span>
                    <span className={`px-1.5 py-0.5 rounded ${ds.confidence === 'verified' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{ds.confidence}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3"><LastUpdated timestamp="2026-04-04T00:00:00Z" source="FIFA.com" /></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
