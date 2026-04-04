"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { teams } from "@/data/teams";
import { squads } from "@/data/squads";
import { matches } from "@/data/matches";
import { SearchInput } from "@/components/ui/SearchInput";
import { Card } from "@/components/ui/Card";
import { GroupBadge, ConfederationBadge } from "@/components/ui/Badge";
import { TeamFlag } from "@/components/ui/TeamFlag";
import { formatMatchDate } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  type PlayerResult = { player: (typeof squads)[string][number]; teamId: string; teamName: string };
  type SearchResults = { teams: typeof teams; players: PlayerResult[]; matches: typeof matches };

  const results: SearchResults = useMemo(() => {
    if (!query || query.length < 2) return { teams: [], players: [], matches: [] };
    const q = query.toLowerCase();

    const matchedTeams = teams.filter(t => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.coach.toLowerCase().includes(q));

    const matchedPlayers: PlayerResult[] = [];
    for (const [teamId, squad] of Object.entries(squads)) {
      const team = teams.find(t => t.id === teamId);
      for (const player of squad) {
        if (player.name.toLowerCase().includes(q) || player.club.toLowerCase().includes(q)) {
          matchedPlayers.push({ player, teamId, teamName: team?.name || teamId });
        }
      }
    }

    const matchedMatches = matches.filter(m => {
      const home = teams.find(t => t.id === m.homeTeamId);
      const away = teams.find(t => t.id === m.awayTeamId);
      return m.venue.toLowerCase().includes(q) || m.city.toLowerCase().includes(q) || (home?.name.toLowerCase().includes(q)) || (away?.name.toLowerCase().includes(q));
    }).slice(0, 10);

    return { teams: matchedTeams, players: matchedPlayers.slice(0, 20), matches: matchedMatches };
  }, [query]);

  const total = results.teams.length + results.players.length + results.matches.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
      <SearchInput value={query} onChange={setQuery} placeholder="Search teams, players, coaches, venues..." className="mb-6" />

      {query.length >= 2 && <p className="text-sm text-[var(--muted)] mb-4">{total} results for &quot;{query}&quot;</p>}

      {results.teams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Teams ({results.teams.length})</h2>
          <div className="space-y-2">
            {results.teams.map(t => (
              <Link key={t.id} href={`/teams/${t.id}`}>
                <Card hover className="!p-3">
                  <div className="flex items-center gap-3">
                    <TeamFlag teamId={t.id} size="md" />
                    <div>
                      <div className="font-medium text-white">{t.name}</div>
                      <div className="flex items-center gap-2 text-xs"><GroupBadge group={t.group} /><ConfederationBadge confederation={t.confederation} /><span className="text-[var(--muted)]">#{t.fifaRanking} | Coach: {t.coach}</span></div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.players.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Players ({results.players.length})</h2>
          <div className="space-y-2">
            {results.players.map(({ player, teamId, teamName }) => (
              <Link key={player.id} href={`/teams/${teamId}`}>
                <Card hover className="!p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-sm font-bold text-[var(--accent-light)]">{player.shirtNumber}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1"><TeamFlag teamId={teamId} size="xs" /> {teamName} | {player.position} | {player.club}</div>
                    </div>
                    <div className="text-right text-xs text-[var(--muted)]">{player.caps} caps | {player.goals} goals</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.matches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Matches ({results.matches.length})</h2>
          <div className="space-y-2">
            {results.matches.map(m => {
              const home = teams.find(t => t.id === m.homeTeamId);
              const away = teams.find(t => t.id === m.awayTeamId);
              return (
                <Link key={m.id} href={`/matches/${m.id}`}>
                  <Card hover className="!p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-[var(--accent-light)] w-14 shrink-0">{formatMatchDate(m.date)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white flex items-center gap-1">{home ? <TeamFlag teamId={home.id} size="xs" /> : null} {home?.shortName || m.homeTeamId} vs {away?.shortName || m.awayTeamId} {away ? <TeamFlag teamId={away.id} size="xs" /> : null}</div>
                        <div className="text-xs text-[var(--muted)]">{m.venue}, {m.city}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {query.length >= 2 && total === 0 && <div className="text-center py-12 text-[var(--muted)]"><p className="text-lg mb-2">No results found</p></div>}
      {query.length < 2 && <div className="text-center py-12 text-[var(--muted)]"><div className="text-4xl mb-4">🔍</div><p className="text-lg mb-2">Start typing to search</p><p className="text-sm">Search across teams, players, coaches, and venues</p></div>}
    </div>
  );
}
