import { Match } from '@/types';

// Prototype: Fixtures involving England (Group F), Netherlands (Group H), Canada (Group G), Australia (Group E)
// Plus placeholder opponents for group matches
export const matches: Match[] = [
  // === Group E: Australia matches ===
  { id: 'm01', homeTeamId: 'australia', awayTeamId: 'placeholder-e1', date: '2026-06-12', time: '18:00', venue: 'AT&T Stadium', city: 'Dallas', stage: 'Group Stage', group: 'Group E', isCompleted: false },
  { id: 'm02', homeTeamId: 'placeholder-e2', awayTeamId: 'australia', date: '2026-06-17', time: '21:00', venue: 'NRG Stadium', city: 'Houston', stage: 'Group Stage', group: 'Group E', isCompleted: false },
  { id: 'm03', homeTeamId: 'australia', awayTeamId: 'placeholder-e3', date: '2026-06-22', time: '18:00', venue: 'SoFi Stadium', city: 'Los Angeles', stage: 'Group Stage', group: 'Group E', isCompleted: false },

  // === Group F: England matches ===
  { id: 'm04', homeTeamId: 'england', awayTeamId: 'placeholder-f1', date: '2026-06-13', time: '21:00', venue: 'MetLife Stadium', city: 'East Rutherford', stage: 'Group Stage', group: 'Group F', isCompleted: false },
  { id: 'm05', homeTeamId: 'placeholder-f2', awayTeamId: 'england', date: '2026-06-18', time: '18:00', venue: 'Hard Rock Stadium', city: 'Miami', stage: 'Group Stage', group: 'Group F', isCompleted: false },
  { id: 'm06', homeTeamId: 'england', awayTeamId: 'placeholder-f3', date: '2026-06-23', time: '21:00', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'Group Stage', group: 'Group F', isCompleted: false },

  // === Group G: Canada matches ===
  { id: 'm07', homeTeamId: 'canada', awayTeamId: 'placeholder-g1', date: '2026-06-14', time: '18:00', venue: 'BMO Field', city: 'Toronto', stage: 'Group Stage', group: 'Group G', isCompleted: false },
  { id: 'm08', homeTeamId: 'placeholder-g2', awayTeamId: 'canada', date: '2026-06-19', time: '21:00', venue: 'BC Place', city: 'Vancouver', stage: 'Group Stage', group: 'Group G', isCompleted: false },
  { id: 'm09', homeTeamId: 'canada', awayTeamId: 'placeholder-g3', date: '2026-06-24', time: '18:00', venue: 'BMO Field', city: 'Toronto', stage: 'Group Stage', group: 'Group G', isCompleted: false },

  // === Group H: Netherlands matches ===
  { id: 'm10', homeTeamId: 'netherlands', awayTeamId: 'placeholder-h1', date: '2026-06-15', time: '21:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'Group Stage', group: 'Group H', isCompleted: false },
  { id: 'm11', homeTeamId: 'placeholder-h2', awayTeamId: 'netherlands', date: '2026-06-20', time: '18:00', venue: 'Lumen Field', city: 'Seattle', stage: 'Group Stage', group: 'Group H', isCompleted: false },
  { id: 'm12', homeTeamId: 'netherlands', awayTeamId: 'placeholder-h3', date: '2026-06-25', time: '21:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', stage: 'Group Stage', group: 'Group H', isCompleted: false },
];
