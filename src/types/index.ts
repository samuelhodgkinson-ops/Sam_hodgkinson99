export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
export type MatchResult = 'W' | 'D' | 'L';
export type MatchStage = 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarter-final' | 'Semi-final' | 'Third-place play-off' | 'Final';
export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
export type PlayerStatus = 'Available' | 'Injured' | 'Suspended' | 'Doubtful';
export type TournamentStatus = 'Group Stage' | 'Qualified for Knockout' | 'Eliminated' | 'Round of 32' | 'Round of 16' | 'Quarter-finals' | 'Semi-finals' | 'Third Place' | 'Final' | 'Champion' | 'Runner-up';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  flag: string;
  confederation: Confederation;
  group: string;
  fifaRanking: number;
  coach: string;
  tournamentStatus: TournamentStatus;
  qualificationRoute: string;
  summary: string;
  styleOfPlay: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Player {
  id: string;
  name: string;
  shirtNumber: number;
  position: PlayerPosition;
  club: string;
  age: number;
  caps: number;
  goals: number;
  tournamentMinutes: number;
  tournamentGoals: number;
  tournamentAssists: number;
  status: PlayerStatus;
  isStarter: boolean;
  isCaptain: boolean;
  isKeyPlayer: boolean;
  keyPlayerRole?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  stage: MatchStage;
  group?: string;
  homeScore?: number;
  awayScore?: number;
  isCompleted: boolean;
}

export interface Standing {
  teamId: string;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
  form: MatchResult[];
}

export interface TeamStats {
  teamId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  cleanSheets: number;
  possessionAvg: number;
  shotsPerGame: number;
  shotsOnTargetPerGame: number;
  passAccuracy: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

export interface RecentResult {
  matchId: string;
  opponent: string;
  opponentId: string;
  date: string;
  score: string;
  result: MatchResult;
  competition: string;
  venue?: string;
}

export interface DataSource {
  domain: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  confidence: 'verified' | 'provisional' | 'unverified';
}
