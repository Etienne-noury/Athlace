/**
 * Référentiel du questionnaire « Mon club », sport par sport : catégories (d'âge ou de niveau), divisions de
 * compétition, labels, dotation fournie par le club, matériel à acheter et prérequis (grades, brevets…).
 *
 * Construit par famille de sports (catégorie de l'arborescence), puis précisé sport par sport (clé = nom du sport
 * dans src/data/disciplines.ts). Les listes sont des propositions : le club peut toujours ajouter « Autre ».
 * À faire valider par chaque fédération (webinaire) : les intitulés officiels évoluent selon les saisons.
 */

export interface SportFormSpec {
  /** Catégories proposées pour une équipe ou un groupe (noms officiels quand ils existent). */
  categories: string[];
  /** Divisions ou niveaux de compétition, propres au sport. */
  divisions: string[];
  /** Labels et certifications de club délivrés par la fédération. */
  labels: string[];
  /** Dotation : ce que le club fournit (tenue, matériel). */
  provided: string[];
  /** Matériel à acheter par l'adhérent. */
  toBuy: string[];
  /** Prérequis ou niveau propre au sport (grades, brevets, galops…) : libellé et valeurs. */
  prerequisite?: { label: string; options: string[] };
}

const ALL_AGES = 'Tous âges';
const AGE_GENERIC = ['Enfants', 'Ados', 'Adultes', 'Seniors (+60 ans)', ALL_AGES];
const LEVELS_GENERIC = ['Départemental', 'Régional', 'National', 'International'];
const TEAM_DIVISIONS_GENERIC = ['Départemental', 'Régional', 'National', 'Élite'];
const SPORT_HEALTH = 'Label Sport Santé';

const BELTS = ['Blanche', 'Jaune', 'Orange', 'Verte', 'Bleue', 'Marron', 'Noire 1er dan', 'Noire 2e dan et plus'];
const JUDO_AGES = ['Éveil judo (4-5 ans)', 'Mini-poussins (6-7 ans)', 'Poussins (8-9 ans)', 'Benjamins (10-11 ans)', 'Minimes (12-13 ans)', 'Cadets (14-16 ans)', 'Juniors (17-19 ans)', 'Seniors', 'Vétérans', ALL_AGES];
const ATHLE_AGES = ['Baby athlé', 'Éveil athlétique', 'Poussins', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Espoirs', 'Seniors', 'Masters', ALL_AGES];

/** Valeurs par famille (id de catégorie de l'arborescence). */
const FAMILY: Record<string, SportFormSpec> = {
  collectif: {
    categories: ['Moins de 7 ans', 'Moins de 9 ans', 'Moins de 11 ans', 'Moins de 13 ans', 'Moins de 15 ans', 'Moins de 18 ans', 'Seniors', 'Vétérans', 'Loisir', ALL_AGES],
    divisions: TEAM_DIVISIONS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Maillot', 'Short', 'Chaussettes', 'Survêtement', 'Sac', 'Ballon'], toBuy: ['Chaussures', 'Protège-tibias', 'Protège-dents'],
  },
  raquette: {
    categories: ['Mini (moins de 7 ans)', 'Jeunes (7-11 ans)', 'Ados (12-17 ans)', 'Adultes', 'Vétérans', ALL_AGES],
    divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Raquette en prêt', 'Balles ou volants', 'Tenue du club'], toBuy: ['Raquette', 'Chaussures de salle', 'Tenue'],
  },
  aquatique: {
    categories: ['Enfants', 'Ados', 'Adultes', 'Masters', ALL_AGES],
    divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel collectif', 'Bateau ou embarcation', 'Gilet', 'Combinaison en prêt'], toBuy: ['Combinaison', 'Chaussons', 'Lunettes'],
  },
  combat: {
    categories: ['Baby (4-5 ans)', 'Enfants (6-11 ans)', 'Ados (12-17 ans)', 'Adultes', 'Vétérans', ALL_AGES],
    divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Tatami ou ring', 'Protections en prêt', 'Gants en prêt'], toBuy: ['Tenue', 'Gants', 'Protège-dents', 'Protections'],
    prerequisite: { label: 'Grade ou niveau requis', options: ['Aucun (débutants acceptés)', ...BELTS] },
  },
  athletisme: {
    categories: ATHLE_AGES, divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Maillot du club', 'Matériel d\'entraînement'], toBuy: ['Chaussures de course', 'Pointes', 'Tenue'],
  },
  nature: {
    categories: [...AGE_GENERIC, 'Familles'], divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel collectif', 'Matériel en prêt', 'Tenue du club'], toBuy: ['Chaussures adaptées', 'Équipement personnel'],
  },
  glisse: {
    categories: [...AGE_GENERIC], divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel en prêt', 'Tenue du club'], toBuy: ['Équipement personnel', 'Casque', 'Protections'],
  },
  forme: {
    categories: ['Baby (moins de 6 ans)', 'Enfants', 'Ados', 'Adultes', 'Seniors (+60 ans)', ALL_AGES],
    divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel collectif', 'Tenue de compétition'], toBuy: ['Tenue', 'Chaussures'],
  },
  mecanique: {
    categories: ['Jeunes', 'Adultes', ALL_AGES], divisions: LEVELS_GENERIC, labels: [],
    provided: ['Machine ou modèle du club', 'Piste ou terrain'], toBuy: ['Équipement de sécurité', 'Machine ou modèle personnel'],
  },
  aerien: {
    categories: ['Jeunes', 'Adultes', ALL_AGES], divisions: LEVELS_GENERIC, labels: [],
    provided: ['Machine du club', 'Matériel de sécurité', 'Instruction'], toBuy: ['Équipement personnel', 'Licence et assurance'],
    prerequisite: { label: 'Brevet ou niveau requis', options: ['Aucun (baptême, découverte)', 'Élève en formation', 'Brevet obtenu'] },
  },
  precision: {
    categories: ['Jeunes', 'Adultes', 'Vétérans', ALL_AGES], divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel en prêt'], toBuy: ['Matériel personnel'],
  },
  traditions: {
    categories: ['Jeunes', 'Adultes', ALL_AGES], divisions: TEAM_DIVISIONS_GENERIC, labels: [],
    provided: ['Matériel du club', 'Tenue'], toBuy: ['Matériel personnel'],
  },
  handicap: {
    categories: ['Enfants', 'Ados', 'Adultes', ALL_AGES], divisions: LEVELS_GENERIC, labels: [SPORT_HEALTH],
    provided: ['Matériel adapté', 'Fauteuil de sport en prêt'], toBuy: ['Équipement personnel'],
  },
};

