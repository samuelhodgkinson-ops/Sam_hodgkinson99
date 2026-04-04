import { DataSource } from '@/types';

export const dataSources: DataSource[] = [
  { domain: 'Fixtures & Results', source: 'FIFA.com', sourceUrl: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', lastUpdated: '2026-04-04T00:00:00Z', confidence: 'verified' },
  { domain: 'Standings', source: 'FIFA.com', sourceUrl: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', lastUpdated: '2026-04-04T00:00:00Z', confidence: 'verified' },
  { domain: 'FIFA Rankings', source: 'FIFA.com', sourceUrl: 'https://www.fifa.com/fifa-world-ranking/men', lastUpdated: '2026-04-04T00:00:00Z', confidence: 'verified' },
  { domain: 'Squad Lists', source: 'Official federation sites', sourceUrl: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', lastUpdated: '2026-04-04T00:00:00Z', confidence: 'provisional' },
];
