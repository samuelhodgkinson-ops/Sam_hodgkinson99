"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { teams } from "@/data/teams";
import { squads } from "@/data/squads";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { GroupBadge, ConfederationBadge } from "@/components/ui/Badge";
import { TeamFlag } from "@/components/ui/TeamFlag";
import { generateTeamStats, getSquadAverageAge, getKeyPlayers } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const [team1Id, setTeam1Id] = useState(searchParams.get("team1") || "");
  const [team2Id, setTeam2Id] = useState(searchParams.get("team2") || "");

  const team1 = teams.find(t => t.id === team1Id);
  const team2 = teams.find(t => t.id === team2Id);
  const t1Stats = team1 ? generateTeamStats(team1) : null;
  const t2Stats = team2 ? generateTeamStats(team2) : null;
  const t1Squad = squads[team1Id] || [];
  const t2Squad = squads[team2Id] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Compare Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs text-[var(--muted)] uppercase font-semibold mb-1 block">Team 1</label>
          <select value={team1Id} onChange={(e) => setTeam1Id(e.target.value)} className="w-full py-2.5">
            <option value="">Select a team...</option>
            {teams.sort((a, b) => a.name.localeCompare(b.name)).map(t => <option key={t.id} value={t.id}>{t.name} ({t.group})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] uppercase font-semibold mb-1 block">Team 2</label>
          <select value={team2Id} onChange={(e) => setTeam2Id(e.target.value)} className="w-full py-2.5">
            <option value="">Select a team...</option>
            {teams.sort((a, b) => a.name.localeCompare(b.name)).map(t => <option key={t.id} value={t.id}>{t.name} ({t.group})</option>)}
          </select>
        </div>
      </div>

      {team1 && team2 ? (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex justify-center mb-2"><TeamFlag teamId={team1.id} size="xl" /></div>
                <h3 className="font-bold text-white">{team1.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1"><GroupBadge group={team1.group} /><ConfederationBadge confederation={team1.confederation} /></div>
              </div>
              <div className="flex items-center justify-center"><span className="text-2xl text-[var(--muted)]">vs</span></div>
              <div>
                <div className="flex justify-center mb-2"><TeamFlag teamId={team2.id} size="xl" /></div>
                <h3 className="font-bold text-white">{team2.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1"><GroupBadge group={team2.group} /><ConfederationBadge confederation={team2.confederation} /></div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Comparison</CardTitle></CardHeader>
            <div className="space-y-3">
              <CmpRow label="FIFA Ranking" v1={`#${team1.fifaRanking}`} v2={`#${team2.fifaRanking}`} better={team1.fifaRanking < team2.fifaRanking ? 1 : team1.fifaRanking > team2.fifaRanking ? 2 : 0} />
              <CmpRow label="Coach" v1={team1.coach} v2={team2.coach} />
              <CmpRow label="Squad Size" v1={`${t1Squad.length}`} v2={`${t2Squad.length}`} />
              <CmpRow label="Avg Age" v1={`${getSquadAverageAge(t1Squad)}`} v2={`${getSquadAverageAge(t2Squad)}`} />
              {t1Stats && t2Stats && <>
                <CmpRow label="Possession Avg" v1={`${t1Stats.possessionAvg}%`} v2={`${t2Stats.possessionAvg}%`} better={t1Stats.possessionAvg > t2Stats.possessionAvg ? 1 : 2} />
                <CmpRow label="Pass Accuracy" v1={`${t1Stats.passAccuracy}%`} v2={`${t2Stats.passAccuracy}%`} better={t1Stats.passAccuracy > t2Stats.passAccuracy ? 1 : 2} />
                <CmpRow label="Shots/Game" v1={`${t1Stats.shotsPerGame}`} v2={`${t2Stats.shotsPerGame}`} better={t1Stats.shotsPerGame > t2Stats.shotsPerGame ? 1 : 2} />
              </>}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle><span className="inline-flex items-center gap-2"><TeamFlag teamId={team1.id} size="sm" /> Key Players</span></CardTitle></CardHeader>
              {getKeyPlayers(t1Squad).slice(0, 5).map(p => <div key={p.id} className="flex justify-between text-sm py-1"><span className="text-white">{p.name}</span><span className="text-[var(--muted)]">{p.position} | {p.caps} caps</span></div>)}
            </Card>
            <Card>
              <CardHeader><CardTitle><span className="inline-flex items-center gap-2"><TeamFlag teamId={team2.id} size="sm" /> Key Players</span></CardTitle></CardHeader>
              {getKeyPlayers(t2Squad).slice(0, 5).map(p => <div key={p.id} className="flex justify-between text-sm py-1"><span className="text-white">{p.name}</span><span className="text-[var(--muted)]">{p.position} | {p.caps} caps</span></div>)}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle><span className="inline-flex items-center gap-2"><TeamFlag teamId={team1.id} size="sm" /> Strengths &amp; Weaknesses</span></CardTitle></CardHeader>
              <div className="mb-2">{team1.strengths.map((s, i) => <div key={i} className="text-sm text-[var(--muted-light)] flex gap-2"><span className="text-[var(--success)]">+</span> {s}</div>)}</div>
              {team1.weaknesses.map((w, i) => <div key={i} className="text-sm text-[var(--muted-light)] flex gap-2"><span className="text-[var(--danger)]">-</span> {w}</div>)}
            </Card>
            <Card>
              <CardHeader><CardTitle><span className="inline-flex items-center gap-2"><TeamFlag teamId={team2.id} size="sm" /> Strengths &amp; Weaknesses</span></CardTitle></CardHeader>
              <div className="mb-2">{team2.strengths.map((s, i) => <div key={i} className="text-sm text-[var(--muted-light)] flex gap-2"><span className="text-[var(--success)]">+</span> {s}</div>)}</div>
              {team2.weaknesses.map((w, i) => <div key={i} className="text-sm text-[var(--muted-light)] flex gap-2"><span className="text-[var(--danger)]">-</span> {w}</div>)}
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-4xl mb-4">⚖️</div>
          <p className="text-lg mb-2">Select two teams to compare</p>
          <p className="text-sm">Choose teams from the dropdowns above</p>
        </div>
      )}
    </div>
  );
}

function CmpRow({ label, v1, v2, better }: { label: string; v1: string; v2: string; better?: number }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-[var(--card-border)] last:border-0">
      <div className={`text-right text-sm font-medium ${better === 1 ? 'text-[var(--success)]' : 'text-white'}`}>{v1}</div>
      <div className="text-center text-xs text-[var(--muted)]">{label}</div>
      <div className={`text-left text-sm font-medium ${better === 2 ? 'text-[var(--success)]' : 'text-white'}`}>{v2}</div>
    </div>
  );
}

export default function ComparePage() {
  return <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><h1 className="text-2xl font-bold text-white">Compare Teams</h1><p className="text-[var(--muted)] mt-4">Loading...</p></div>}><CompareContent /></Suspense>;
}
