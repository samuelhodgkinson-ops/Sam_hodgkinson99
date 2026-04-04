"use client";

import { useState, useMemo } from "react";
import { teams } from "@/data/teams";
import { matches } from "@/data/matches";
import { standings } from "@/data/standings";
import { TeamCard } from "@/components/team/TeamCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { filterTeams, sortTeams, getNextMatch, getAllConfederations } from "@/lib/utils";

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [confFilter, setConfFilter] = useState("");
  const [sortBy, setSortBy] = useState("ranking");

  const groups = [...new Set(teams.map(t => t.group))].sort();

  const filtered = useMemo(() => {
    const f = filterTeams(teams, { search, group: groupFilter || undefined, confederation: confFilter || undefined });
    return sortTeams(f, sortBy, standings);
  }, [search, groupFilter, confFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Teams</h1>
          <p className="text-sm text-[var(--muted)]">{filtered.length} of {teams.length} teams</p>
        </div>
        <LastUpdated timestamp="2026-04-04T00:00:00Z" source="FIFA.com" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search teams, coaches..." className="flex-1" />
        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="sm:w-40">
          <option value="">All Groups</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={confFilter} onChange={(e) => setConfFilter(e.target.value)} className="sm:w-40">
          <option value="">All Confederations</option>
          {getAllConfederations().map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sm:w-40">
          <option value="ranking">FIFA Ranking</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="group">By Group</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]"><p className="text-lg mb-2">No teams found</p><p className="text-sm">Try adjusting your search or filters</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <TeamCard key={team.id} team={team} standing={standings.find(s => s.teamId === team.id)} nextMatch={getNextMatch(matches, team.id)} allTeams={teams} />
          ))}
        </div>
      )}
    </div>
  );
}
