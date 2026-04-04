import { Standing } from '@/types';

// Initial standings for all 48 teams across 12 groups
// Positions based on FIFA ranking within each group

type GroupEntry = { teams: string[]; positions: number[] };

const groupData: { group: string; entries: GroupEntry }[] = [
  { group: 'Group A', entries: { teams: ['united-states', 'colombia', 'morocco', 'mali'], positions: [1, 2, 3, 4] } },
  { group: 'Group B', entries: { teams: ['france', 'cameroon', 'ecuador', 'uzbekistan'], positions: [1, 3, 2, 4] } },
  { group: 'Group C', entries: { teams: ['argentina', 'japan', 'tunisia', 'peru'], positions: [1, 2, 3, 4] } },
  { group: 'Group D', entries: { teams: ['germany', 'uruguay', 'south-korea', 'bahrain'], positions: [1, 2, 3, 4] } },
  { group: 'Group E', entries: { teams: ['brazil', 'nigeria', 'australia', 'tanzania'], positions: [1, 2, 3, 4] } },
  { group: 'Group F', entries: { teams: ['england', 'senegal', 'paraguay', 'bolivia'], positions: [1, 2, 3, 4] } },
  { group: 'Group G', entries: { teams: ['spain', 'mexico', 'canada', 'suriname'], positions: [1, 2, 3, 4] } },
  { group: 'Group H', entries: { teams: ['netherlands', 'iran', 'honduras', 'new-zealand'], positions: [1, 2, 3, 4] } },
  { group: 'Group I', entries: { teams: ['portugal', 'italy', 'saudi-arabia', 'indonesia'], positions: [1, 2, 3, 4] } },
  { group: 'Group J', entries: { teams: ['belgium', 'croatia', 'venezuela', 'panama'], positions: [1, 2, 3, 4] } },
  { group: 'Group K', entries: { teams: ['serbia', 'denmark', 'qatar', 'costa-rica'], positions: [2, 1, 3, 4] } },
  { group: 'Group L', entries: { teams: ['switzerland', 'scotland', 'turkey', 'jamaica'], positions: [1, 3, 2, 4] } },
];

export const standings: Standing[] = groupData.flatMap(({ group, entries }) =>
  entries.teams.map((teamId, i) => ({
    teamId,
    group,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    position: entries.positions[i],
    form: [],
  }))
);
