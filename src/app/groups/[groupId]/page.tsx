"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { teams } from "@/data/teams";
import { standings } from "@/data/standings";
import { matches } from "@/data/matches";
import { GroupStandings } from "@/components/team/GroupStandings";
import { FixturesList } from "@/components/team/FixturesList";
import { TeamCard } from "@/components/team/TeamCard";
import { getGroupStandings, getNextMatch } from "@/lib/utils";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = (params.groupId as string).toUpperCase();
  const groupName = `Group ${groupId}`;
  const groupTeams = teams.filter(t => t.group === groupName);
  const groupStandings = getGroupStandings(standings, groupName);
  const groupMatches = matches.filter(m => m.group === groupName).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!groupTeams.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Group not found</h1>
        <Link href="/groups" className="text-[var(--accent-light)] hover:underline">Back to groups</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/groups" className="text-sm text-[var(--muted)] hover:text-[var(--accent-light)] mb-4 inline-block">&larr; Back to all groups</Link>
      <h1 className="text-2xl font-bold text-white mb-6">{groupName}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GroupStandings standings={groupStandings} allTeams={groupTeams} group={groupName} />
          <FixturesList fixtures={groupMatches} teamId="" allTeams={teams} title={`${groupName} Fixtures`} showCountdown={false} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Teams</h2>
          {groupTeams.sort((a, b) => a.fifaRanking - b.fifaRanking).map(team => (
            <TeamCard key={team.id} team={team} standing={standings.find(s => s.teamId === team.id)} nextMatch={getNextMatch(matches, team.id)} allTeams={teams} />
          ))}
        </div>
      </div>
    </div>
  );
}