/** Précisions sport par sport (seuls les champs différents de la famille). */
const SPORT: Record<string, Partial<SportFormSpec>> = {
  Football: {
    categories: ['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20', 'Seniors', 'Vétérans (+35 ans)', 'Foot loisir', 'Foot entreprise'],
    divisions: ['Départemental 5', 'Départemental 4', 'Départemental 3', 'Départemental 2', 'Départemental 1', 'Régional 3', 'Régional 2', 'Régional 1', 'National 3', 'National 2', 'National'],
    labels: ['Label Jeunes FFF', 'Label École Féminine de Football', SPORT_HEALTH],
    provided: ['Maillot', 'Short', 'Chaussettes', 'Survêtement', 'Sac', 'K-way', 'Ballon', 'Tenue de match (prêtée pour la saison)'],
    toBuy: ['Crampons', 'Protège-tibias', 'Gants de gardien', 'Survêtement', 'Sac'],
  },
  Rugby: {
    categories: ['M6', 'M8', 'M10', 'M12', 'M14', 'M16', 'M19', 'Seniors', 'Rugby à 5 (loisir)', 'Vétérans'],
    divisions: ['Régionale 3', 'Régionale 2', 'Régionale 1', 'Fédérale 3', 'Fédérale 2', 'Fédérale 1', 'Nationale 2', 'Nationale'],
    labels: ['Label École de Rugby', SPORT_HEALTH],
    provided: ['Maillot', 'Short', 'Chaussettes', 'Survêtement', 'Sac', 'Ballon'],
    toBuy: ['Crampons', 'Protège-dents', 'Casque', 'Épaulières'],
  },
  'Rugby à XIII': {
    categories: ['Moins de 7 ans', 'Moins de 9 ans', 'Moins de 11 ans', 'Moins de 13 ans', 'Moins de 15 ans', 'Moins de 17 ans', 'Moins de 19 ans', 'Seniors', 'Fauteuil', ALL_AGES],
    divisions: ['Fédérale', 'Nationale 2', 'Nationale 1', 'Élite 2', 'Élite 1'],
  },
  Basketball: {
    categories: ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U18', 'U21', 'Seniors', 'Vétérans', 'Basket loisir', '3x3'],
    divisions: ['Départementale 4', 'Départementale 3', 'Départementale 2', 'Départementale 1', 'Régionale 3', 'Régionale 2', 'Régionale 1', 'Pré-nationale', 'Nationale 3', 'Nationale 2', 'Nationale 1'],
    labels: ['Label École Française de Mini-Basket', 'Label Club Formateur', SPORT_HEALTH],
    provided: ['Maillot (réversible)', 'Short', 'Survêtement', 'Sac', 'Ballon'], toBuy: ['Chaussures de basket', 'Chaussettes'],
  },
  Handball: {
    categories: ['Baby hand (moins de 6 ans)', 'Moins de 9 ans', 'Moins de 11 ans', 'Moins de 13 ans', 'Moins de 15 ans', 'Moins de 17 ans', 'Moins de 18 ans', 'Seniors', 'Hand loisir', 'Handfit'],
    divisions: ['Départemental', 'Honneur régional', 'Excellence régionale', 'Pré-nationale', 'Nationale 3', 'Nationale 2', 'Nationale 1'],
    labels: ["Label École de Hand", SPORT_HEALTH],
    provided: ['Maillot', 'Short', 'Chaussettes', 'Survêtement', 'Ballon'], toBuy: ['Chaussures de salle', 'Genouillères'],
  },
  Volley: {
    categories: ['M7', 'M9', 'M11', 'M13', 'M15', 'M18', 'M21', 'Seniors', 'Volley loisir', 'Beach volley'],
    divisions: ['Départementale', 'Régionale', 'Pré-nationale', 'Nationale 3', 'Nationale 2', 'Élite'],
    provided: ['Maillot', 'Short', 'Ballon'], toBuy: ['Chaussures de salle', 'Genouillères'],
  },
  'Football américain': {
    categories: ['U12 (flag)', 'U14', 'U16', 'U19', 'Seniors', 'Flag football', 'Cheerleading'],
    divisions: ['Régional', 'Division 3', 'Division 2', 'Division 1 (Élite)'],
    provided: ['Casque en prêt', 'Épaulières en prêt', 'Maillot'], toBuy: ['Crampons', 'Protège-dents', 'Gants'],
  },
  'Hockey sur glace': {
    categories: ['U7', 'U9', 'U11', 'U13', 'U15', 'U17', 'U20', 'Seniors', 'Loisir'],
    divisions: ['Division 3', 'Division 2', 'Division 1', 'Ligue Magnus'],
    provided: ['Maillot', 'Équipement en prêt (débutants)'], toBuy: ['Patins', 'Casque', 'Crosse', 'Protections'],
  },
  'Hockey sur gazon': { provided: ['Maillot', 'Crosse en prêt', 'Balles'], toBuy: ['Crosse', 'Protège-tibias', 'Protège-dents', 'Chaussures'] },
  Tennis: {
    categories: ['Baby tennis (4-5 ans)', 'Galaxie Tennis (6-10 ans)', '11-14 ans', '15-18 ans', 'Adultes', 'Seniors +35', 'Padel', ALL_AGES],
    divisions: ['Départementale', 'Régionale', 'Pré-nationale', 'Nationale 4', 'Nationale 3', 'Nationale 2', 'Nationale 1'],
    provided: ['Balles', 'Raquette en prêt', 'Tenue du club'], toBuy: ['Raquette', 'Chaussures de tennis', 'Tenue'],
    prerequisite: { label: 'Classement', options: ['Non classé', '40', '30/5 à 30', '15/5 à 15', '5/6 à 1/6', 'Seconde série', 'Première série'] },
  },
  'Tennis de table': {
    categories: ['Poussins', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Vétérans', 'Loisir', ALL_AGES],
    divisions: ['Départementale', 'Pré-régionale', 'Régionale', 'Nationale 3', 'Nationale 2', 'Nationale 1', 'Pro'],
    provided: ['Raquette en prêt', 'Balles', 'Maillot du club'], toBuy: ['Raquette', 'Chaussures de salle'],
  },
  Badminton: {
    categories: ['Minibad', 'Poussins', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Vétérans', 'Loisir', ALL_AGES],
    divisions: ['Départementale', 'Régionale', 'Pré-nationale', 'Nationale 3', 'Nationale 2', 'Nationale 1', 'Top 12'],
    provided: ['Volants', 'Raquette en prêt'], toBuy: ['Raquette', 'Chaussures de salle', 'Volants'],
  },
  Natation: {
    categories: ['École de natation', 'Avenirs', 'Jeunes', 'Juniors', 'Seniors', 'Maîtres', 'Natation loisir', 'Aquaforme', ALL_AGES],
    divisions: ['Départemental', 'Régional', 'Interrégional', 'National'],
    labels: ['Label École de Natation Française', SPORT_HEALTH],
    provided: ['Planches, pull-buoys et matériel pédagogique', 'Bonnet du club'], toBuy: ['Maillot de bain', 'Bonnet', 'Lunettes', 'Palmes', 'Plaquettes'],
    prerequisite: { label: 'Niveau requis', options: ['Aucun (apprentissage)', "Savoir nager 25 m", 'Sauv\'nage', 'Pass\'sports de l\'eau', 'Pass\'compétition'] },
  },
  'Plongée et sports sous-marins': {
    categories: ['Enfants (8-14 ans)', 'Ados', 'Adultes', ALL_AGES],
    provided: ['Bloc', 'Détendeur', 'Gilet stabilisateur', 'Combinaison en prêt', 'Plombs'], toBuy: ['Masque', 'Palmes', 'Tuba', 'Combinaison', 'Ordinateur de plongée'],
    prerequisite: { label: 'Niveau de plongée requis', options: ['Aucun (baptême, débutant)', 'Niveau 1 (PE20)', 'Niveau 2', 'Niveau 3', 'Niveau 4', 'Moniteur'] },
  },
  'Chasse sous-marine': { prerequisite: { label: 'Niveau requis', options: ['Aucun (débutant)', 'Apnéiste confirmé'] } },
  Voile: {
    categories: ['Optimist', 'Enfants', 'Ados', 'Adultes', ALL_AGES],
    labels: ['École Française de Voile', SPORT_HEALTH],
    provided: ['Bateau', 'Gilet', 'Combinaison en prêt'], toBuy: ['Chaussures de voile', 'Combinaison', 'Veste de quart'],
    prerequisite: { label: 'Niveau FFVoile requis', options: ['Aucun (débutant)', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4', 'Niveau 5'] },
  },
  'Canoë-kayak': {
    provided: ['Embarcation', 'Pagaie', 'Gilet', 'Casque'], toBuy: ['Chaussons', 'Combinaison', 'Coupe-vent'],
    prerequisite: { label: 'Pagaies couleurs', options: ['Aucune (débutant)', 'Pagaie blanche', 'Pagaie jaune', 'Pagaie verte', 'Pagaie bleue', 'Pagaie rouge', 'Pagaie noire'] },
  },
  Aviron: { provided: ['Bateau', 'Avirons'], toBuy: ['Tenue (combinaison d\'aviron)'], prerequisite: { label: 'Prérequis', options: ['Savoir nager'] } },
  Surf: { provided: ['Planche en prêt', 'Combinaison en prêt'], toBuy: ['Planche', 'Combinaison', 'Leash'] },
  'Judo-jujitsu': {
    categories: JUDO_AGES, provided: ['Tatami', 'Judogi en prêt (débutants)'], toBuy: ['Judogi (kimono)', 'Ceinture', 'Zooris (sandales)'],
    prerequisite: { label: 'Grade requis', options: ['Aucun (débutants acceptés)', ...BELTS] },
  },
  Karaté: { toBuy: ['Karatégi', 'Ceinture', 'Gants', 'Protège-dents', 'Protège-tibias'] },
  Taekwondo: { toBuy: ['Dobok', 'Ceinture', 'Plastron', 'Casque', 'Protections'], prerequisite: { label: 'Grade requis', options: ['Aucun (débutants acceptés)', 'Keup (ceintures de couleur)', '1er dan', '2e dan et plus'] } },
  Aïkido: { categories: ['Enfants', 'Ados', 'Adultes', ALL_AGES], divisions: [], toBuy: ['Keikogi', 'Ceinture', 'Hakama (gradés)', 'Bokken et jo'], prerequisite: { label: 'Grade requis', options: ['Aucun (débutants acceptés)', 'Kyu', '1er dan', '2e dan et plus'] } },
  'Boxe anglaise': { provided: ['Ring', 'Sacs de frappe', 'Gants en prêt'], toBuy: ['Gants', 'Bandes', 'Protège-dents', 'Casque', 'Coquille'], prerequisite: { label: 'Pratique', options: ['Boxe éducative', 'Boxe loisir', 'Amateur', 'Professionnelle'] } },
  'Savate boxe française': { toBuy: ['Gants', 'Chaussures de savate', 'Protège-dents', 'Coquille'], prerequisite: { label: 'Gant requis', options: ['Aucun (débutant)', 'Gant bleu', 'Gant vert', 'Gant rouge', 'Gant blanc', 'Gant jaune', 'Gant argent'] } },
  Escrime: {
    categories: ['M7', 'M9', 'M11', 'M13', 'M15', 'M17', 'M20', 'Seniors', 'Vétérans', ALL_AGES],
    provided: ['Arme en prêt', 'Masque en prêt', 'Veste en prêt'], toBuy: ['Arme', 'Masque', 'Veste', 'Gant', 'Chaussures'],
    prerequisite: { label: 'Arme pratiquée', options: ['Fleuret', 'Épée', 'Sabre'] },
  },
  Athlétisme: { categories: ATHLE_AGES, provided: ['Maillot du club', 'Matériel de lancer et de saut'] },
  Triathlon: { categories: ['Mini-poussins', 'Poussins', 'Pupilles', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Vétérans', ALL_AGES], divisions: ['Départemental', 'Régional', 'D3', 'D2', 'D1'], toBuy: ['Vélo', 'Casque', 'Combinaison', 'Chaussures de course', 'Trifonction'] },
  'Randonnée pédestre': { categories: ['Adultes', 'Familles', 'Seniors (+60 ans)', ALL_AGES], divisions: [], provided: ['Encadrement par un animateur'], toBuy: ['Chaussures de randonnée', 'Sac à dos', 'Bâtons'], prerequisite: { label: 'Niveau des sorties', options: ['Facile', 'Moyen', 'Sportif', 'Tous niveaux'] } },
  Escalade: {
    categories: ['Baby escalade (4-6 ans)', 'Enfants', 'Ados', 'Adultes', ALL_AGES],
    labels: ["Label École d'escalade", SPORT_HEALTH],
    provided: ['Cordes', 'Dégaines', 'Baudrier en prêt', 'Chaussons en prêt'], toBuy: ['Chaussons', 'Baudrier', 'Sac à magnésie', 'Système d\'assurage'],
    prerequisite: { label: 'Passeport FFME', options: ['Aucun (débutant)', 'Blanc', 'Jaune', 'Orange', 'Vert', 'Bleu', 'Violet', 'Rouge', 'Noir'] },
  },
  Cyclisme: { categories: ['Prélicenciés', 'Poussins', 'Pupilles', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Espoirs', 'Seniors', 'Masters', ALL_AGES], provided: ['Maillot du club', 'Cuissard'], toBuy: ['Vélo', 'Casque', 'Chaussures', 'Gants'] },
  Cyclotourisme: { categories: ['Jeunes', 'Adultes', 'Seniors (+60 ans)', ALL_AGES], divisions: [], provided: ['Maillot du club'], toBuy: ['Vélo', 'Casque', 'Gants'], prerequisite: { label: 'Allure des sorties', options: ['Balade', 'Moyenne', 'Sportive', 'Toutes allures'] } },
  Équitation: {
    categories: ['Baby poney (3-6 ans)', 'Poney', 'Cheval', 'Adultes', ALL_AGES],
    labels: ['Label École Française d\'Équitation', 'Label Poney Club de France', 'Label Cheval Club de France', SPORT_HEALTH],
    provided: ['Cheval ou poney', 'Sellerie', 'Matériel de pansage'], toBuy: ['Bombe (casque)', 'Bottes ou boots', 'Culotte d\'équitation', 'Gants', 'Protège-dos'],
    prerequisite: { label: 'Galop requis', options: ['Aucun (débutant)', 'Galop 1', 'Galop 2', 'Galop 3', 'Galop 4', 'Galop 5', 'Galop 6', 'Galop 7'] },
  },
  Ski: { categories: ['Enfants', 'U12', 'U14', 'U16', 'U18', 'U21', 'Seniors', 'Masters', ALL_AGES], provided: ['Forfait (selon le club)', 'Encadrement'], toBuy: ['Skis', 'Chaussures de ski', 'Casque', 'Masque'] },
  'Sports de glace': { provided: ['Patins en prêt'], toBuy: ['Patins', 'Tenue', 'Gants'] },
  'Roller et skateboard': { provided: ['Matériel en prêt (débutants)'], toBuy: ['Rollers ou skateboard', 'Casque', 'Protections (poignets, genoux, coudes)'] },
  Gymnastique: { categories: ['Baby gym (moins de 6 ans)', 'Poussines / Poussins', 'Benjamines / Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Gym forme', ALL_AGES], divisions: ['Départemental', 'Régional', 'Fédéral', 'National', 'Élite'], toBuy: ['Justaucorps ou léotard', 'Maniques'] },
  Danse: { provided: ['Costumes de gala (selon le club)'], toBuy: ['Chaussons ou chaussures de danse', 'Tenue'] },
  'Haltérophilie, musculation et force': { provided: ['Barres et disques', 'Machines'], toBuy: ['Chaussures d\'haltérophilie', 'Ceinture', 'Genouillères'] },
  Golf: {
    categories: ['École de golf (enfants)', 'Jeunes', 'Adultes', 'Seniors', ALL_AGES],
    labels: ['Label École de Golf', SPORT_HEALTH],
    provided: ['Clubs en prêt', 'Balles de practice'], toBuy: ['Série de clubs', 'Chaussures de golf', 'Gant', 'Sac'],
    prerequisite: { label: 'Niveau requis', options: ['Aucun (débutant)', 'Carte verte', 'Index 36 à 18', 'Index inférieur à 18'] },
  },
  "Tir à l'arc": { provided: ['Arc en prêt', 'Flèches en prêt', 'Cibles'], toBuy: ['Arc', 'Flèches', 'Carquois', 'Protège-bras', 'Palette'] },
  'Tir sportif': { provided: ['Armes du club', 'Munitions (selon le club)', 'Cibles'], toBuy: ['Arme personnelle', 'Casque anti-bruit', 'Lunettes de tir'] },
  Échecs: { categories: ['Petits poussins', 'Poussins', 'Pupilles', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Vétérans', ALL_AGES], divisions: ['Départementale', 'Régionale', 'Nationale 3', 'Nationale 2', 'Nationale 1', 'Top 16'], provided: ['Échiquiers', 'Pendules'], toBuy: [] },
  'Pétanque et jeu provençal': { provided: ['Terrain', 'Cochonnets'], toBuy: ['Boules de compétition'] },
  'Vol libre': { prerequisite: { label: 'Brevet requis', options: ['Aucun (école, biplace)', 'Brevet initial', 'Brevet de pilote', 'Brevet de pilote confirmé'] } },
  Parachutisme: { prerequisite: { label: 'Niveau requis', options: ['Aucun (saut tandem, PAC)', 'Élève', 'Brevet A', 'Brevet B', 'Brevet C', 'Brevet D'] } },
  Handisport: { categories: ['Enfants', 'Ados', 'Adultes', ALL_AGES] },
};

const EMPTY: SportFormSpec = { categories: AGE_GENERIC, divisions: LEVELS_GENERIC, labels: [], provided: [], toBuy: [] };

/** Référentiel pour un sport donné (nom du sport de l'arborescence et id de sa famille). */
export function getSportFormSpec(sportName: string | null | undefined, familyId: string | null | undefined): SportFormSpec {
  const base = (familyId && FAMILY[familyId]) || EMPTY;
  const own = (sportName && SPORT[sportName]) || {};
  return { ...base, ...own };
}

export const GENDERS = ['Hommes', 'Femmes', 'Mixte'] as const;
export const COACH_TYPES = ['Bénévole', 'Diplômé'] as const;
export const AMENITY_OPTIONS = [
  'Vestiaires', 'Douches', 'Parking', 'Club-house', 'Matériel en prêt', 'Salle de musculation', 'Infirmerie',
  'Éclairage pour le soir', 'Tribunes', 'Accès en transports en commun', 'Garderie ou espace famille',
];
export const SOCIAL_NETWORKS = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'X (Twitter)', 'Strava', 'Autre'] as const;
