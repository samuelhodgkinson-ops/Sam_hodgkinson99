"use client";

import { useState } from "react";
import { Player, PlayerPosition } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";

const positions: PlayerPosition[] = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export function SquadTable({ squad }: { squad: Player[] }) {
  const [filterPos, setFilterPos] = useState("All");
  const [sortBy, setSortBy] = useState("number");

  const filtered = filterPos === "All" ? squad : squad.filter(p => p.position === filterPos);
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "number": return a.shirtNumber - b.shirtNumber;
      case "name": return a.name.localeCompare(b.name);
      case "age": return a.age - b.age;
      case "caps": return b.caps - a.caps;
      case "goals": return b.goals - a.goals;
      default: return 0;
    }
  });

  return (
    <Card padding={false}>
      <div className="p-4 sm:p-5">
        <CardHeader>
          <CardTitle>Squad ({squad.length} players)</CardTitle>
          <div className="flex items-center gap-2">
            <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)} className="text-xs">
              <option value="All">All Positions</option>
              {positions.map(p => <option key={p} value={p}>{p}s</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs">
              <option value="number"># Number</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="caps">Caps</option>
              <option value="goals">Goals</option>
            </select>
          </div>
        </CardHeader>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Player</th>
              <th className="hidden sm:table-cell">Position</th>
              <th className="hidden md:table-cell">Club</th>
              <th className="hidden sm:table-cell">Age</th>
              <th>Caps</th>
              <th>Goals</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className={p.isStarter ? "" : "opacity-70"}>
                <td className="font-mono text-[var(--muted)]">{p.shirtNumber}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{p.name}</span>
                    {p.isCaptain && <span className="text-xs px-1 py-0.5 rounded bg-yellow-900/30 text-yellow-400 font-semibold">C</span>}
                    {p.isKeyPlayer && p.keyPlayerRole && <span className="text-xs text-[var(--accent-light)] hidden lg:inline">{p.keyPlayerRole}</span>}
                  </div>
                  <div className="sm:hidden text-xs text-[var(--muted)]">{p.position} | {p.club}</div>
                </td>
                <td className="hidden sm:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.position === "Goalkeeper" ? "bg-amber-900/30 text-amber-400" : p.position === "Defender" ? "bg-blue-900/30 text-blue-400" : p.position === "Midfielder" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>{p.position}</span>
                </td>
                <td className="hidden md:table-cell text-[var(--muted-light)] text-sm">{p.club}</td>
                <td className="hidden sm:table-cell">{p.age}</td>
                <td>{p.caps}</td>
                <td>{p.goals}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
