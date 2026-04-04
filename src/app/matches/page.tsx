"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { matches } from "@/data/matches";
import { teams } from "@/data/teams";
import { Card } from "@/components/ui/Card";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { formatMatchDate } from "@/lib/utils";

export default function MatchesPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const filtered = useMemo(() => {
    return matches.filter(m => showCompleted ? m.isCompleted : !m.isCompleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [showCompleted]);

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const groupedByDate = filtered.reduce<Record<string, typeof matches>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Fixtures &amp; Results</h1>
          <p className="text-sm text-[var(--muted)]">{filtered.length} matches</p>
        </div>
        <LastUpdated timestamp="2026-04-04T00:00:00Z" source="FIFA.com" />
      </div>
      <div className="flex gap-3 mb-6">
        <div className="flex rounded-lg overflow-hidden border border-[var(--card-border)]">
          <button onClick={() => setShowCompleted(false)} className={`px-4 py-2 text-sm font-medium ${!showCompleted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>Upcoming</button>
          <button onClick={() => setShowCompleted(true)} className={`px-4 py-2 text-sm font-medium ${showCompleted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>Results</button>
        </div>
      </div>

      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]"><p className="text-lg mb-2">No matches found</p></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dayMatches]) => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-[var(--muted)] mb-3 uppercase tracking-wider">{formatMatchDate(date)}</h2>
              <div className="space-y-2">
                {dayMatches.map(match => {
                  const home = getTeam(match.homeTeamId);
                  const away = getTeam(match.awayTeamId);
                  return (
                    <Link key={match.id} href={`/matches/${match.id}`}>
                      <Card hover className="!p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-[var(--accent-light)] w-14 text-center shrink-0">{match.time} UTC</div>
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-lg">{home?.flag || '🏳️'}</span>
                              <span className="text-sm font-medium text-white truncate">{home?.shortName || match.homeTeamId}</span>
                            </div>
                            <div className="px-3 text-center shrink-0">
                              {match.isCompleted && match.homeScore !== undefined
                                ? <span className="text-lg font-bold text-white">{match.homeScore} - {match.awayScore}</span>
                                : <span className="text-sm text-[var(--muted)]">vs</span>}
                            </div>
                            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                              <span className="text-sm font-medium text-white truncate">{away?.shortName || match.awayTeamId}</span>
                              <span className="text-lg">{away?.flag || '🏳️'}</span>
                            </div>
                          </div>
                          <div className="text-xs text-[var(--muted)] w-24 text-right shrink-0 hidden sm:block">{match.group || match.stage}</div>
                        </div>
                        <div className="text-xs text-[var(--muted)] mt-1 ml-14">{match.venue}, {match.city}</div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
