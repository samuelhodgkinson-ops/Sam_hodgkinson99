// ISO 3166-1 alpha-2 codes for flag images via flagcdn.com
const teamToIso2: Record<string, string> = {
  'mexico': 'mx', 'south-africa': 'za', 'south-korea': 'kr', 'czechia': 'cz',
  'canada': 'ca', 'bosnia-herzegovina': 'ba', 'qatar': 'qa', 'switzerland': 'ch',
  'brazil': 'br', 'morocco': 'ma', 'haiti': 'ht', 'scotland': 'gb-sct',
  'united-states': 'us', 'paraguay': 'py', 'australia': 'au', 'turkey': 'tr',
  'germany': 'de', 'curacao': 'cw', 'cote-divoire': 'ci', 'ecuador': 'ec',
  'netherlands': 'nl', 'japan': 'jp', 'sweden': 'se', 'tunisia': 'tn',
  'belgium': 'be', 'egypt': 'eg', 'iran': 'ir', 'new-zealand': 'nz',
  'spain': 'es', 'cabo-verde': 'cv', 'saudi-arabia': 'sa', 'uruguay': 'uy',
  'france': 'fr', 'senegal': 'sn', 'iraq': 'iq', 'norway': 'no',
  'argentina': 'ar', 'algeria': 'dz', 'austria': 'at', 'jordan': 'jo',
  'portugal': 'pt', 'congo-dr': 'cd', 'uzbekistan': 'uz', 'colombia': 'co',
  'england': 'gb-eng', 'croatia': 'hr', 'ghana': 'gh', 'panama': 'pa',
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
