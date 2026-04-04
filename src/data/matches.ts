import { Match } from '@/types';

// All 72 group stage matches for the 2026 FIFA World Cup
// 12 groups x 6 matches each (round-robin within each group of 4)

const venues = [
  { venue: 'MetLife Stadium', city: 'East Rutherford' },
  { venue: 'SoFi Stadium', city: 'Los Angeles' },
  { venue: 'AT&T Stadium', city: 'Dallas' },
  { venue: 'Hard Rock Stadium', city: 'Miami' },
  { venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { venue: 'Lumen Field', city: 'Seattle' },
  { venue: 'NRG Stadium', city: 'Houston' },
  { venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { venue: 'Estadio Azteca', city: 'Mexico City' },
  { venue: 'Estadio BBVA', city: 'Monterrey' },
  { venue: 'Estadio Akron', city: 'Guadalajara' },
  { venue: 'BMO Field', city: 'Toronto' },
  { venue: 'BC Place', city: 'Vancouver' },
];

type GroupDef = { group: string; teams: [string, string, string, string] };

const groups: GroupDef[] = [
  { group: 'Group A', teams: ['united-states', 'colombia', 'morocco', 'mali'] },
  { group: 'Group B', teams: ['france', 'cameroon', 'ecuador', 'uzbekistan'] },
  { group: 'Group C', teams: ['argentina', 'japan', 'tunisia', 'peru'] },
  { group: 'Group D', teams: ['germany', 'uruguay', 'south-korea', 'bahrain'] },
  { group: 'Group E', teams: ['brazil', 'nigeria', 'australia', 'tanzania'] },
  { group: 'Group F', teams: ['england', 'senegal', 'paraguay', 'bolivia'] },
  { group: 'Group G', teams: ['spain', 'mexico', 'canada', 'suriname'] },
  { group: 'Group H', teams: ['netherlands', 'iran', 'honduras', 'new-zealand'] },
  { group: 'Group I', teams: ['portugal', 'italy', 'saudi-arabia', 'indonesia'] },
  { group: 'Group J', teams: ['belgium', 'croatia', 'venezuela', 'panama'] },
  { group: 'Group K', teams: ['serbia', 'denmark', 'qatar', 'costa-rica'] },
  { group: 'Group L', teams: ['switzerland', 'scotland', 'turkey', 'jamaica'] },
];

// Match day schedule: MD1 = Jun 11-14, MD2 = Jun 17-20, MD3 = Jun 23-26
const matchDayDates = [
  ['2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14'], // MD1 spread
  ['2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20'], // MD2 spread
  ['2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26'], // MD3 spread
];
const times = ['18:00', '21:00', '00:00'];

function generateGroupMatches(g: GroupDef, groupIndex: number): Match[] {
  const [t1, t2, t3, t4] = g.teams;
  const baseId = groupIndex * 6 + 1;
  const dateSet = groupIndex % 4; // spread groups across 4 days per MD

  // MD1: t1 vs t3, t2 vs t4
  // MD2: t1 vs t4, t2 vs t3
  // MD3: t1 vs t2, t3 vs t4 (simultaneous)
  const pairings: [string, string, number, number][] = [
    [t1, t3, 0, 0], // MD1, time slot 0
    [t2, t4, 0, 1], // MD1, time slot 1
    [t1, t4, 1, 0], // MD2, time slot 0
    [t2, t3, 1, 1], // MD2, time slot 1
    [t1, t2, 2, 0], // MD3, time slot 0
    [t3, t4, 2, 0], // MD3, same time (FIFA rule)
  ];

  return pairings.map(([home, away, md, timeSlot], i) => ({
    id: `m${String(baseId + i).padStart(3, '0')}`,
    homeTeamId: home,
    awayTeamId: away,
    date: matchDayDates[md][dateSet],
    time: times[timeSlot],
    venue: venues[(groupIndex * 3 + i) % venues.length].venue,
    city: venues[(groupIndex * 3 + i) % venues.length].city,
    stage: 'Group Stage' as const,
    group: g.group,
    isCompleted: false,
  }));
}

export const matches: Match[] = groups.flatMap((g, i) => generateGroupMatches(g, i));
