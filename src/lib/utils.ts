import { Team, Standing, Match, RecentResult, MatchResult, Player, TeamStats } from '@/types';

export function getTeamById(teams: Team[], id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getGroupStandings(standings: Standing[], group: string): Standing[] {
  return standings
    .filter(s => s.group === group)
    .sort((a, b) => b.points !== a.points ? b.points - a.points : b.goalDifference !== a.goalDifference ? b.goalDifference - a.goalDifference : b.goalsFor - a.goalsFor);
}

export function getTeamMatches(matches: Match[], teamId: string): Match[] {
  return matches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

export function getTeamUpcomingFixtures(matches: Match[], teamId: string): Match[] {
  return getTeamMatches(matches, teamId).filter(m => !m.isCompleted).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getTeamCompletedMatches(matches: Match[], teamId: string): Match[] {
  return getTeamMatches(matches, teamId).filter(m => m.isCompleted).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNextMatch(matches: Match[], teamId: string): Match | undefined {
  return getTeamUpcomingFixtures(matches, teamId)[0];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatMatchDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function getCountdown(dateStr: string, time: string): string {
  const target = new Date(`${dateStr}T${time}:00Z`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return 'Started';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h ${Math.floor((diff % 3600000) / 60000)}m`;
}

export function getKeyPlayers(squad: Player[]): Player[] {
  return squad.filter(p => p.isKeyPlayer).sort((a, b) => b.caps - a.caps);
}

export function getSquadAverageAge(squad: Player[]): number {
  if (!squad.length) return 0;
  return Math.round((squad.reduce((s, p) => s + p.age, 0) / squad.length) * 10) / 10;
}

export function sortTeams(teams: Team[], sortBy: string, standings?: Standing[]): Team[] {
  const sorted = [...teams];
  switch (sortBy) {
    case 'alphabetical': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'ranking': return sorted.sort((a, b) => a.fifaRanking - b.fifaRanking);
    case 'group': return sorted.sort((a, b) => a.group.localeCompare(b.group) || a.fifaRanking - b.fifaRanking);
    default: return sorted;
  }
}

export function filterTeams(teams: Team[], filters: { search?: string; group?: string; confederation?: string }): Team[] {
  let result = teams;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.coach.toLowerCase().includes(q));
  }
  if (filters.group) result = result.filter(t => t.group === filters.group);
  if (filters.confederation) result = result.filter(t => t.confederation === filters.confederation);
  return result;
}

// Realistic recent pre-tournament results per confederation
const recentOpponents: Record<string, { opponents: string[]; competitions: string[] }> = {
  UEFA: { opponents: ['France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Belgium', 'Netherlands', 'Croatia', 'Switzerland', 'Denmark', 'Austria', 'Sweden', 'Norway', 'Poland', 'Czech Republic', 'Scotland', 'Turkey', 'Serbia', 'Hungary', 'Romania', 'Greece', 'Ukraine', 'Wales', 'Finland', 'Iceland', 'Ireland', 'Bosnia', 'Slovakia', 'Albania', 'Montenegro'], competitions: ['UEFA Nations League', 'Friendly', 'WC Qualifier'] },
  CONMEBOL: { opponents: ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Ecuador', 'Paraguay', 'Peru', 'Venezuela', 'Bolivia'], competitions: ['WC Qualifier', 'Copa America', 'Friendly'] },
  CONCACAF: { opponents: ['Mexico', 'United States', 'Canada', 'Costa Rica', 'Jamaica', 'Honduras', 'Panama', 'El Salvador', 'Guatemala', 'Trinidad & Tobago'], competitions: ['CONCACAF Nations League', 'WC Qualifier', 'Friendly'] },
  CAF: { opponents: ['Senegal', 'Morocco', 'Nigeria', 'Egypt', 'Cameroon', 'Algeria', 'Ghana', 'Ivory Coast', 'Tunisia', 'Mali', 'DR Congo', 'South Africa', 'Burkina Faso', 'Tanzania'], competitions: ['AFCON Qualifier', 'WC Qualifier', 'Friendly'] },
  AFC: { opponents: ['Japan', 'South Korea', 'Iran', 'Australia', 'Saudi Arabia', 'Qatar', 'Iraq', 'Uzbekistan', 'UAE', 'Oman', 'China', 'Bahrain', 'Jordan', 'Indonesia'], competitions: ['AFC Asian Cup', 'WC Qualifier', 'Friendly'] },
  OFC: { opponents: ['New Zealand', 'Fiji', 'Papua New Guinea', 'New Caledonia', 'Solomon Islands', 'Tahiti', 'Vanuatu', 'Samoa'], competitions: ['OFC Nations Cup', 'WC Qualifier', 'Friendly'] },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function generateRecentResults(team: Team): RecentResult[] {
  const confData = recentOpponents[team.confederation] || recentOpponents.UEFA;
  const availableOpponents = confData.opponents.filter(o => o !== team.name && o !== team.shortName);
  const rand = seededRandom(team.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const outcomes: MatchResult[] = ['W', 'D', 'W', 'L', 'W'];
  const scores = ['2-0', '1-1', '3-1', '0-1', '1-0'];
  // Pick 5 different opponents deterministically
  const shuffled = [...availableOpponents].sort(() => rand() - 0.5);

  return outcomes.map((result, i) => ({
    matchId: `pre-${team.id}-${i}`,
    opponent: shuffled[i % shuffled.length],
    opponentId: 'pre-tournament',
    date: `2026-0${3 + Math.floor(i / 3)}-${String(10 + i * 5).padStart(2, '0')}`,
    score: scores[i],
    result,
    competition: confData.competitions[i % confData.competitions.length],
    venue: 'Neutral',
  }));
}

export function generateTeamStats(team: Team): TeamStats {
  const r = team.fifaRanking;
  return {
    teamId: team.id, matchesPlayed: 0, wins: 0, draws: 0, losses: 0,
    goalsScored: 0, goalsConceded: 0, goalDifference: 0, cleanSheets: 0,
    possessionAvg: 50 + Math.round((100 - r) / 10),
    shotsPerGame: 10 + Math.round((100 - r) / 15),
    shotsOnTargetPerGame: 4 + Math.round((100 - r) / 25),
    passAccuracy: 75 + Math.round((100 - r) / 12),
    corners: 0, fouls: 0, yellowCards: 0, redCards: 0,
  };
}

export function getAllConfederations(): string[] {
  return ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
}
