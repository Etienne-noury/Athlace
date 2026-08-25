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
  subs: string[];
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
    id: 'collectif',
    name: 'Sports collectifs',
    color: 'bg-primary',
    icon: '⚽',
    sports: [
      { name: 'Football', icon: '⚽', popularity: 10, subs: ['Football sur herbe', 'Football en salle (Futsal)', 'Beach soccer', 'Cécifoot'] },
      { name: 'Football américain', icon: '🏈', popularity: 5, subs: ['Football américain', 'Flag'] },
      { name: 'Rugby', icon: '🏉', popularity: 8, subs: ['Rugby à XV', 'Rugby à 7', 'Rugby à X'] },
      { name: 'Rugby à XIII', icon: '🏉', popularity: 5, subs: ['Rugby à XIII', 'Rugby à VII', 'Rugby fauteuil'] },
      { name: 'Basketball', icon: '🏀', popularity: 9, subs: ['Basket-ball 5x5', 'Basket 3x3'] },
      { name: 'Handball', icon: '🤾', popularity: 8, subs: ['Handball', 'Mini-hand', 'Handball de plage / Sandball'] },
      { name: 'Volley', icon: '🏐', popularity: 7, subs: ['Volley-ball', 'Volley-ball de plage (Beach-volley)', 'Green-volley', 'Volley assis'] },
      { name: 'Hockey (sur gazon)', icon: '🏑', popularity: 4, subs: ['Hockey sur gazon', 'Hockey en salle'] },
      { name: 'Hockey sur glace', icon: '🏒', popularity: 5, subs: ['Hockey sur glace', 'Ringuette', 'Para-hockey sur glace'] },
      { name: 'Baseball, softball', icon: '⚾', popularity: 3, subs: ['Baseball', 'Softball', 'Baseball5'] },
      { name: 'Pelote basque', icon: '🪀', popularity: 3, subs: ['Cesta punta', 'Main nue', 'Pala', 'Chistera (grande)', 'Joko garbi', 'Paleta', 'Xare', 'Frontenis', 'Pala corta', 'Rebot'] },
      { name: 'Polo', icon: '🐎', popularity: 2, subs: ['Polo sur gazon', 'Polo en salle'] },
      { name: 'Jeu de balle au tambourin', icon: '🥁', popularity: 2, subs: ['Balle au tambourin en extérieur et en salle'] },
      { name: 'Ballon au poing', icon: '🤜', popularity: 2, subs: ['Ballon au poing'] },
    ],
  },
  {
    id: 'raquette',
    name: 'Sports de raquette',
    color: 'bg-green-500',
    icon: '🎾',
    sports: [
      { name: 'Tennis', icon: '🎾', popularity: 9, subs: ['Tennis', 'Courte paume', 'Padel', 'Pickleball', 'Beach tennis', 'Tennis-fauteuil'] },
      { name: 'Badminton', icon: '🏸', popularity: 7, subs: ['Badminton', 'Jeu de volant', 'Para-badminton', 'AirBadminton'] },
      { name: 'Tennis de table', icon: '🏓', popularity: 7, subs: ['Tennis de table', 'Para-tennis de table', 'Hardbat'] },
      { name: 'Squash', icon: '🎾', popularity: 4, subs: ['Squash', 'Racquetball'] },
      { name: 'Longue paume', icon: '🎾', popularity: 2, subs: ['Longue paume'] },
    ],
  },
  {
    id: 'aquatique',
    name: 'Sports aquatiques',
    color: 'bg-blue-400',
    icon: '🏊',
    sports: [
      { name: 'Natation', icon: '🏊', popularity: 9, subs: ['Natation course sportive', 'Natation en eau libre', 'Natation artistique (synchronisée)', 'Plongeon', 'Water-polo'] },
      { name: 'Études et sports sous-marins', icon: '🤿', popularity: 5, subs: ['Plongée en apnée', "Plongée subaquatique d'exploration", 'Photographie subaquatique', 'Nage avec palmes', 'Orientation subaquatique', 'Tir sur cible subaquatique', 'Hockey subaquatique'] },
      { name: 'Pêche sportive en apnée', icon: '🐟', popularity: 2, subs: ['Pêche sous-marine'] },
      { name: 'Triathlon', icon: '🚴', popularity: 6, subs: ['Triathlon', 'Duathlon', 'Aquathlon', 'Cross triathlon', 'Swimrun', 'Para-triathlon'] },
      { name: 'Voile', icon: '⛵', popularity: 6, subs: ['Planche à voile', 'Voile radio-commandée', 'Dériveur', 'Multicoques', 'Courses océaniques / au large', 'Voile modèle', 'Voile traditionnelle', 'Match racing'] },
      { name: 'Aviron', icon: '🚣', popularity: 5, subs: ['Aviron de rivière', 'Aviron de mer', 'Aviron indoor', 'Para-aviron'] },
      { name: 'Canoë-kayak', icon: '🛶', popularity: 5, subs: ['Course en ligne', 'Slalom', 'Descente', 'Kayak-polo', 'Nage en eau vive', 'Raft', 'Merathon (océan racing)', "Pirogue polynésienne (Va'a) / Dragon boat", 'Wave-ski', 'Stand up paddle', 'Kayak de mer', 'Canoë de randonnée'] },
      { name: 'Ski nautique et wakeboard', icon: '🎿', popularity: 3, subs: ['Ski nautique classique', 'Course', 'Figures libres', 'Nu-pieds', 'Kneeboard', 'Wakeboard', 'Téléski nautique'] },
      { name: 'Surf', icon: '🏄', popularity: 5, subs: ['Surf', 'Stand up paddle', 'Bodyboard', 'Bodysurf', 'Skimboard', 'Longboard'] },
      { name: 'Motonautique', icon: '🚤', popularity: 2, subs: ['Motonautisme', 'Jet-ski / Hydrojet', 'Aéroglisseur'] },
      { name: 'Joute et sauvetage nautique', icon: '🛶', popularity: 2, subs: ['Joutes nautiques', 'Sauvetage nautique'] },
      { name: 'Sauvetage et secourisme', icon: '🛟', popularity: 3, subs: ['Sauvetage côtier / Surfboat', 'Sauvetage en eau plate'] },
    ],
  },
  {
    id: 'combat',
    name: 'Arts martiaux & combat',
    color: 'bg-orange-500',
    icon: '🥋',
    sports: [
      { name: 'Judo-jujitsu', icon: '🥋', popularity: 8, subs: ['Judo', 'Jujitsu', 'Taïso'] },
      { name: 'Karaté', icon: '🥋', popularity: 7, subs: ['Karaté', 'Karaté jutsu', 'Goshin jutsu', 'Kobudo', 'Nihon Tai-jutsu', 'Taijitsu', 'Nambudo', 'Ninjutsu', 'Nunchaku', 'Krav Maga', 'Wushu'] },
      { name: 'Boxe', icon: '🥊', popularity: 7, subs: ['Boxe anglaise', 'Boxe éducative'] },
      { name: 'Boxe américaine', icon: '🥊', popularity: 4, subs: ['Boxe américaine / Full contact'] },
      { name: 'Savate/boxe française', icon: '🥊', popularity: 5, subs: ['Boxe française savate', 'Savate forme', 'Savate défense', 'Canne de combat'] },
      { name: 'Kick boxing, muay thaï', icon: '🥊', popularity: 6, subs: ['Kick boxing', 'Cardio KB', 'Kick boxing light', 'KB Défense', 'Boxe thaïlandaise (Muay Thaï)', 'Full contact', 'Light contact', 'Semi-contact'] },
      { name: 'Taekwondo', icon: '🥋', popularity: 5, subs: ['Taekwondo', 'Hapkido', 'Tang-soo-do', 'Soo bahk do', 'Sin moo hapkido', 'Hapkido jin jung kwan'] },
      { name: 'Aïkido, aïkibudo, kinomichi', icon: '🥋', popularity: 4, subs: ['Aïkido', 'Aïkibudo', 'Budo', 'Kinomichi'] },
      { name: 'Aïkido et budo', icon: '🥋', popularity: 3, subs: ['Aïkido', 'Aïkibudo', 'Budo'] },
      { name: 'Arts énergétiques et martiaux chinois', icon: '☯️', popularity: 4, subs: ['Arts martiaux chinois externes', 'Arts martiaux chinois internes', 'Arts énergétiques chinois', 'Tai chi chuan', 'Qi gong'] },
      { name: 'Escrime', icon: '🤺', popularity: 5, subs: ['Épée', 'Fleuret', 'Sabre', 'Sabre laser', 'Escrime fauteuil'] },
      { name: 'Lutte', icon: '🤼', popularity: 4, subs: ['Lutte libre', 'Lutte gréco-romaine', 'Lutte féminine', 'Luttes traditionnelles (bretonne, etc.)', 'Sambo', 'Sumo'] },
      { name: 'Pentathlon moderne', icon: '🏅', popularity: 2, subs: ['Pentathlon moderne', 'Laser run', 'Triathle', 'Biathle', 'Tétrathlon'] },
    ],
  },
  {
    id: 'nature',
    name: 'Sports nature & montagne',
    color: 'bg-emerald-600',
    icon: '🏔️',
    sports: [
      { name: 'Montagne et escalade', icon: '🧗', popularity: 7, subs: ['Escalade (bloc, difficulté, vitesse)', 'Escalade sur PAH', 'Escalade sur Via ferrata/Corda', 'Escalade dans les arbres', 'Canyonisme', 'Raquette à neige', 'Ski-alpinisme'] },
      { name: 'Clubs alpins et de montagne', icon: '⛰️', popularity: 5, subs: ['Alpinisme', 'Randonnée de haute montagne', 'Cascade de glace', 'Expéditions lointaines', 'Ski de randonnée'] },
      { name: 'Spéléologie', icon: '🕳️', popularity: 2, subs: ['Spéléologie', 'Descente de canyon'] },
      { name: 'Équitation', icon: '🐴', popularity: 7, subs: ["Saut d'obstacles", 'Dressage', 'Concours complet', 'Randonnée équestre', 'Équitation western', 'Équitation camarguaise', 'Attelage', 'Horse-ball', "Raid équestre d'endurance"] },
      { name: 'Cyclisme', icon: '🚴', popularity: 8, subs: ['Cyclisme sur route', 'Vélo couché', 'Cyclisme sur piste', 'Cyclo-cross', 'BMX', 'VTT (Cross-country, Descente, Trial, Rallye, Four Cross)', 'Polo-vélo', 'Cyclisme en salle'] },
      { name: 'Cyclotourisme', icon: '🚲', popularity: 5, subs: ['Cyclotourisme sur route et VTT', 'Vélo de voyage'] },
      { name: 'Golf', icon: '⛳', popularity: 6, subs: ['Golf', 'Pitch and Putt'] },
      { name: "Tir à l'arc", icon: '🏹', popularity: 5, subs: ["Tir à l'arc sur cible (en salle et extérieur)", 'Tir en campagne', 'Tir nature', 'Tir 3D'] },
      { name: "Course d'orientation", icon: '🧭', popularity: 3, subs: ["Course d'orientation pédestre", "Course d'orientation à VTT", "Course d'orientation à ski"] },
      { name: 'Randonnée pédestre', icon: '🥾', popularity: 8, subs: ['Randonnée pédestre', 'Marche nordique', 'Longe côte'] },
      { name: 'Vol libre', icon: '🪂', popularity: 4, subs: ['Parapente', 'Deltaplane', 'Cerf-volant de traction / Kitesurf', 'Boomerang'] },
      { name: 'Sports de traîneau/ski-VTT joëring/canicross', icon: '🐕', popularity: 2, subs: ['Traîneau à chiens', 'Ski pulka', 'Ski-joëring', 'Cani-VTT', 'Canicross'] },
      { name: 'Sports et loisirs canins', icon: '🐶', popularity: 3, subs: ['Cross canin (Cani-cross, Cani-VTT, Ski-joëring canin)', 'Agility', 'Obéissance'] },
      { name: 'Pulka et traîneau à chiens', icon: '🛷', popularity: 2, subs: ['Traîneau à chiens', 'Ski pulka'] },
    ],
  },
  {
    id: 'hiver',
    name: "Sports d'hiver & glisse",
    color: 'bg-cyan-500',
    icon: '⛷️',
    sports: [
      { name: 'Ski', icon: '⛷️', popularity: 7, subs: ['Ski alpin', 'Ski nordique (de fond, saut, biathlon)', 'Ski artistique (bosses, sauts, skicross)', 'Surf des neiges / Snowboard'] },
      { name: 'Sports de glace', icon: '⛸️', popularity: 5, subs: ['Patinage artistique', 'Danse sur glace', 'Patinage de vitesse', 'Patinage synchronisé', 'Bobsleigh', 'Luge', 'Curling', 'Skeleton'] },
      { name: 'Roller et skateboard', icon: '🛹', popularity: 6, subs: ['Skateboard', 'Roller de vitesse', 'Roller acrobatique (freestyle)', 'Hockey sur patins (Rink hockey)', 'Roller in line hockey', 'Randonnée roller', 'Patinage artistique et danse sur roulettes', 'Trottinette freestyle'] },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness, danse & force',
    color: 'bg-pink-500',
    icon: '💪',
    sports: [
      { name: 'Gymnastique', icon: '🤸', popularity: 7, subs: ['Gymnastique artistique', 'Gymnastique rythmique', 'Gymnastique acrobatique', 'Gymnastique aérobic', 'Trampoline / Double mini-tramp', 'Tumbling', 'Parkour'] },
      {
        name: 'Danse',
        icon: '💃',
        popularity: 7,
        subs: [
          'Danses artistiques (classique, contemporaine, jazz)',
          'Danses urbaines (hip-hop, breaking, house dance, waacking)',
          'Danses de couple & salon (tango, valse, bal musette, danses latines et standards, salsa, bachata, kizomba)',
          "Rock & Swing (rock'n'roll, danses swing)",
          'Pole dance & Danses aériennes',
          'Danses du monde & autres (country, line dance, historique, flamenco, africaine, orientale, indienne, bollywood, polynésienne)',
          'Cheerleading',
        ],
      },
      { name: 'Haltérophilie, musculation', icon: '🏋️', popularity: 6, subs: ['Haltérophilie', 'Force athlétique', 'Musculation', 'Culturisme'] },
      { name: 'Force', icon: '💪', popularity: 5, subs: ['Force athlétique / Powerlifting', 'Développé couché', 'Bras de fer sportif', 'Strongman'] },
      { name: 'Twirling bâton', icon: '🪄', popularity: 2, subs: ['Twirling bâton'] },
      { name: 'Double dutch-jump rope', icon: '🪢', popularity: 2, subs: ['Double dutch', 'Jump rope / Corde à sauter sportive'] },
    ],
  },
  {
    id: 'mecanique',
    name: 'Sports mécaniques & aériens',
    color: 'bg-red-500',
    icon: '🏎️',
    sports: [
      { name: 'Sport automobile', icon: '🏎️', popularity: 5, subs: ['Sport automobile sur circuit', 'Rallye', 'Course de côte', 'Karting'] },
      { name: 'Motocyclisme', icon: '🏍️', popularity: 5, subs: ['Vitesse sur piste', 'Motocross', 'Enduro', 'Trial', 'Moto verte', 'Motoball', 'Quad'] },
      { name: 'Aéromodélisme', icon: '🛩️', popularity: 2, subs: ['Aéromodélisme (vol libre, circulaire, radiocommandé)', 'Modèle réduit'] },
      { name: 'Aéronautique', icon: '✈️', popularity: 3, subs: ['Formule racer', 'Vol à moteur', 'Voltige aérienne', 'Rallye aérien', 'Pilotage de précision'] },
      { name: 'Aérostation', icon: '🎈', popularity: 2, subs: ['Aérostation / Montgolfières', 'Ballons à gaz'] },
      { name: 'Parachutisme', icon: '🪂', popularity: 3, subs: ['Vol relatif', 'Voile contact', 'Voltige', "Précision d'atterrissage", 'Chute assis', 'Chute inversée (Freefly)', 'Parachutisme ascensionnel', 'Surf (Skysurfing)'] },
      { name: 'Planeur ultraléger motorisé', icon: '🛩️', popularity: 2, subs: ['Planeur ULM', 'Multiaxe', 'Pendulaire', 'Paramoteur', 'Autogire'] },
      { name: 'Vol en planeur', icon: '🛫', popularity: 2, subs: ['Vol à voile', 'Voltige en planeur'] },
      { name: 'Hélicoptère', icon: '🚁', popularity: 1, subs: ['Giraviation', 'Voltige en hélicoptère'] },
      { name: 'Voitures radio commandées', icon: '🚗', popularity: 2, subs: ['Modélisme automobile radio-guidé (piste et tout-terrain)'] },
    ],
  },
  {
    id: 'precision',
    name: 'Sports de précision',
    color: 'bg-purple-500',
    icon: '🎯',
    sports: [
      { name: 'Tir', icon: '🎯', popularity: 5, subs: ['Tir à la carabine', 'Tir au pistolet', 'Tir sur cible mobile', 'Arbalète', 'Armes anciennes', 'Bench rest', 'Silhouettes métalliques', 'Tir sportif de vitesse', 'Tir aux armes réglementaires'] },
      { name: 'Pétanque et jeu provençal', icon: '🍡', popularity: 7, subs: ['Pétanque', 'Jeu provençal'] },
      { name: 'Billard', icon: '🎱', popularity: 4, subs: ['Billard français (carambole)', 'Snooker', 'Billard américain', 'Billard anglais / Blackball'] },
      { name: 'Bowling et sports de quilles', icon: '🎳', popularity: 4, subs: ['Bowling', 'Sports de quilles (Quilles de neuf, Quilles de huit)'] },
      { name: 'Ball-trap', icon: '🔫', popularity: 2, subs: ['Parcours de chasse', 'Fosse universelle', 'Fosse européenne', 'Compak sporting', 'Skeet olympique'] },
      { name: 'Javelot tir sur cible', icon: '🎯', popularity: 1, subs: ['Javelot tir sur cible'] },
      { name: 'Échecs', icon: '♟️', popularity: 5, subs: ['Échecs classiques, parties rapides, blitz'] },
      { name: 'Sport boules', icon: '🥎', popularity: 4, subs: ['Sport boules (Boules lyonnaises)', 'Boules traditionnelles'] },
      { name: 'Flying disc', icon: '🥏', popularity: 3, subs: ['Ultimate', 'Swing / Disc', 'Disc golf'] },
    ],
  },
  {
    id: 'traditionnel',
    name: 'Sports traditionnels & régionaux',
    color: 'bg-amber-600',
    icon: '🐂',
    sports: [
      { name: 'Course camarguaise', icon: '🐂', popularity: 2, subs: ['Course camarguaise'] },
      { name: 'Course landaise', icon: '🐄', popularity: 2, subs: ['Course landaise'] },
      { name: 'Char à voile', icon: '🪁', popularity: 2, subs: ['Char à voile (Aéroplage)', 'Char à cerf-volant', 'Char à glace', 'Char à neige', 'Kart à voile', 'Voilier des sables'] },
    ],
  },
  {
    id: 'peche',
    name: 'Pêche',
    color: 'bg-teal-600',
    icon: '🎣',
    sports: [
      { name: 'Pêches sportives', icon: '🎣', popularity: 3, subs: ['Pêche en mer', 'Pêche au coup en eau douce', 'Pêche sportive à la mouche et au lancer'] },
    ],
  },
  {
    id: 'paralympique',
    name: 'Paralympiques',
    color: 'bg-indigo-500',
    icon: '♿',
    sports: [
      { name: 'Handisport', icon: '♿', popularity: 5, subs: ['Athlétisme handisport', 'Basket-ball en fauteuil roulant', 'Boccia', 'Cécifoot', 'Escrime fauteuil', 'Rugby fauteuil', 'Natation handisport', 'Ski para-alpin'] },
      { name: 'Sport adapté', icon: '🤝', popularity: 4, subs: ['Para-athlétisme', 'Para-natation', 'Para-tennis de table', 'Para-football', 'Para-pétanque', 'Para-judo'] },
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
