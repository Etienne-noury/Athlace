export interface WaldecCandidate {
  sigle: string;
  discipline: string;
  keywords?: string[];
}

export const WALDEC_NON_CLUB_CODES = new Set(['011400']);

export const WALDEC_MAP: Record<string, WaldecCandidate[]> = {
  '011000': [{ sigle: 'N/A', discipline: 'N/A' }],
  '011004': [
    { sigle: 'FFFORCE', discipline: 'Force', keywords: ['force', 'musculation'] },
    { sigle: 'FFGYM', discipline: 'Gymnastique / Fitness' },
  ],
  '011005': [{ sigle: 'FFA', discipline: 'Athlétisme' }],
  '011010': [
    { sigle: 'FFAVIRON', discipline: 'Aviron', keywords: ['aviron'] },
    { sigle: 'FFCK', discipline: 'Canoë-kayak', keywords: ['kayak', 'canoe', 'canoë', 'pagaie'] },
  ],
  '011015': [
    { sigle: 'FFBAD', discipline: 'Badminton', keywords: ['badminton'] },
    { sigle: 'FFSQUASH', discipline: 'Squash', keywords: ['squash'] },
    { sigle: 'FFPB', discipline: 'Pelote basque', keywords: ['pelote'] },
  ],
  '011018': [{ sigle: 'FFBS', discipline: 'Baseball / Softball' }],
  '011020': [{ sigle: 'FFBB', discipline: 'Basket-ball' }],
  '011025': [
    { sigle: 'FFB-BIL', discipline: 'Billard', keywords: ['billard'] },
    { sigle: 'FFBSQ', discipline: 'Bowling / Quilles', keywords: ['bowling', 'quille'] },
  ],
  '011030': [
    { sigle: 'FFSBFDA', discipline: 'Savate / Boxe française', keywords: ['savate'] },
    { sigle: 'FFKMDA', discipline: 'Kick-boxing / Muay-thaï', keywords: ['kick', 'muay'] },
    { sigle: 'FFBABA', discipline: 'Boxe américaine', keywords: ['americaine'] },
    { sigle: 'FFB', discipline: 'Boxe' },
  ],
  '011035': [
    { sigle: 'FFVELO', discipline: 'Cyclotourisme / VTT loisir', keywords: ['vtt', 'cyclotourisme'] },
    { sigle: 'FFC', discipline: 'Cyclisme' },
  ],
  '011040': [{ sigle: 'FFDANSE', discipline: 'Danse' }],
  '011045': [
    { sigle: 'FFP', discipline: 'Polo', keywords: ['polo'] },
    { sigle: 'FFE-EQ', discipline: 'Équitation' },
  ],
  '011050': [
    { sigle: 'FFS', discipline: 'Spéléologie', keywords: ['speleo'] },
    { sigle: 'FFCAM', discipline: 'Clubs alpins', keywords: ['alpin'] },
    { sigle: 'FFME', discipline: 'Montagne / Escalade' },
  ],
  '011055': [{ sigle: 'FFE', discipline: 'Escrime' }],
  '011060': [
    { sigle: 'FFDF', discipline: 'Flying disc', keywords: ['disc', 'frisbee'] },
    { sigle: 'FFJTC', discipline: 'Javelot / Tir sur cible' },
  ],
  '011065': [{ sigle: 'FFGYM', discipline: 'Gym volontaire / Entretien' }],
  '011070': [
    { sigle: 'FFR13', discipline: 'Rugby à XIII', keywords: ['rugby'] },
    { sigle: 'FFFA', discipline: 'Football américain / Flag' },
  ],
  '011075': [{ sigle: 'FFF', discipline: 'Football' }],
  '011080': [{ sigle: 'FFGOLF', discipline: 'Golf' }],
  '011085': [
    { sigle: 'FFDTB', discipline: 'Twirling bâton', keywords: ['twirling'] },
    { sigle: 'FFGYM', discipline: 'Gymnastique' },
  ],
  '011090': [
    { sigle: 'FFFORCE', discipline: 'Force', keywords: ['force'] },
    { sigle: 'FFHM', discipline: 'Haltérophilie / Musculation' },
  ],
  '011092': [
    { sigle: 'FFSA-AD', discipline: 'Sport adapté', keywords: ['adapte'] },
    { sigle: 'FFH-HDSP', discipline: 'Handisport' },
  ],
  '011095': [{ sigle: 'FFHB', discipline: 'Handball' }],
  '011100': [
    { sigle: 'FFHG', discipline: 'Hockey sur glace', keywords: ['glace'] },
    { sigle: 'FFRS', discipline: 'Roller / Skateboard', keywords: ['roller', 'skate'] },
    { sigle: 'FFH', discipline: 'Hockey sur gazon' },
  ],
  '011105': [{ sigle: 'FFJDA', discipline: 'Judo / Jujitsu' }],
  '011110': [{ sigle: 'FFSA', discipline: 'Sport automobile / Karting' }],
  '011115': [
    { sigle: 'FFTDA', discipline: 'Taekwondo', keywords: ['taekwondo'] },
    { sigle: 'FFKDA', discipline: 'Karaté' },
  ],
  '011120': [{ sigle: 'FFL', discipline: 'Lutte' }],
  '011125': [{ sigle: 'FFN', discipline: 'Natation' }],
  '011130': [
    { sigle: 'FFPSA', discipline: 'Pêche en apnée', keywords: ['apnee'] },
    { sigle: 'FFESSM', discipline: 'Sports sous-marins', keywords: ['sous-marin', 'sous marin', 'plongee'] },
    { sigle: 'FFPS', discipline: 'Pêche sportive' },
  ],
  '011135': [
    { sigle: 'FFSB', discipline: 'Sport boules', keywords: ['boule'] },
    { sigle: 'FFPJP', discipline: 'Pétanque' },
  ],
  '011140': [
    { sigle: 'FFCO', discipline: "Course d'orientation", keywords: ['orientation'] },
    { sigle: 'FFRP', discipline: 'Randonnée pédestre' },
  ],
  '011145': [{ sigle: 'FFRS', discipline: 'Roller / Skateboard' }],
  '011150': [{ sigle: 'FFR', discipline: 'Rugby' }],
  '011155': [
    { sigle: 'FFSG', discipline: 'Sports de glace', keywords: ['glace'] },
    { sigle: 'FFS-SKI', discipline: 'Ski' },
  ],
  '011160': [
    { sigle: 'FFPM', discipline: 'Pentathlon moderne', keywords: ['pentathlon'] },
    { sigle: 'FAEMC', discipline: 'Wushu / Arts énergétiques', keywords: ['wushu'] },
    { sigle: 'FFAB', discipline: 'Aïkido / Budo', keywords: ['budo'] },
    { sigle: 'FFAAA', discipline: 'Aïkido / Aïkibudo' },
  ],
  '011165': [{ sigle: 'FFM', discipline: 'Motocyclisme' }],
  '011170': [
    { sigle: 'FFSURF', discipline: 'Surf', keywords: ['surf'] },
    { sigle: 'FFSNW', discipline: 'Ski nautique / Wakeboard', keywords: ['kite', 'ski naut', 'wakeboard'] },
    { sigle: 'FFVOILE', discipline: 'Voile' },
  ],
  '011175': [
    { sigle: 'FFP-PARA', discipline: 'Parachutisme', keywords: ['parachut'] },
    { sigle: 'FFVV', discipline: 'Vol en planeur', keywords: ['planeur'] },
    { sigle: 'FFAM', discipline: 'Aéromodélisme', keywords: ['aeromodel'] },
    { sigle: 'FFVL', discipline: 'Vol libre' },
  ],
  '011180': [
    { sigle: 'FFT', discipline: 'Padel', keywords: ['padel'] },
    { sigle: 'FFT', discipline: 'Tennis' },
  ],
  '011185': [{ sigle: 'FFTT', discipline: 'Tennis de table' }],
  '011190': [
    { sigle: 'FFTA', discipline: "Tir à l'arc", keywords: ['arc'] },
    { sigle: 'FFBT', discipline: 'Ball-trap', keywords: ['ball-trap', 'ball trap'] },
    { sigle: 'FFTIR', discipline: 'Tir' },
  ],
  '011192': [{ sigle: 'FFVB', discipline: 'Volley-ball' }],
};

function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function resolveWaldec(
  waldecCode: string,
  titre: string,
  objet: string,
): { sigle: string; discipline: string } | null {
  const candidates = WALDEC_MAP[waldecCode];
  if (!candidates) return null;

  if (candidates.length === 1) return candidates[0];

  const hay = normalize(`${titre} ${objet}`);
  for (const c of candidates) {
    if (c.keywords?.some((kw) => hay.includes(kw))) return c;
  }
  return candidates[0];
}
