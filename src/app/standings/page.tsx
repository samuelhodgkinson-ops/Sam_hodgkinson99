"use client";

import { teams } from "@/data/teams";
import { standings } from "@/data/standings";
import { GroupStandings } from "@/components/team/GroupStandings";
import { getGroupStandings } from "@/lib/utils";
import { LastUpdated } from "@/components/ui/LastUpdated";

export default function StandingsPage() {
  const groups = [...new Set(teams.map(t => t.group))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Standings</h1>
          <p className="text-sm text-[var(--muted)]">All group standings</p>
        </div>
        <LastUpdated timestamp="2026-04-04T00:00:00Z" source="FIFA.com" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((g) => (
          <GroupStandings key={g} standings={getGroupStandings(standings, g)} allTeams={teams.filter(t => t.group === g)} group={g} />
        ))}
      </div>
    </div>
  );
}
