// ISO 3166-1 alpha-2 codes for flag images via flagcdn.com
const teamToIso2: Record<string, string> = {
  'united-states': 'us', 'colombia': 'co', 'morocco': 'ma', 'mali': 'ml',
  'france': 'fr', 'cameroon': 'cm', 'ecuador': 'ec', 'uzbekistan': 'uz',
  'argentina': 'ar', 'japan': 'jp', 'tunisia': 'tn', 'peru': 'pe',
  'germany': 'de', 'uruguay': 'uy', 'south-korea': 'kr', 'bahrain': 'bh',
  'brazil': 'br', 'nigeria': 'ng', 'australia': 'au', 'tanzania': 'tz',
  'england': 'gb-eng', 'senegal': 'sn', 'paraguay': 'py', 'bolivia': 'bo',
  'spain': 'es', 'mexico': 'mx', 'canada': 'ca', 'suriname': 'sr',
  'netherlands': 'nl', 'iran': 'ir', 'honduras': 'hn', 'new-zealand': 'nz',
  'portugal': 'pt', 'italy': 'it', 'saudi-arabia': 'sa', 'indonesia': 'id',
  'belgium': 'be', 'croatia': 'hr', 'venezuela': 've', 'panama': 'pa',
  'serbia': 'rs', 'denmark': 'dk', 'qatar': 'qa', 'costa-rica': 'cr',
  'switzerland': 'ch', 'scotland': 'gb-sct', 'turkey': 'tr', 'jamaica': 'jm',
};

export function getFlagUrl(teamId: string, width: number = 40): string {
  const iso = teamToIso2[teamId];
  if (!iso) return '';
  return `https://flagcdn.com/w${width}/${iso}.png`;
}

export function getFlagSrcSet(teamId: string, width: number = 40): string {
  const iso = teamToIso2[teamId];
  if (!iso) return '';
  return `https://flagcdn.com/w${width * 2}/${iso}.png 2x`;
}

export function getIso2(teamId: string): string {
  return teamToIso2[teamId] || '';
}
