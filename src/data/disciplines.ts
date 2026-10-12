export interface Discipline {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  popularity: number; // 1-10
  clubCount: number;
  parentId?: string; // For sub-disciplines/variants
}

export interface SportNode {
  name: string;
  icon: string;
  popularity?: number;
  /** Sigles des fédérations (federations_sportives.sigle) */
  feds: string[];
  /** Valeurs exactes de clubs.discipline */
  match: string[];
  /** Valeurs exactes de clubs.sub_disciplines (dance_families pour la Danse) */
  subs: string[];
  /** Offres (pas des sous-disciplines) */
  offers?: string[];
  /** Offres handi (pas des sous-disciplines) */
  handi?: string[];
}

export interface CategoryNode {
  id: string;
  name: string;
  color: string;
  icon: string;
  sports: SportNode[];
}

export function slugifyDiscipline(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Arborescence officielle Athlace : catégories → sports → sous-disciplines.
 */
export const ARBORESCENCE: CategoryNode[] = [
  {
    id: "collectif",
    name: "Sports collectifs",
    color: "bg-primary",
    icon: "⚽",
    sports: [
      {"name":"Football","icon":"⚽","popularity":10,"feds":["FFF"],"match":["Football"],"subs":[]},
      {"name":"Football américain","icon":"🏈","popularity":5,"feds":["FFFA"],"match":["Football américain"],"subs":[]},
      {"name":"Rugby","icon":"🏉","popularity":8,"feds":["FFR"],"match":["Rugby"],"subs":["Compétition à XV","Compétition à X","Compétition à 7","Rugby à 5 Loisir - Bien être","Rugby Loisir avec plaquage","Rugby Santé","Beach","Rugby Entreprises"],"offers":["Ecole de Rugby","Baby Rugby"]},
      {"name":"Rugby à XIII","icon":"🏉","popularity":5,"feds":["FFR13"],"match":["Rugby à XIII"],"subs":[]},
      {"name":"Basketball","icon":"🏀","popularity":9,"feds":["FFBB"],"match":["Basketball"],"subs":[]},
      {"name":"Handball","icon":"🤾","popularity":8,"feds":["FFHB"],"match":["Handball"],"subs":["Handball à 7","Hand à 4","HandFit","Beach Handball"],"offers":["BabyHand"],"handi":["ParaHand"]},
      {"name":"Volley","icon":"🏐","popularity":7,"feds":["FFVB"],"match":["Volley"],"subs":[]},
      {"name":"Hockey sur gazon","icon":"🏑","popularity":4,"feds":["FFH"],"match":["Hockey (sur gazon)","Hockey sur gazon"],"subs":[]},
      {"name":"Hockey sur glace","icon":"🏒","popularity":5,"feds":["FFHG"],"match":["Hockey sur glace"],"subs":[]},
      {"name":"Baseball, softball","icon":"⚾","popularity":3,"feds":["FFBS"],"match":["Baseball, softball"],"subs":[]},
      {"name":"Ultimate et disc","icon":"🥏","popularity":3,"feds":["FFDF"],"match":["Flying disc","Ultimate et disc"],"subs":[]},
      {"name":"Polo","icon":"🐎","popularity":2,"feds":["FFP"],"match":["Polo"],"subs":[]},
    ],
  },
  {
    id: "raquette",
    name: "Sports de raquette",
    color: "bg-blue-500",
    icon: "🎾",
    sports: [
      {"name":"Tennis","icon":"🎾","popularity":9,"feds":["FFT"],"match":["Tennis"],"subs":[]},
      {"name":"Badminton","icon":"🏸","popularity":7,"feds":["FFBAD"],"match":["Badminton"],"subs":[]},
      {"name":"Tennis de table","icon":"🏓","popularity":7,"feds":["FFTT"],"match":["Tennis de table"],"subs":[]},
      {"name":"Squash","icon":"🎾","popularity":4,"feds":["FFSQUASH"],"match":["Squash"],"subs":[]},
    ],
  },
  {
    id: "aquatique",
    name: "Sports aquatiques",
    color: "bg-blue-500",
    icon: "🏊",
    sports: [
      {"name":"Natation","icon":"🏊","popularity":9,"feds":["FFN"],"match":["Natation"],"subs":[]},
      {"name":"Plongée et sports sous-marins","icon":"🤿","popularity":5,"feds":["FFESSM"],"match":["Études et sports sous-marins","Plongée et sports sous-marins"],"subs":["Plongée sous-marine","Rando Sub","Apnée","Plongée Nitrox","Environnement et Bio","Nage avec palmes","Photo et Vidéo","Plongée recycleur","Nage en eau vive","Plongée Trimix","Orientation","Pêche sous-marine","Tir sur cible","Hockey","Plongée souterraine","Archéologie","Sirènes & Tritons"],"offers":["Plongée enfant"]},
      {"name":"Chasse sous-marine","icon":"🐟","popularity":2,"feds":["FFPSA"],"match":["Pêche sportive en apnée","Chasse sous-marine"],"subs":[]},
      {"name":"Voile","icon":"⛵","popularity":6,"feds":["FFVOILE"],"match":["Voile"],"subs":[]},
      {"name":"Aviron","icon":"🚣","popularity":5,"feds":["FFAVIRON"],"match":["Aviron"],"subs":[]},
      {"name":"Canoë-kayak","icon":"🛶","popularity":5,"feds":["FFCK"],"match":["Canoë-kayak"],"subs":[]},
      {"name":"Surf","icon":"🏄","popularity":5,"feds":["FFSURF"],"match":["Surf"],"subs":[]},
      {"name":"Ski nautique et wakeboard","icon":"🎿","popularity":3,"feds":["FFSNW"],"match":["Ski nautique et wakeboard"],"subs":[]},
      {"name":"Motonautique","icon":"🚤","popularity":2,"feds":["FFMN"],"match":["Motonautique"],"subs":[]},
      {"name":"Sauvetage et secourisme","icon":"🛟","popularity":3,"feds":["FFSS"],"match":["Sauvetage et secourisme"],"subs":["Secourisme Opérationnel","Sauvetage Sportif"],"offers":["Formations"]},
    ],
  },
  {
    id: "combat",
    name: "Combat et arts martiaux",
    color: "bg-blue-500",
    icon: "🥋",
    sports: [
      {"name":"Judo-jujitsu","icon":"🥋","popularity":8,"feds":["FFJDA"],"match":["Judo-jujitsu"],"subs":["Judo","Taïso","Jujitsu","Kendo","Self-défense","Kata","Iaido","Ne-Waza","Kyudo","Sport chanbara","Jodo","Jiu-jitsu brésilien","Naginata"],"handi":["Para judo"]},
      {"name":"Karaté","icon":"🥋","popularity":7,"feds":["FFKDA"],"match":["Karaté"],"subs":[]},
      {"name":"Taekwondo","icon":"🥋","popularity":5,"feds":["FFTDA"],"match":["Taekwondo"],"subs":["Body Taekwondo","Taekwondo Impact","Taekwonkido","Hoshin Moosool"],"handi":["Handi Taekwondo"]},
      {"name":"Aïkido","icon":"🥋","popularity":4,"feds":["FFAAA","FFAB"],"match":["Aïkido, aïkibudo, kinomichi","Aïkido et budo","Aïkido"],"subs":[]},
      {"name":"Arts martiaux chinois","icon":"☯️","popularity":4,"feds":["FAEMC"],"match":["Arts énergétiques et martiaux chinois","Arts martiaux chinois"],"subs":[]},
      {"name":"Boxe anglaise","icon":"🥊","popularity":7,"feds":["FFB"],"match":["Boxe","Boxe anglaise"],"subs":["Boxe anglaise"],"offers":["École de boxe"]},
      {"name":"Savate boxe française","icon":"🥊","popularity":5,"feds":["FFSBFDA"],"match":["Savate/boxe française","Savate boxe française"],"subs":[]},
      {"name":"Kick-boxing, muay thaï","icon":"🥊","popularity":6,"feds":["FFKMDA"],"match":["Kick boxing, muay thaï","Kick-boxing, muay thaï"],"subs":[]},
      {"name":"Boxe américaine","icon":"🥊","popularity":4,"feds":["FFBABA"],"match":["Boxe américaine"],"subs":[]},
      {"name":"Lutte","icon":"🤼","popularity":4,"feds":["FFL"],"match":["Lutte"],"subs":["Lutte","Grappling","Sambo"]},
      {"name":"Escrime","icon":"🤺","popularity":5,"feds":["FFE"],"match":["Escrime"],"subs":[]},
    ],
  },
  {
    id: "athletisme",
    name: "Athlétisme et enchaînés",
    color: "bg-blue-500",
    icon: "🏃",
    sports: [
      {"name":"Athlétisme","icon":"🏃","popularity":9,"feds":["FFA"],"match":["Athlétisme"],"subs":[]},
      {"name":"Triathlon","icon":"🚴","popularity":6,"feds":["FFTRI"],"match":["Triathlon"],"subs":[]},
      {"name":"Pentathlon moderne","icon":"🏅","popularity":2,"feds":["FFPM"],"match":["Pentathlon moderne"],"subs":[]},
      {"name":"Course d'orientation","icon":"🧭","popularity":3,"feds":["FFCO"],"match":["Course d'orientation"],"subs":[]},
    ],
  },
  {
    id: "nature",
    name: "Nature et montagne",
    color: "bg-blue-500",
    icon: "🏔️",
    sports: [
      {"name":"Randonnée pédestre","icon":"🥾","popularity":8,"feds":["FFRP"],"match":["Randonnée pédestre"],"subs":["Randonnée pédestre","Raquette à neige","Marche nordique","Longe Côte - Marche Aquatique","Cyclotourisme","Marche d'Endurance","Ski de fond","Ski de randonnée (ou ski alpinisme)","Géocaching (caches et GPS) ou Randocaching®","Alpinisme"],"offers":["Randochallenges (Participation)"]},
      {"name":"Escalade","icon":"🧗","popularity":7,"feds":["FFME"],"match":["Montagne et escalade","Escalade"],"subs":[]},
      {"name":"Alpinisme et montagne","icon":"⛰️","popularity":5,"feds":["FFCAM"],"match":["Clubs alpins et de montagne","Alpinisme et montagne"],"subs":[]},
      {"name":"Spéléologie","icon":"🕳️","popularity":2,"feds":["FFS"],"match":["Spéléologie"],"subs":[]},
      {"name":"Cyclisme","icon":"🚴","popularity":8,"feds":["FFC"],"match":["Cyclisme"],"subs":[]},
      {"name":"Cyclotourisme","icon":"🚲","popularity":5,"feds":["FFVELO"],"match":["Cyclotourisme"],"subs":[]},
      {"name":"Équitation","icon":"🐴","popularity":7,"feds":["FFE-EQ"],"match":["Équitation"],"subs":[]},
      {"name":"Golf","icon":"⛳","popularity":6,"feds":["FFGOLF"],"match":["Golf"],"subs":[]},
      {"name":"Sports canins et traîneau","icon":"🐕","popularity":2,"feds":["FFST","FFPULKA","FFSLC"],"match":["Sports de traîneau/ski-VTT joëring/canicross","Pulka et traîneau à chiens","Sports et loisirs canins","Sports canins et traîneau"],"subs":[]},
      {"name":"Pêche sportive","icon":"🎣","popularity":3,"feds":["FFPS"],"match":["Pêches sportives","Pêche sportive"],"subs":[]},
    ],
  },
  {
    id: "glisse",
    name: "Glisse et hiver",
    color: "bg-blue-500",
    icon: "🎿",
    sports: [
      {"name":"Ski","icon":"⛷️","popularity":7,"feds":["FFS-SKI"],"match":["Ski"],"subs":["Ski Alpin","Snowboard","Ski de Fond","Ski de Randonnée","Biathlon","Rollerski","Ski Freestyle","Telemark","Randonnée Nordique","Ski sur Herbe","Saut à Ski","Combiné Nordique","Ski de Vitesse","Biathlon running","Hors piste – freeride","Ski Forme","Ski Santé"]},
      {"name":"Sports de glace","icon":"⛸️","popularity":5,"feds":["FFSG"],"match":["Sports de glace"],"subs":["Patinage artistique","Danse sur glace","Ballet sur glace","Curling","Patinage synchronisé","Sports Extreme","Short-Track","Glace Inline","Ice Cross","Freestyle","Bobsleigh","Luge","Skeleton"],"handi":["Para Sports de Glace"]},
      {"name":"Roller et skateboard","icon":"🛹","popularity":6,"feds":["FFRS"],"match":["Roller et skateboard"],"subs":[]},
      {"name":"Char à voile","icon":"🪁","popularity":2,"feds":["FFCV"],"match":["Char à voile"],"subs":[]},
    ],
  },
  {
    id: "forme",
    name: "Forme, danse et force",
    color: "bg-blue-500",
    icon: "💃",
    sports: [
      {"name":"Gymnastique","icon":"🤸","popularity":7,"feds":["FFGYM"],"match":["Gymnastique"],"subs":[]},
      {"name":"Danse","icon":"💃","popularity":7,"feds":["FFDANSE"],"match":["Danse"],"subs":["Modern jazz","Jazz","Danses hip-hop","Ateliers de création","Contemporain","Danses latines","Classique","Danses standards","Danses de salon","Salsa","Bachata","Rock'n'roll","Country & line","Danses ethniques","Zumba","Rock sauté","Barre au sol classique","Barre au sol contemporaine","West Coast Swing","Pole dance","Breaking","Kizomba","Cabaret","Boogie-Woogie","Lindy hop","Disco","Comédie musicale","Danses aériennes","Pole sport","Tango argentin","Danses latino-caraïbes","Claquettes","Afro-jazz","Rock acrobatique","Flamenco","Danses traditionnelles","Danse historique"]},
      {"name":"Haltérophilie, musculation et force","icon":"🏋️","popularity":5,"feds":["FFHM","FFFORCE"],"match":["Haltérophilie, musculation","Force","Haltérophilie, musculation et force"],"subs":[]},
      {"name":"Twirling bâton","icon":"🪄","popularity":2,"feds":["FFDTB"],"match":["Twirling bâton"],"subs":[]},
      {"name":"Double dutch","icon":"🪢","popularity":2,"feds":["FDDJR"],"match":["Double dutch-jump rope","Double dutch"],"subs":[]},
    ],
  },
  {
    id: "mecanique",
    name: "Sports mécaniques",
    color: "bg-blue-500",
    icon: "🏎️",
    sports: [
      {"name":"Sport automobile","icon":"🏎️","popularity":5,"feds":["FFSA"],"match":["Sport automobile"],"subs":[]},
      {"name":"Motocyclisme","icon":"🏍️","popularity":5,"feds":["FFM"],"match":["Motocyclisme"],"subs":[]},
      {"name":"Voitures radiocommandées","icon":"🚗","popularity":2,"feds":["FFVRC"],"match":["Voitures radio commandées","Voitures radiocommandées"],"subs":[]},
      {"name":"Aéromodélisme","icon":"🛩️","popularity":2,"feds":["FFAM"],"match":["Aéromodélisme"],"subs":[]},
    ],
  },
  {
    id: "aerien",
    name: "Sports aériens",
    color: "bg-blue-500",
    icon: "🪂",
    sports: [
      {"name":"Parachutisme","icon":"🪂","popularity":3,"feds":["FFP-PARA"],"match":["Parachutisme"],"subs":["Parachutisme","Ascensionnel","Parapente","Soufflerie"],"offers":["Tandem","PAC","Traditionnelle"]},
      {"name":"Vol en planeur","icon":"🛫","popularity":2,"feds":["FFVV"],"match":["Vol en planeur"],"subs":["Remorquage","ePlaneur","Motoplaneur","Treuil","Voltige"],"offers":["Vols Découverte","École de pilotage","Stage Découverte","Vol découverte voltige"],"handi":["Handiplaneur"]},
      {"name":"Vol libre","icon":"🪂","popularity":4,"feds":["FFVL"],"match":["Vol libre"],"subs":[]},
      {"name":"ULM","icon":"🛩️","popularity":2,"feds":["FFPLUM"],"match":["Planeur ultraléger motorisé","ULM"],"subs":[]},
      {"name":"Aviation","icon":"✈️","popularity":3,"feds":["FFA-AERO"],"match":["Aéronautique","Aviation"],"subs":[]},
      {"name":"Hélicoptère","icon":"🚁","popularity":1,"feds":["FFHELICO"],"match":["Hélicoptère"],"subs":[]},
      {"name":"Aérostation","icon":"🎈","popularity":2,"feds":["FFAERO"],"match":["Aérostation"],"subs":[]},
    ],
  },
  {
    id: "precision",
    name: "Précision et jeux",
    color: "bg-blue-500",
    icon: "🎯",
    sports: [
      {"name":"Tir sportif","icon":"🎯","popularity":5,"feds":["FFTIR"],"match":["Tir","Tir sportif"],"subs":[]},
      {"name":"Tir à l'arc","icon":"🏹","popularity":5,"feds":["FFTA"],"match":["Tir à l'arc"],"subs":[]},
      {"name":"Ball-trap","icon":"🔫","popularity":2,"feds":["FFBT"],"match":["Ball-trap"],"subs":[]},
      {"name":"Javelot tir sur cible","icon":"🎯","popularity":1,"feds":["FFJTC"],"match":["Javelot tir sur cible"],"subs":[]},
      {"name":"Billard","icon":"🎱","popularity":4,"feds":["FFB-BIL"],"match":["Billard"],"subs":["Carambole","Blackball","Américain","Snooker"]},
      {"name":"Bowling et quilles","icon":"🎳","popularity":4,"feds":["FFBSQ"],"match":["Bowling et sports de quilles","Bowling et quilles"],"subs":[]},
      {"name":"Pétanque et jeu provençal","icon":"🍡","popularity":7,"feds":["FFPJP"],"match":["Pétanque et jeu provençal"],"subs":[]},
      {"name":"Sport boules","icon":"🥎","popularity":4,"feds":["FFSB"],"match":["Sport boules"],"subs":[]},
      {"name":"Échecs","icon":"♟️","popularity":5,"feds":["FFE-ECH"],"match":["Échecs"],"subs":[]},
    ],
  },
  {
    id: "traditions",
    name: "Traditions régionales",
    color: "bg-blue-500",
    icon: "🎪",
    sports: [
      {"name":"Pelote basque","icon":"🪀","popularity":3,"feds":["FFPB"],"match":["Pelote basque"],"subs":[]},
      {"name":"Longue paume","icon":"🎾","popularity":2,"feds":["FFLP"],"match":["Longue paume"],"subs":[]},
      {"name":"Balle au tambourin","icon":"🥁","popularity":2,"feds":["FFJBT"],"match":["Jeu de balle au tambourin","Balle au tambourin"],"subs":[]},
      {"name":"Ballon au poing","icon":"🤜","popularity":2,"feds":["FFBAP"],"match":["Ballon au poing"],"subs":[]},
      {"name":"Course camarguaise","icon":"🐂","popularity":2,"feds":["FFCC"],"match":["Course camarguaise"],"subs":[]},
      {"name":"Course landaise","icon":"🐄","popularity":2,"feds":["FFCL"],"match":["Course landaise"],"subs":[]},
      {"name":"Joute et sauvetage nautique","icon":"🛶","popularity":2,"feds":["FFJSN"],"match":["Joute et sauvetage nautique"],"subs":[]},
    ],
  },
  {
    id: "handicap",
    name: "Sport et handicap",
    color: "bg-blue-500",
    icon: "♿",
    sports: [
      {"name":"Handisport","icon":"♿","popularity":5,"feds":["FFH-HDSP"],"match":["Handisport"],"subs":[]},
      {"name":"Sport adapté","icon":"🤝","popularity":4,"feds":["FFSA-AD"],"match":["Sport adapté"],"subs":[]},
    ],
  },
];

export const categories: Record<string, { name: string; color: string; icon: string }> =
  Object.fromEntries(
    ARBORESCENCE.map((c) => [c.id, { name: c.name, color: c.color, icon: c.icon }]),
  );

function buildDisciplines(): Discipline[] {
  const list: Discipline[] = [];
  const seen = new Set<string>();

  for (const category of ARBORESCENCE) {
    for (const sport of category.sports) {
      const sportId = slugifyDiscipline(sport.name);
      if (!seen.has(sportId)) {
        seen.add(sportId);
        list.push({
          id: sportId,
          name: sport.name,
          category: category.id,
          icon: sport.icon,
          description: `Trouvez un club de ${sport.name} près de chez vous.`,
          popularity: sport.popularity ?? 3,
          clubCount: 0,
        });
      }

      for (const sub of sport.subs) {
        const subId = `${sportId}--${slugifyDiscipline(sub)}`;
        if (seen.has(subId)) continue;
        seen.add(subId);
        list.push({
          id: subId,
          name: sub,
          category: category.id,
          icon: sport.icon,
          description: `${sub} — sous-discipline de ${sport.name}.`,
          popularity: Math.max(1, (sport.popularity ?? 3) - 2),
          clubCount: 0,
          parentId: sportId,
        });
      }
    }
  }

  return list;
}

export const disciplines: Discipline[] = buildDisciplines();

export const getPopularDisciplines = (limit = 8) =>
  disciplines
    .filter((d) => !d.parentId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

export const getDisciplinesByCategory = (category: string) =>
  disciplines.filter((d) => d.category === category && !d.parentId);

export const getDisciplineById = (id?: string | null) =>
  id ? disciplines.find((d) => d.id === id || slugifyDiscipline(d.name) === id) : undefined;

export const getParentDisciplines = () => disciplines.filter((d) => !d.parentId);

export const getSubDisciplines = (parentId: string) =>
  disciplines.filter((d) => d.parentId === parentId);

export const getAllDisciplinesWithVariants = () => disciplines;

export const getCategoryOfDiscipline = (id: string) => {
  const d = getDisciplineById(id);
  return d ? categories[d.category] : undefined;
};

const SPORT_NODES: Record<string, SportNode> = Object.fromEntries(
  ARBORESCENCE.flatMap((c) => c.sports.map((s) => [slugifyDiscipline(s.name), s])),
);

/**
 * Libellés à interroger en base (clubs.discipline) pour un sport : uniquement sport.match.
 */
export const getDisciplineQueryNames = (sportId?: string | null): string[] => {
  if (!sportId || sportId === 'all') return [];
  const sport = getDisciplineById(sportId);
  if (!sport) return [];
  const parent = sport.parentId ?? sport.id;
  const node = SPORT_NODES[parent];
  return node ? Array.from(new Set(node.match)) : [];
};

/**
 * Valeur exacte de sous-discipline à chercher dans clubs.sub_disciplines
 * (clubs.dance_families pour la Danse). null si aucune sous-discipline choisie.
 */
export const getSubDisciplineValue = (sportId?: string | null, subId?: string | null): string | null => {
  if (!sportId || sportId === 'all' || !subId || subId === 'all') return null;
  const sub = getDisciplineById(subId);
  if (!sub || !sub.parentId) return null;
  const sport = getDisciplineById(sportId);
  if (sport && sub.parentId !== sport.id) return null;
  return sub.name;
};
