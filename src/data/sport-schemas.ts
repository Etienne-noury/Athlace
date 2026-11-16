/**
 * Schémas annotés des fiches sport.
 *
 * Le dessin de chaque schéma est un fichier SVG dans src/assets/sport-schemas/<clé>.svg :
 * on peut l'ouvrir et le modifier dans n'importe quel éditeur (Figma, Illustrator, Inkscape, VS Code).
 * Ici, on modifie seulement le titre et la légende. La légende suit l'ordre des repères numérotés du dessin.
 * Le sport (ou la discipline) qui affiche un schéma est choisi par le champ « schema » de src/data/sport-guides.ts.
 * Mode d'emploi complet : docs/PHOTOS-ET-SCHEMAS.md
 */
export interface SportSchemaText { cap: string; legend: string[] }

export const SPORT_SCHEMA_TEXTS: Record<string, SportSchemaText> = {
  "foot": {
    cap: "Le terrain de football",
    legend: [
      "Le but : le ballon doit franchir entièrement la ligne pour qu'il y ait but.",
      "La surface de réparation : seul endroit où le gardien peut prendre le ballon à la main.",
      "Le point de penalty, pour les fautes commises dans la surface.",
      "Le rond central : le coup d'envoi se donne ici, au début et après chaque but.",
      "La ligne médiane sépare les deux camps.",
    ],
  },
  "rugby": {
    cap: "Le terrain de rugby",
    legend: [
      "L'en-but : aplatis le ballon ici pour marquer un essai.",
      "Les poteaux : la transformation, la pénalité et le drop doivent passer au-dessus de la barre.",
      "La ligne des 22 mètres, repère pour les renvois et le jeu au pied.",
      "La ligne médiane : le coup d'envoi se fait d'ici.",
      "Les passes à la main se font toujours vers l'arrière.",
    ],
  },
  "fa": {
    cap: "Le terrain de football américain",
    legend: [
      "L'end zone : porte ou attrape le ballon ici pour marquer un touchdown (6 points).",
      "La ligne de mêlée : l'action repart d'ici à chaque tentative.",
      "La ligne à atteindre : 10 yards à gagner en 4 tentatives pour garder le ballon.",
      "Les poteaux : le field goal (3 points) passe entre eux.",
    ],
  },
  "basket": {
    cap: "Le terrain de basket",
    legend: [
      "Le panier, à 3,05 m de hauteur.",
      "La raquette : un attaquant ne peut pas y rester plus de 3 secondes.",
      "La ligne de lancer franc : chaque lancer réussi vaut 1 point.",
      "La ligne à 3 points : un panier marqué derrière elle vaut 3 points.",
    ],
  },
  "hand": {
    cap: "Le terrain de handball",
    legend: [
      "La zone des 6 mètres : réservée au gardien. Les tirs se font en suspension au-dessus.",
      "La ligne des 9 mètres (pointillés) : on y tire les jets francs.",
      "Le point des 7 mètres : c'est le penalty du handball.",
      "Le but, défendu par le gardien.",
    ],
  },
  "volley": {
    cap: "Le terrain de volley",
    legend: [
      "Le filet sépare les deux équipes : on ne le touche pas.",
      "La ligne d'attaque à 3 m : les joueurs arrière doivent sauter derrière elle pour attaquer.",
      "Le camp adverse : le point est gagné quand le ballon y touche le sol.",
      "La zone de service, derrière la ligne de fond. Les 6 joueurs tournent chaque fois que l'équipe récupère le service.",
    ],
  },
  "hockey": {
    cap: "Le terrain de hockey sur gazon",
    legend: [
      "Le cercle : un but n'est valable que si le tir part de l'intérieur.",
      "La ligne des 23 m, repère pour les remises en jeu.",
      "Le but, protégé par un gardien très équipé.",
      "La ligne médiane : engagement au début et après chaque but.",
    ],
  },
  "rink": {
    cap: "La patinoire de hockey sur glace",
    legend: [
      "Les lignes bleues : on n'entre pas dans la zone adverse avant le palet (hors-jeu).",
      "La ligne centrale, où a lieu l'engagement d'ouverture.",
      "Le but et la zone du gardien (enclave).",
      "Les cercles de mise en jeu, après chaque arrêt de jeu.",
    ],
  },
  "baseball": {
    cap: "Le terrain de baseball",
    legend: [
      "Le marbre : le batteur y frappe la balle, et y revient pour marquer.",
      "Le monticule, d'où le lanceur envoie la balle.",
      "Les bases : après la frappe, cours de base en base dans ce sens.",
      "Le champ extérieur, où les défenseurs essaient d'attraper la balle.",
    ],
  },
  "ultimate": {
    cap: "Le terrain d'ultimate",
    legend: [
      "La zone d'en-but : attrape le disque ici pour marquer.",
      "Le porteur du disque ne court pas : il pivote sur un pied et a 10 secondes pour passer.",
      "On avance uniquement par des passes vers un coéquipier démarqué.",
    ],
  },
  "tennis": {
    cap: "Le court de tennis",
    legend: [
      "Le filet : la balle doit passer au-dessus.",
      "Le carré de service : ton service doit rebondir dans le carré en diagonale.",
      "Le couloir : il fait partie du terrain uniquement en double.",
      "La ligne de fond : on sert derrière elle.",
    ],
  },
  "bad": {
    cap: "Le terrain de badminton",
    legend: [
      "Le filet, plus haut qu'au tennis : le volant ne doit jamais toucher le sol dans ton camp.",
      "La ligne de service court : le service doit tomber au-delà.",
      "La ligne de service long en double.",
      "Les couloirs latéraux : ils comptent en double, pas en simple.",
    ],
  },
  "tt": {
    cap: "La table de tennis de table",
    legend: [
      "Le filet, au milieu de la table.",
      "La ligne centrale : en double, le service se fait en diagonale, d'une moitié droite à l'autre.",
      "Au service, la balle rebondit d'abord dans ton camp…",
      "…puis une fois dans le camp adverse.",
    ],
  },
  "squash": {
    cap: "Le court de squash (vu de dessus)",
    legend: [
      "Le mur avant : chaque frappe doit l'atteindre, entre la ligne basse et la ligne haute.",
      "La ligne courte : au service, la balle doit retomber derrière elle.",
      "Le carré de service : un pied dedans au moment de servir.",
      "Les deux joueurs partagent le même espace et doivent se laisser passer.",
    ],
  },
  "pool": {
    cap: "Le bassin de natation",
    legend: [
      "Les plots de départ : on plonge à partir d'eux (sauf en dos).",
      "Les lignes d'eau délimitent les couloirs : chaque nageur reste dans le sien.",
      "Au virage, il faut toucher le mur avant de repartir.",
    ],
  },
  "voile": {
    cap: "Un parcours de régate",
    legend: [
      "La ligne de départ, entre le bateau du comité et une bouée.",
      "La bouée au vent, à contourner avant de redescendre.",
      "Impossible d'aller droit face au vent : on tire des bords en zigzag.",
    ],
  },
  "rowing": {
    cap: "Le bassin de course",
    legend: [
      "Le départ, aligné : tous les bateaux partent ensemble.",
      "Chaque équipage reste dans son couloir balisé.",
      "La ligne d'arrivée : c'est la pointe avant du bateau qui compte.",
    ],
  },
  "slalomwater": {
    cap: "Un parcours de slalom en canoë-kayak",
    legend: [
      "Portes vertes : à franchir dans le sens du courant.",
      "Portes rouges : à franchir en remontant le courant.",
      "Toucher un piquet ou manquer une porte ajoute des secondes de pénalité.",
    ],
  },
  "tatami": {
    cap: "L'aire de combat",
    legend: [
      "La surface de combat : sortir de cette zone peut être pénalisé.",
      "La zone de sécurité, autour, pour protéger les chutes.",
      "Les marques de départ : les combattants se saluent ici avant et après l'affrontement.",
    ],
  },
  "octagon": {
    cap: "L'aire de combat de taekwondo",
    legend: [
      "L'octogone : la surface de combat.",
      "La zone de sécurité.",
      "Les marques de départ des deux combattants.",
    ],
  },
  "wrestle": {
    cap: "Le tapis de lutte",
    legend: [
      "La zone centrale de combat ; on reprend au centre après chaque arrêt.",
      "La zone de passivité (bande colorée) : attention à ne pas reculer.",
      "La surface de protection, autour du cercle.",
    ],
  },
  "ring": {
    cap: "Le ring",
    legend: [
      "Les coins : chaque boxeur a le sien, où il retrouve son entraîneur entre les rounds.",
      "Les cordes délimitent le ring.",
      "L'arbitre, au centre, peut arrêter le combat à tout moment.",
    ],
  },
  "piste": {
    cap: "La piste d'escrime",
    legend: [
      "La ligne centrale de la piste.",
      "Les lignes de mise en garde : chaque escrimeur commence derrière la sienne.",
      "La zone d'avertissement : reculer au-delà de la fin de piste donne une touche à l'adversaire.",
    ],
  },
  "track": {
    cap: "Le stade d'athlétisme",
    legend: [
      "La piste de 400 m et ses couloirs : en sprint, chacun reste dans le sien.",
      "La ligne d'arrivée.",
      "La piste d'élan et le sautoir pour les sauts.",
      "Les aires de lancer, au centre du stade.",
    ],
  },
  "flow3": {
    cap: "L'enchaînement du triathlon",
    legend: [
      "On part dans l'eau, souvent en départ groupé.",
      "Les transitions (T1, T2) : on change d'équipement, et le chrono tourne.",
      "On termine par la course à pied. Le premier à franchir la ligne gagne.",
    ],
  },
  "flow5": {
    cap: "Le déroulé du pentathlon moderne",
    legend: [
      "Les épreuves s'enchaînent dans la même journée ; les points s'additionnent.",
      "Le laser run final : course et tir alternés, le premier arrivé gagne le pentathlon.",
    ],
  },
  "orient": {
    cap: "Une carte de course d'orientation",
    legend: [
      "Le départ (triangle).",
      "Les balises à trouver dans l'ordre : l'itinéraire entre deux balises est libre.",
      "L'arrivée (double cercle).",
    ],
  },
  "climb": {
    cap: "Une voie d'escalade",
    legend: [
      "Les prises d'une même couleur forment une voie : on n'utilise que celles-là.",
      "Les dégaines : le grimpeur y passe sa corde au fur et à mesure.",
      "Le relais, en haut de la voie : l'assureur te redescend en douceur.",
    ],
  },
  "golf": {
    cap: "Un trou de golf",
    legend: [
      "Le départ : premier coup, souvent le plus long.",
      "Le fairway, l'herbe tondue qui mène au green. Gare à l'eau !",
      "Le bunker, une fosse de sable piégeuse.",
      "Le green et le drapeau : on y joue au putter jusqu'au trou.",
    ],
  },
  "slalom": {
    cap: "Une piste de slalom",
    legend: [
      "Les portes : il faut passer entre les deux piquets de chaque porte.",
      "On alterne les virages à gauche et à droite, au plus près des piquets.",
      "Le chrono s'arrête à la ligne d'arrivée ; une porte manquée élimine.",
    ],
  },
  "archery": {
    cap: "La cible de tir à l'arc",
    legend: [
      "Le centre jaune rapporte 10 points (et 9 pour l'anneau autour).",
      "Plus la flèche est loin du centre, moins elle rapporte : 1 point pour l'anneau blanc extérieur.",
    ],
  },
  "shoot": {
    cap: "La cible de tir sportif",
    legend: [
      "Le 10, au centre : la zone la plus précieuse.",
      "Les zones extérieures rapportent de moins en moins de points.",
    ],
  },
  "javelot": {
    cap: "La cible de javelot tir sur cible",
    legend: [
      "Le petit cercle central : 2 points.",
      "Entre le petit et le grand cercle : 1 point.",
    ],
  },
  "billiard": {
    cap: "La table de billard",
    legend: [
      "La bille blanche : c'est la seule que tu frappes avec la queue.",
      "Les poches (au billard anglais, américain et au snooker). Le billard français n'en a pas.",
      "Les billes de couleur, à empocher selon les règles du jeu choisi.",
    ],
  },
  "bowling": {
    cap: "La piste de bowling",
    legend: [
      "La ligne de faute : ne la dépasse pas en lançant.",
      "Les flèches de visée, pour viser sans regarder les quilles.",
      "Les 10 quilles, disposées en triangle.",
    ],
  },
  "petanque": {
    cap: "Le terrain de pétanque",
    legend: [
      "Le cercle de lancer : on lance les pieds joints, sans sortir.",
      "Le but (cochonnet) : la cible à approcher.",
      "Pointer, c'est approcher le but ; tirer, c'est déloger la boule adverse.",
    ],
  },
  "chess": {
    cap: "L'échiquier",
    legend: [
      "Les blancs, toujours en premier. Chaque joueur a 16 pièces.",
      "Les noirs répondent : on joue chacun son tour.",
      "64 cases : le but est de mettre le roi adverse échec et mat.",
    ],
  },
  "fronton": {
    cap: "Le fronton de pelote basque",
    legend: [
      "Le fronton : la pelote doit frapper le mur…",
      "…au-dessus de la ligne de faute (rouge).",
      "La cancha, l'aire de jeu : la pelote doit y retomber avant d'être reprise.",
    ],
  },
  "gagne": {
    cap: "Un jeu de gagne-terrain",
    legend: [
      "La ligne qui sépare les deux camps (pas de filet).",
      "La chasse : l'endroit où la balle s'est arrêtée, qui sert de repère pour gagner du terrain.",
      "Les équipes se renvoient la balle ; on change de camp au fil des chasses.",
    ],
  },
  "para": {
    cap: "Les étapes d'un saut",
    legend: [
      "Le largage depuis l'avion.",
      "La chute libre : quelques dizaines de secondes de vol.",
      "L'ouverture du parachute, puis le pilotage de la voile.",
      "L'atterrissage, sur une zone balisée.",
    ],
  },
  "curling": {
    cap: "La piste de curling",
    legend: [
      "Le lanceur glisse depuis le bloc de départ et lâche la pierre avant la ligne.",
      "La maison : les pierres les plus proches du centre marquent.",
      "Les balayeurs frottent la glace devant la pierre pour l'aider à aller plus loin et plus droit.",
    ],
  },
};
