import { Standing } from '@/types';

// Initial standings for all 48 teams across 12 groups
// Positions based on FIFA ranking within each group

type GroupEntry = { teams: string[]; positions: number[] };

const groupData: { group: string; entries: GroupEntry }[] = [
  { group: 'Group A', entries: { teams: ['mexico', 'south-africa', 'south-korea', 'czechia'], positions: [1, 3, 2, 4] } },
  { group: 'Group B', entries: { teams: ['canada', 'bosnia-herzegovina', 'qatar', 'switzerland'], positions: [3, 4, 2, 1] } },
  { group: 'Group C', entries: { teams: ['brazil', 'morocco', 'haiti', 'scotland'], positions: [1, 2, 4, 3] } },
  { group: 'Group D', entries: { teams: ['united-states', 'paraguay', 'australia', 'turkey'], positions: [1, 4, 3, 2] } },
  { group: 'Group E', entries: { teams: ['germany', 'curacao', 'cote-divoire', 'ecuador'], positions: [1, 4, 3, 2] } },
  { group: 'Group F', entries: { teams: ['netherlands', 'japan', 'sweden', 'tunisia'], positions: [1, 2, 3, 4] } },
  { group: 'Group G', entries: { teams: ['belgium', 'egypt', 'iran', 'new-zealand'], positions: [1, 3, 2, 4] } },
  { group: 'Group H', entries: { teams: ['spain', 'cabo-verde', 'saudi-arabia', 'uruguay'], positions: [1, 4, 3, 2] } },
  { group: 'Group I', entries: { teams: ['france', 'senegal', 'iraq', 'norway'], positions: [1, 3, 4, 2] } },
  { group: 'Group J', entries: { teams: ['argentina', 'algeria', 'austria', 'jordan'], positions: [1, 3, 2, 4] } },
  { group: 'Group K', entries: { teams: ['portugal', 'congo-dr', 'uzbekistan', 'colombia'], positions: [1, 4, 3, 2] } },
  { group: 'Group L', entries: { teams: ['england', 'croatia', 'ghana', 'panama'], positions: [1, 2, 4, 3] } },
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
