"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { matches } from "@/data/matches";
import { teams } from "@/data/teams";
import { squads } from "@/data/squads";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatMatchDate, generateTeamStats, generateRecentResults } from "@/lib/utils";

export default function MatchDetailPage() {
  const params = useParams();
  const match = matches.find(m => m.id === params.matchId);

  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Match not found</h1>
        <Link href="/matches" className="text-[var(--accent-light)] hover:underline">Back to fixtures</Link>
      </div>
    );
  }

  const home = teams.find(t => t.id === match.homeTeamId);
  const away = teams.find(t => t.id === match.awayTeamId);
  const homeStats = home ? generateTeamStats(home) : null;
  const awayStats = away ? generateTeamStats(away) : null;
  const homeResults = home ? generateRecentResults(home) : [];
  const awayResults = away ? generateRecentResults(away) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/matches" className="text-sm text-[var(--muted)] hover:text-[var(--accent-light)] mb-6 inline-block">&larr; Back to fixtures</Link>

      <Card className="mb-6">
        <div className="text-center mb-2">
          <span className="text-xs text-[var(--accent-light)] font-semibold uppercase">{match.stage}{match.group ? ` | ${match.group}` : ""}</span>
        </div>
        <div className="flex items-center justify-center gap-8">
          <Link href={home ? `/teams/${home.id}` : "#"} className="text-center group">
            <span className="text-5xl block mb-2">{home?.flag || '🏳️'}</span>
            <span className="text-lg font-bold text-white group-hover:text-[var(--accent-light)]">{home?.name || match.homeTeamId}</span>
          </Link>
          <div className="text-center px-6">
            {match.isCompleted && match.homeScore !== undefined
              ? <div className="text-4xl font-bold text-white">{match.homeScore} - {match.awayScore}</div>
              : <div className="text-2xl font-bold text-[var(--muted)]">vs</div>}
            <div className="text-sm text-[var(--muted)] mt-2">{formatMatchDate(match.date)}</div>
            <div className="text-sm text-[var(--accent-light)]">{match.time} UTC</div>
          </div>
          <Link href={away ? `/teams/${away.id}` : "#"} className="text-center group">
            <span className="text-5xl block mb-2">{away?.flag || '🏳️'}</span>
            <span className="text-lg font-bold text-white group-hover:text-[var(--accent-light)]">{away?.name || match.awayTeamId}</span>
          </Link>
        </div>
        <div className="text-center mt-4 text-sm text-[var(--muted)]">{match.venue}, {match.city}</div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TeamSidePanel team={home} stats={homeStats} results={homeResults} />
        <TeamSidePanel team={away} stats={awayStats} results={awayResults} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SquadPreview teamId={match.homeTeamId} name={home?.shortName || match.homeTeamId} flag={home?.flag || '🏳️'} />
        <SquadPreview teamId={match.awayTeamId} name={away?.shortName || match.awayTeamId} flag={away?.flag || '🏳️'} />
      </div>
    </div>
  );
}

function TeamSidePanel({ team, stats, results }: { team: typeof import("@/data/teams").teams[number] | undefined; stats: ReturnType<typeof import("@/lib/utils").generateTeamStats> | null; results: ReturnType<typeof import("@/lib/utils").generateRecentResults> }) {
  if (!team) return <Card><p className="text-[var(--muted)]">Team data not available in prototype</p></Card>;
  return (
    <Card>
      <CardHeader><CardTitle>{team.flag} {team.shortName}</CardTitle></CardHeader>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-[var(--muted)]">FIFA Ranking</span><span className="font-semibold">#{team.fifaRanking}</span></div>
        <div className="flex justify-between"><span className="text-[var(--muted)]">Coach</span><span>{team.coach}</span></div>
        {stats && <>
          <div className="flex justify-between"><span className="text-[var(--muted)]">Possession Avg</span><span>{stats.possessionAvg}%</span></div>
          <div className="flex justify-between"><span className="text-[var(--muted)]">Pass Accuracy</span><span>{stats.passAccuracy}%</span></div>
        </>}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
        <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Last 5 Results</h4>
        <div className="space-y-1">
          {results.slice(0, 5).map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`w-4 h-4 rounded text-center text-white text-[10px] leading-4 ${r.result === 'W' ? 'bg-[var(--success)]' : r.result === 'D' ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`}>{r.result}</span>
              <span className="text-[var(--muted-light)]">{r.score}</span>
              <span className="text-[var(--muted)]">{r.competition}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SquadPreview({ teamId, name, flag }: { teamId: string; name: string; flag: string }) {
  const squad = squads[teamId] || [];
  const starters = squad.filter(p => p.isStarter);

  if (!starters.length) return <Card><CardHeader><CardTitle>{flag} {name}</CardTitle></CardHeader><p className="text-sm text-[var(--muted)]">Squad not available in prototype</p></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>{flag} {name} - Expected XI</CardTitle></CardHeader>
      <div className="space-y-1">
        {starters.map(p => (
          <div key={p.id} className="flex items-center gap-2 text-sm py-1">
            <span className="text-[var(--muted)] w-6 text-right font-mono text-xs">{p.shirtNumber}</span>
            <span className="font-medium text-white">{p.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${p.position === "Goalkeeper" ? "bg-amber-900/30 text-amber-400" : p.position === "Defender" ? "bg-blue-900/30 text-blue-400" : p.position === "Midfielder" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>{p.position.slice(0, 3).toUpperCase()}</span>
            {p.isCaptain && <span className="text-xs text-yellow-400">(C)</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}
