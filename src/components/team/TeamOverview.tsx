import { Team, Standing } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormStrip } from "@/components/ui/Badge";

export function TeamOverview({ team, standing }: { team: Team; standing: Standing }) {
  return (
    <Card>
      <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
      <p className="text-sm text-[var(--muted-light)] mb-4 leading-relaxed">{team.summary}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Style of Play</h4>
          <p className="text-sm text-[var(--muted-light)]">{team.styleOfPlay}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Current Form</h4>
          <FormStrip form={standing.form} />
          {standing.played > 0 && (
            <p className="text-xs text-[var(--muted)] mt-1">
              Position {standing.position} in {team.group} | {standing.points} pts | GD: {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold text-[var(--success)] uppercase mb-2">Strengths</h4>
          <ul className="space-y-1">
            {team.strengths.map((s, i) => <li key={i} className="text-sm text-[var(--muted-light)] flex items-start gap-2"><span className="text-[var(--success)] mt-0.5">+</span> {s}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-[var(--danger)] uppercase mb-2">Weaknesses</h4>
          <ul className="space-y-1">
            {team.weaknesses.map((w, i) => <li key={i} className="text-sm text-[var(--muted-light)] flex items-start gap-2"><span className="text-[var(--danger)] mt-0.5">-</span> {w}</li>)}
          </ul>
        </div>
      </div>
    </Card>
  );
}
