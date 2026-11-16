/**
 * Fiches « Comprendre le sport » (89 sports) et fiches discipline (142 sous-disciplines).
 * Contenu rédigé puis vérifié auprès des fédérations le 16 novembre 2026.
 * Clés = identifiants de src/data/disciplines.ts (slugifyDiscipline). Fichier chargé à la demande.
 * Ne pas ajouter de tarif chiffré ; toute nouvelle affirmation doit être sourcée dans `sources`.
 */
export const GUIDES_VERIFIED_ON = "16 novembre 2026";

export interface GuideSource { label: string; url: string }

export interface SportGuide {
  federation: string | null;
  federationCodes: string[];
  accroche: string;
  principe: string;
  jeu: string[];
  materiel: string;
  pourQui: string;
  repere: { format: string; lieu: string; age: string } | null;
  niveaux: string[];
  competitions: string[];
  bienfaits: string[];
  /** 1 = €, 2 = €€, 3 = €€€ (jamais de montant) */
  budget: { niveau: 1 | 2 | 3; texte: string };
  sources: GuideSource[];
}

export interface DisciplineGuide {
  accroche: string;
  principe: string;
  pratique: string[];
  pourQui: string;
  materiel: string;
  format: string;
  lieu: string;
  age: string;
  tags: string[];
}

export const SPORT_GUIDES: Record<string, SportGuide> = {
  "football": {
    "federation": "Fédération française de football",
    "federationCodes": [
      "FFF"
    ],
    "accroche": "Le sport le plus pratiqué en France. Un ballon, deux buts, et des copains : tu peux t'y mettre à tout âge, en compétition ou juste pour le plaisir.",
    "principe": "Deux équipes de 11 joueurs s'affrontent sur un grand terrain en herbe ou synthétique. Le but : envoyer le ballon dans le but adverse en le jouant avec les pieds, la tête ou le corps, jamais avec les mains (sauf le gardien dans sa surface). L'équipe qui marque le plus de buts gagne.",
    "jeu": [
      "Un match dure 2 × 45 minutes chez les adultes, moins chez les jeunes.",
      "Seul le gardien peut toucher le ballon à la main, et uniquement dans sa surface de réparation.",
      "Le hors-jeu empêche d'attendre le ballon derrière la défense adverse : il faut au moins deux adversaires (souvent le gardien et un défenseur) entre toi et la ligne de but au moment de la passe.",
      "Les fautes sont sanctionnées par des coups francs, des penalties et des cartons (jaune = avertissement, rouge = exclusion).",
      "Chez les plus jeunes, on joue à effectif réduit (football à 5, à 8) sur un terrain plus petit pour toucher plus souvent le ballon."
    ],
    "materiel": "Des chaussures à crampons (moulés pour débuter), des protège-tibias obligatoires et des chaussettes hautes. Le maillot et le short sont souvent fournis par le club pour les matchs. Les gardiens ajoutent une paire de gants.",
    "pourQui": "Pour tout le monde, filles et garçons, dès l'école de foot (vers 5 ans). Le club adapte le format à l'âge : jeu réduit pour les petits, foot à 11 à partir de l'adolescence. Les adultes peuvent reprendre en loisir, en foot entreprise ou en Fit Foot.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Catégories par tranche d'âge, de U6-U7 (licence dès 5 ans) jusqu'aux U20, puis seniors et vétérans.",
      "Équipes de niveaux différents dans un même club : une équipe « première » en compétition, d'autres plus loisir.",
      "Pratiques loisirs encadrées par la FFF : foot à 5, futsal, beach soccer, Fit Foot, foot en marchant."
    ],
    "competitions": [
      "Championnats de district (départementaux), puis de ligue (régionaux).",
      "Championnats nationaux amateurs (National 3, National 2, National), puis Ligue 2 et Ligue 1 pour les pros.",
      "Coupe de France, ouverte aux clubs amateurs comme professionnels.",
      "Compétitions féminines dédiées, jusqu'à l'Arkema Première Ligue et l'équipe de France."
    ],
    "bienfaits": [
      "Endurance et explosivité",
      "Coordination et jeu des deux pieds",
      "Esprit d'équipe et lien social",
      "Confiance en soi"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation annuelle au club, plus les chaussures et protège-tibias. C'est l'un des sports les plus accessibles."
    },
    "sources": [
      {
        "label": "FFF — Règlements généraux et catégories",
        "url": "https://www.fff.fr"
      }
    ]
  },
  "football-americain": {
    "federation": "Fédération française de football américain",
    "federationCodes": [
      "FFFA"
    ],
    "accroche": "Stratégie, contacts et grosses accélérations : un sport de plaques où chaque gabarit trouve son poste.",
    "principe": "Deux équipes de 11 joueurs avancent par séquences vers la zone d'en-but adverse. L'attaque dispose de 4 tentatives pour gagner 10 yards ; si elle y parvient, elle repart pour 4 nouvelles tentatives. On marque en portant ou en attrapant le ballon dans l'en-but (touchdown) ou en tapant entre les poteaux.",
    "jeu": [
      "Chaque action est préparée : l'équipe se regroupe, choisit un schéma, puis joue quelques secondes à pleine intensité.",
      "Le ballon avance par la course ou par une passe en avant (une seule par action).",
      "Le touchdown vaut 6 points, la transformation qui suit 1 ou 2 points, le coup de pied entre les poteaux (field goal) 3 points.",
      "Chaque équipe a des joueurs spécialisés : attaque, défense et équipes spéciales (coups de pied).",
      "Le flag football est une version sans contact : on arrête le porteur en lui arrachant un foulard accroché à la ceinture."
    ],
    "materiel": "Casque et épaulières obligatoires en contact, protège-dents, pantalon avec protections. Le club prête souvent le gros équipement aux débutants. Le flag football ne demande qu'une ceinture à foulards et des crampons.",
    "pourQui": "Il y a un poste pour chaque gabarit : les costauds sur la ligne, les rapides en receveurs, les malins au poste de quarterback. Le flag football permet de débuter jeune et sans contact. Le contact complet arrive avec l'âge.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Jeunes (flag), puis contact"
    },
    "niveaux": [
      "Catégories jeunes (U14, U16, U19) puis seniors.",
      "Flag football en loisir comme en compétition, mixte possible.",
      "Progression par poste : chaque joueur apprend un rôle précis."
    ],
    "competitions": [
      "Championnats régionaux puis nationaux (Division 3, Division 2, Élite), et la Ligue Élite lancée en 2026.",
      "Championnats de France de flag football.",
      "Équipes de France de football américain et de flag football. Le flag football fait son entrée aux Jeux olympiques de Los Angeles 2028."
    ],
    "bienfaits": [
      "Puissance et vitesse",
      "Sens tactique",
      "Cohésion d'équipe",
      "Gestion du contact"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence et cotisation, plus un équipement de protection (casque, épaulières) souvent prêté au début puis acheté. Le flag reste très abordable."
    },
    "sources": [
      {
        "label": "FFFA — Championnats Élite",
        "url": "https://www.fffa.org"
      }
    ]
  },
  "rugby": {
    "federation": "Fédération française de rugby",
    "federationCodes": [
      "FFR"
    ],
    "accroche": "Combat, solidarité et troisième mi-temps : le rugby est autant une école de vie qu'un sport.",
    "principe": "Deux équipes de 15 joueurs cherchent à aplatir un ballon ovale derrière la ligne adverse. On avance en courant ballon en main ou au pied, mais on ne passe le ballon à la main qu'en arrière ou à plat. Le défenseur arrête le porteur en le plaquant.",
    "jeu": [
      "Un match de rugby à XV dure 2 × 40 minutes.",
      "Essai = 5 points, transformation = 2 points, pénalité ou drop = 3 points.",
      "Les passes à la main doivent aller vers l'arrière ; un ballon échappé vers l'avant est un « en-avant ».",
      "Mêlées, touches, rucks et mauls organisent les phases de conquête du ballon.",
      "Il existe des formats réduits : rugby à 7 (olympique), à X, à 5 sans plaquage, et touch rugby."
    ],
    "materiel": "Crampons, protège-dents (obligatoire), et éventuellement un casque souple. Le club fournit maillots et shorts de match.",
    "pourQui": "Dès l'école de rugby (baby rugby dès 3 ans, puis catégories par âge). Chaque morphologie a sa place : piliers costauds, ailiers rapides, demis malins. Le rugby à 5 sans plaquage est idéal pour (re)commencer adulte.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Dès 3 ans"
    },
    "niveaux": [
      "École de rugby par tranches d'âge (baby rugby M5-M6, puis M8 à M14), puis cadets, juniors et seniors.",
      "Équipes féminines à tous les âges.",
      "Pratiques loisirs : rugby à 5, rugby santé, rugby entreprise."
    ],
    "competitions": [
      "Championnats territoriaux (Régionale 3, 2, 1), puis Fédérale 3, 2, 1, Nationale 2 et Nationale.",
      "Professionnel : Pro D2 et Top 14.",
      "Élite 1 pour les féminines.",
      "Rugby à 7 : circuit national et jeux olympiques."
    ],
    "bienfaits": [
      "Force et endurance",
      "Courage et dépassement de soi",
      "Solidarité et respect",
      "Lien social fort"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, crampons et protège-dents. Sport accessible, les clubs prêtent souvent les tenues."
    },
    "sources": [
      {
        "label": "FFR — Compétitions et école de rugby",
        "url": "https://www.ffr.fr"
      }
    ]
  },
  "rugby-a-xiii": {
    "federation": "Fédération française de rugby à XIII",
    "federationCodes": [
      "FFR13"
    ],
    "accroche": "Le rugby version spectacle : moins de mêlées, plus de course et de plaquages, avec un fort ancrage dans le Sud de la France.",
    "principe": "Deux équipes de 13 joueurs cherchent à marquer des essais. Après chaque plaquage, le jeu repart très vite par un « tenu » : le joueur plaqué se relève et talonne le ballon vers un coéquipier. L'équipe en attaque dispose de 6 tenus pour marquer, sinon elle rend le ballon.",
    "jeu": [
      "Un match dure 2 × 40 minutes.",
      "Essai = 4 points, transformation = 2 points, pénalité = 2 points, drop = 1 point.",
      "Pas de rucks ni de mauls : le jeu est continu et très lisible.",
      "Au 6e tenu, l'équipe tape souvent au pied pour repousser l'adversaire.",
      "Le XIII fauteuil, très développé en France, se joue en fauteuil roulant, entre valides et personnes handicapées."
    ],
    "materiel": "Crampons, protège-dents, éventuellement casque souple. Tenues de match fournies par le club.",
    "pourQui": "Dès l'école de rugby, filles et garçons. Le rythme rapide plaît à ceux qui aiment courir et plaquer. Le XIII fauteuil est ouvert à tous.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Dès l'école de rugby"
    },
    "niveaux": [
      "Catégories jeunes par âge, puis juniors et seniors.",
      "Équipes féminines.",
      "Rugby à XIII fauteuil, loisir ou compétition."
    ],
    "competitions": [
      "Championnats régionaux puis nationaux : National Division 2 et 1, Élite 2, puis Super XIII (ex-Élite 1).",
      "Coupe de France Lord Derby.",
      "Les Dragons Catalans (Perpignan) jouent en Super League anglaise, le plus haut niveau européen du XIII."
    ],
    "bienfaits": [
      "Explosivité",
      "Endurance",
      "Courage",
      "Esprit collectif"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, crampons et protège-dents : sport très accessible."
    },
    "sources": [
      {
        "label": "FFR XIII — Super XIII et Élite 2",
        "url": "https://www.ffr13.fr"
      }
    ]
  },
  "basketball": {
    "federation": "Fédération française de basketball",
    "federationCodes": [
      "FFBB"
    ],
    "accroche": "Rythmé, aérien et très technique : le basket se joue en salle toute l'année, et en 3x3 dès que le soleil revient.",
    "principe": "Deux équipes de 5 joueurs essaient de mettre le ballon dans le panier adverse, placé à 3,05 m de haut. On avance en dribblant (en faisant rebondir le ballon) ou en faisant des passes. Le contact est limité : c'est un sport d'adresse et de vitesse.",
    "jeu": [
      "Un match dure 4 quart-temps de 10 minutes (règles FIBA).",
      "Panier = 2 points, tir derrière la ligne à 3 points = 3 points, lancer franc = 1 point.",
      "On ne peut pas marcher avec le ballon sans dribbler, ni reprendre son dribble après l'avoir arrêté.",
      "L'équipe en attaque a 24 secondes pour tirer.",
      "Le 3x3, discipline olympique, se joue sur un demi-terrain, avec un seul panier, en 10 minutes ou 21 points."
    ],
    "materiel": "Des chaussures de salle qui maintiennent bien la cheville, un short et un tee-shirt. Le club fournit ballons et maillots de match.",
    "pourQui": "Dès 5 ans en baby basket et mini-basket, avec des paniers plus bas et des ballons plus petits. Pas besoin d'être grand pour débuter : les meneurs de jeu sont souvent les plus petits sur le terrain.",
    "repere": {
      "format": "En équipe",
      "lieu": "Salle",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Catégories par âge (U7 à U20), puis seniors.",
      "Différents niveaux de championnat selon les envies, du loisir à l'élite.",
      "Basket santé, basket loisir et 3x3 pour les adultes."
    ],
    "competitions": [
      "Championnats départementaux et régionaux.",
      "Nationale 3, 2, 1 puis professionnel : Élite 2 et Betclic Élite (hommes), La Boulangère Wonderligue (femmes).",
      "Circuits 3x3 en extérieur l'été.",
      "Coupe de France."
    ],
    "bienfaits": [
      "Coordination et adresse",
      "Vitesse et détente",
      "Esprit d'équipe",
      "Prise de décision rapide"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, plus une bonne paire de chaussures de salle. Sport très accessible."
    },
    "sources": [
      {
        "label": "LNB — Betclic Élite et Élite 2",
        "url": "https://www.lnb.fr"
      },
      {
        "label": "FFBB",
        "url": "https://www.ffbb.com"
      }
    ]
  },
  "handball": {
    "federation": "Fédération française de handball",
    "federationCodes": [
      "FFHB"
    ],
    "accroche": "Rapide, physique et spectaculaire : le sport des « Experts » et des championnes du monde, qui se découvre en salle dès 3 ans.",
    "principe": "Deux équipes de 7 joueurs (6 de champ et 1 gardien) se disputent un ballon joué à la main. Le but : marquer en tirant dans le but adverse, sans jamais entrer dans la zone de 6 mètres réservée au gardien. Le jeu est très rapide, les buts s'enchaînent.",
    "jeu": [
      "Un match dure 2 × 30 minutes chez les seniors.",
      "Tu peux faire 3 pas avec le ballon en main, et le garder 3 secondes maximum sans dribbler.",
      "Personne, sauf le gardien, n'entre dans la zone : les tirs se font souvent en suspension au-dessus.",
      "Les fautes graves sont sanctionnées par un jet de 7 mètres (penalty) et des exclusions de 2 minutes.",
      "Le jeu passif est sanctionné : l'attaque doit chercher à marquer."
    ],
    "materiel": "Des chaussures de salle, un short et un tee-shirt. Le club fournit ballons et maillots.",
    "pourQui": "Dès 3 ans avec le BabyHand, puis école de hand. Filles et garçons jouent dans de nombreux clubs. Le HandFit permet aux adultes de faire du sport santé sans compétition.",
    "repere": {
      "format": "En équipe",
      "lieu": "Salle",
      "age": "Dès 3 ans"
    },
    "niveaux": [
      "Catégories par âge (−11, −13, −15, −18 ans), puis seniors.",
      "Équipes masculines, féminines et parfois mixtes chez les jeunes.",
      "HandFit et hand loisir pour les adultes."
    ],
    "competitions": [
      "Championnats départementaux, régionaux puis nationaux (Nationale 3, 2, 1).",
      "Professionnel : Proligue et Liqui Moly Starligue (hommes), Ligue Butagaz Énergie (femmes).",
      "Coupe de France."
    ],
    "bienfaits": [
      "Explosivité et vitesse",
      "Adresse",
      "Esprit collectif",
      "Résistance aux contacts"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, plus une paire de chaussures de salle."
    },
    "sources": [
      {
        "label": "FFHB — fiche fédération (France Olympique, 2026)",
        "url": "https://ressources-associations-sportives.franceolympique.com"
      },
      {
        "label": "FFHB",
        "url": "https://www.ffhandball.fr"
      }
    ]
  },
  "volley": {
    "federation": "Fédération française de volley",
    "federationCodes": [
      "FFVB"
    ],
    "accroche": "Aucun contact, beaucoup d'entraide : au volley, impossible de gagner seul. En salle l'hiver, sur le sable l'été.",
    "principe": "Deux équipes de 6 joueurs, séparées par un filet, se renvoient le ballon. Chaque équipe a droit à 3 touches pour renvoyer le ballon chez l'adversaire, en général une réception, une passe et une attaque (le smash). Le point est marqué quand le ballon touche le sol adverse.",
    "jeu": [
      "On joue en sets de 25 points (15 points au 5e set), il faut 2 points d'écart.",
      "Le premier à remporter 3 sets gagne le match.",
      "Un joueur ne peut pas toucher le ballon deux fois de suite.",
      "Les joueurs tournent à chaque reprise du service : tout le monde passe à chaque poste.",
      "Le beach-volley se joue à 2 contre 2 sur sable, en 2 sets gagnants de 21 points."
    ],
    "materiel": "Chaussures de salle, genouillères recommandées, short et tee-shirt. Le club fournit les ballons.",
    "pourQui": "Dès 6 ans avec le baby-volley et le volley à 2 ou 3 sur petit terrain. Sans contact, il convient très bien aux équipes mixtes et aux adultes qui débutent.",
    "repere": {
      "format": "En équipe",
      "lieu": "Salle et sable",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Catégories jeunes (M9 à M21), puis seniors.",
      "Volley loisir mixte, souvent sans classement strict.",
      "Beach-volley, snow-volley, volley assis (paravolley)."
    ],
    "competitions": [
      "Championnats départementaux, régionaux, puis nationaux (Nationale 3, 2, Élite).",
      "Professionnel : Marmara SpikeLigue (hommes) et Saforelle Power 6 (femmes).",
      "Tournois de beach-volley l'été."
    ],
    "bienfaits": [
      "Réflexes et détente",
      "Coordination",
      "Communication",
      "Sport sans contact"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, chaussures de salle et genouillères."
    },
    "sources": [
      {
        "label": "FFVolley — Marmara SpikeLigue, Saforelle Power 6",
        "url": "https://www.ffvolley.org"
      }
    ]
  },
  "hockey-sur-gazon": {
    "federation": "Fédération française de hockey",
    "federationCodes": [
      "FFH"
    ],
    "accroche": "Un sport olympique rapide et technique, encore peu connu en France : idéal pour découvrir un nouveau jeu collectif.",
    "principe": "Deux équipes de 11 joueurs (dont un gardien) font avancer une petite balle dure avec une crosse, uniquement avec la face plate de celle-ci. Le but : marquer dans le but adverse, en tirant depuis l'intérieur du cercle face au but.",
    "jeu": [
      "Un match dure 4 × 15 minutes.",
      "On ne touche pas la balle avec le pied ni avec la face arrondie de la crosse.",
      "Un but n'est valable que si le tir part de l'intérieur du cercle.",
      "Les fautes dans le cercle donnent des « corners courts » (pénalités) très tactiques.",
      "L'hiver, on joue souvent en salle (hockey en salle), à 6 joueurs."
    ],
    "materiel": "Une crosse, des protège-tibias et un protège-dents. Les gardiens portent un équipement complet, souvent fourni par le club.",
    "pourQui": "Dès 5-6 ans, filles et garçons. C'est un sport sans contact, très mixte dans les petites catégories.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur et salle",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Catégories par âge (U8 à U19), puis seniors et vétérans.",
      "Hockey en salle l'hiver, hockey sur gazon le reste de l'année.",
      "Hockey loisir et hockey 5."
    ],
    "competitions": [
      "Championnats régionaux puis nationaux (Nationale 2, Nationale 1, Élite).",
      "Championnats de France en salle.",
      "Équipes de France, présentes aux Jeux de Paris 2024."
    ],
    "bienfaits": [
      "Coordination œil-main",
      "Vitesse",
      "Endurance",
      "Lecture du jeu"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, une crosse et des protège-tibias."
    },
    "sources": [
      {
        "label": "FFH — guide du hockey éducatif",
        "url": "https://www.ffhockey.org"
      }
    ]
  },
  "hockey-sur-glace": {
    "federation": "Fédération française de hockey sur glace",
    "federationCodes": [
      "FFHG"
    ],
    "accroche": "Vitesse, glisse et intensité : un des sports collectifs les plus rapides du monde.",
    "principe": "Deux équipes de 6 joueurs (5 et un gardien), en patins, poussent un palet avec leur crosse pour le mettre dans le but adverse. Les joueurs changent très souvent pendant le match car l'effort est très intense.",
    "jeu": [
      "Un match dure 3 tiers-temps de 20 minutes de jeu effectif.",
      "Les remplacements se font à la volée, sans arrêter le jeu.",
      "Le hors-jeu interdit d'entrer dans la zone adverse avant le palet.",
      "Les fautes sont punies par des pénalités : le joueur va en « prison » et son équipe joue en infériorité.",
      "Les mises en jeu se font par un engagement entre deux joueurs."
    ],
    "materiel": "Patins, casque avec grille, gants, jambières, épaulières, coudières, culotte rembourrée, protège-cou. Les clubs prêtent souvent l'équipement aux débutants.",
    "pourQui": "Dès 4-5 ans à l'école de patinage, puis catégories par âge. Il faut d'abord apprendre à patiner : le club s'en charge. Filles et garçons sont acceptés.",
    "repere": {
      "format": "En équipe",
      "lieu": "Patinoire",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Catégories jeunes (U7 à U20), puis seniors.",
      "Hockey loisir pour adultes, souvent avec moins de contacts.",
      "Sections féminines."
    ],
    "competitions": [
      "Championnats jeunes puis Division 3, 2, 1.",
      "Ligue Magnus, le plus haut niveau national.",
      "Coupe de France."
    ],
    "bienfaits": [
      "Équilibre et glisse",
      "Vitesse",
      "Puissance",
      "Réflexes"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Équipement complet coûteux à l'achat (prêté au début dans beaucoup de clubs), cotisation incluant souvent les heures de glace."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.hockeyfrance.com"
      }
    ]
  },
  "baseball-softball": {
    "federation": "Fédération française de baseball et softball",
    "federationCodes": [
      "FFBS"
    ],
    "accroche": "Lancer, frapper, courir : un sport stratégique et convivial, où chacun passe à la batte.",
    "principe": "Deux équipes de 9 joueurs alternent attaque et défense. En attaque, le batteur tente de frapper la balle lancée par le lanceur adverse, puis court autour de 4 bases. Faire le tour complet marque un point. En défense, on essaie d'éliminer 3 joueurs adverses pour reprendre la batte.",
    "jeu": [
      "Un match de baseball se joue en 9 manches (7 en softball).",
      "Le batteur est éliminé après 3 prises (balles ratées ou bien lancées non frappées).",
      "Une balle frappée et attrapée en l'air élimine directement le batteur.",
      "Le softball utilise une balle plus grosse, lancée par en dessous, sur un terrain plus petit.",
      "Le slowpitch, version loisir du softball, se joue souvent en mixte."
    ],
    "materiel": "Un gant adapté au poste, des crampons. Le club fournit battes, casques et balles.",
    "pourQui": "Dès 6 ans avec le beeball et le teeball (la balle est posée sur un support). Les postes très variés permettent à chacun de trouver le sien.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Catégories jeunes (U9 à U18), puis seniors.",
      "Baseball, softball, slowpitch mixte loisir.",
      "Baseball5, une version urbaine sans batte jouée à la main."
    ],
    "competitions": [
      "Championnats régionaux, puis Nationale 1, Division 2 et Division 1.",
      "Championnats de France de softball et de slowpitch.",
      "Le baseball et le softball reviennent aux Jeux olympiques de 2028."
    ],
    "bienfaits": [
      "Coordination",
      "Explosivité",
      "Concentration",
      "Esprit d'équipe"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, un gant et des crampons. Le gros matériel est fourni par le club."
    },
    "sources": [
      {
        "label": "FFBS — championnats et Baseball5",
        "url": "https://ffbs.fr"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.ffbs.fr"
      }
    ]
  },
  "ultimate-et-disc": {
    "federation": "Fédération française de flying disc",
    "federationCodes": [
      "FFFD"
    ],
    "accroche": "Un sport collectif sans arbitre, mixte et sans contact, joué avec un disque. L'esprit du jeu est au cœur de la pratique.",
    "principe": "Deux équipes de 7 joueurs se font des passes avec un disque pour l'attraper dans l'en-but adverse. Celui qui tient le disque ne peut pas courir : il pivote et cherche un coéquipier démarqué. Si le disque tombe ou est intercepté, l'autre équipe attaque.",
    "jeu": [
      "Un point est marqué quand un joueur attrape le disque dans l'en-but adverse.",
      "Le porteur a 10 secondes pour faire sa passe.",
      "Aucun contact n'est autorisé entre les joueurs.",
      "Pas d'arbitre : les joueurs appellent eux-mêmes les fautes, c'est l'« esprit du jeu ».",
      "Le disc golf, autre discipline de la fédération, consiste à viser des paniers en un minimum de lancers."
    ],
    "materiel": "Des crampons pour l'herbe, des chaussures de salle en hiver. Le club fournit les disques.",
    "pourQui": "Pour tous, dès 8-10 ans. C'est l'un des rares sports collectifs pensés dès le départ pour la mixité.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur et salle",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Catégories jeunes, puis seniors (open, femmes, mixte).",
      "Ultimate en salle l'hiver, sur herbe ou sur plage l'été.",
      "Disc golf, freestyle et autres disciplines du disque."
    ],
    "competitions": [
      "Championnats de France par catégorie, en salle et en extérieur.",
      "Tournois amicaux très nombreux.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Course et endurance",
      "Adresse",
      "Fair-play",
      "Mixité"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, un disque et des crampons."
    },
    "sources": [
      {
        "label": "Fédération française de flying disc",
        "url": "https://www.ff-flyingdisc.fr"
      }
    ]
  },
  "polo": {
    "federation": "Fédération française de polo",
    "federationCodes": [
      "FFP"
    ],
    "accroche": "Le sport collectif à cheval par excellence : vitesse, maniement du maillet et complicité avec ta monture.",
    "principe": "Deux équipes de 4 cavaliers frappent une balle avec un long maillet pour l'envoyer entre les poteaux adverses. Le jeu est rapide et demande de parfaitement maîtriser son cheval.",
    "jeu": [
      "Un match est découpé en périodes appelées « chukkas », d'environ 7 minutes.",
      "Les cavaliers changent de cheval entre les chukkas pour qu'ils récupèrent.",
      "On frappe la balle avec le maillet tenu de la main droite.",
      "La « ligne de la balle » fixe des priorités : on ne coupe pas la trajectoire d'un adversaire.",
      "Chaque joueur a un handicap (niveau) ; les équipes sont équilibrées grâce à lui."
    ],
    "materiel": "Casque, bottes, genouillères, maillet, et surtout un ou plusieurs chevaux (louables au club).",
    "pourQui": "Il faut savoir monter à cheval : beaucoup de clubs proposent une initiation pour les cavaliers déjà à l'aise. Le polo est pratiqué à partir de l'adolescence.",
    "repere": {
      "format": "En équipe",
      "lieu": "À cheval",
      "age": "Cavaliers à l'aise"
    },
    "niveaux": [
      "Classement par handicap, de −2 à +10.",
      "Initiation, polo loisir, tournois de niveau croissant.",
      "Variantes : polo sur neige, arena polo."
    ],
    "competitions": [
      "Tournois de clubs classés par handicap d'équipe.",
      "Championnat de France et Open de France.",
      "Tournois internationaux."
    ],
    "bienfaits": [
      "Équitation de haut niveau",
      "Coordination",
      "Prise de décision",
      "Esprit d'équipe"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Sport onéreux : location ou pension des chevaux, cours et équipement. Certains clubs proposent des formules découverte."
    },
    "sources": [
      {
        "label": "Fédération française de polo",
        "url": "https://www.francepolo.com"
      }
    ]
  },
  "tennis": {
    "federation": "Fédération française de tennis",
    "federationCodes": [
      "FFT"
    ],
    "accroche": "Un sport de duel qui se joue toute la vie, en simple ou en double, et qui ouvre aussi la porte au padel et au pickleball.",
    "principe": "Deux joueurs (ou deux équipes de deux) se renvoient une balle par-dessus un filet avec une raquette. La balle doit rebondir au maximum une fois dans le camp adverse, à l'intérieur des lignes. Tu marques le point quand ton adversaire ne parvient pas à la renvoyer correctement.",
    "jeu": [
      "Les points se comptent 15, 30, 40, jeu. À 40-40 (égalité), il faut deux points d'affilée pour gagner le jeu.",
      "Il faut 6 jeux (avec 2 d'écart) pour remporter un set, sinon on joue un jeu décisif (tie-break).",
      "Un match se joue en 2 sets gagnants (3 en Grand Chelem chez les hommes).",
      "Le service alterne à chaque jeu ; tu as droit à deux essais pour servir.",
      "La FFT encadre aussi le padel, le beach tennis et le pickleball."
    ],
    "materiel": "Une raquette adaptée à ta taille et ton niveau, des chaussures de tennis selon la surface (terre battue, dur), des balles. Les clubs prêtent des raquettes pour débuter.",
    "pourQui": "Dès 4-5 ans avec le mini-tennis (balles plus lentes, terrains réduits). On peut commencer ou reprendre à tout âge, en cours collectif ou en loisir.",
    "repere": {
      "format": "Simple ou double",
      "lieu": "Extérieur et couvert",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Classement national : non classé, puis 4e série (40 à 30/1), 3e, 2e et 1re série.",
      "Galaxie Tennis pour les enfants : niveaux par couleur (blanc, violet, rouge, orange, vert).",
      "Tennis loisir, tennis santé, padel, beach tennis."
    ],
    "competitions": [
      "Tournois homologués ouverts à tous, partout en France.",
      "Championnats par équipes départementaux, régionaux et nationaux.",
      "Grand Chelem à Roland-Garros, Masters 1000 et circuit professionnel."
    ],
    "bienfaits": [
      "Coordination et réflexes",
      "Endurance",
      "Mental et concentration",
      "Sport pratiqué toute la vie"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation au club (accès aux terrains) et cours souvent en supplément. Une raquette et des balles."
    },
    "sources": [
      {
        "label": "FFT — Galaxie Tennis et classement",
        "url": "https://www.fft.fr"
      }
    ]
  },
  "badminton": {
    "federation": "Fédération française de badminton",
    "federationCodes": [
      "FFBaD"
    ],
    "accroche": "Le sport de raquette le plus rapide du monde, et pourtant on s'amuse dès la première séance. Très convivial, souvent mixte.",
    "principe": "En simple ou en double, on se renvoie un volant par-dessus un filet haut avec une raquette légère. Le volant ne doit jamais toucher le sol dans ton camp. Tu marques un point à chaque échange gagné, que tu serves ou non.",
    "jeu": [
      "Un match se joue en 2 sets gagnants de 21 points (avec 2 points d'écart, maximum 30).",
      "Le service se fait par en dessous, en diagonale.",
      "Le volant est frappé une seule fois par chaque camp.",
      "Cinq tableaux : simple homme, simple dame, double homme, double dame, double mixte.",
      "Le jeu alterne coups puissants (smash) et coups délicats (amortis, contre-amortis)."
    ],
    "materiel": "Une raquette légère, des chaussures de salle et des volants (le club en fournit souvent à l'entraînement).",
    "pourQui": "Dès 6-7 ans au minibad. Facile à prendre en main, il convient aux débutants adultes comme aux familles. Le parabadminton se joue debout ou en fauteuil.",
    "repere": {
      "format": "Simple ou double",
      "lieu": "Salle",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Classement par séries, de NC (non classé) à N1 en passant par P12-P10, D9-D7, R6-R4, N3-N1 (nouveau mode de calcul depuis septembre 2025).",
      "Badminton loisir, souvent en créneaux libres.",
      "Catégories jeunes de minibad à junior, puis seniors et vétérans."
    ],
    "competitions": [
      "Tournois ouverts tous les week-ends, par niveau de classement.",
      "Interclubs départementaux, régionaux et nationaux, jusqu'au Top 12.",
      "Internationaux de France et Jeux olympiques."
    ],
    "bienfaits": [
      "Réflexes et vitesse",
      "Cardio",
      "Coordination",
      "Sport mixte et convivial"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, une raquette et une paire de chaussures de salle. Les volants plume représentent un coût régulier pour les compétiteurs."
    },
    "sources": [
      {
        "label": "FFBaD — classement (réforme 2025)",
        "url": "https://www.ffbad.org"
      }
    ]
  },
  "tennis-de-table": {
    "federation": "Fédération française de tennis de table",
    "federationCodes": [
      "FFTT"
    ],
    "accroche": "Le ping, c'est bien plus qu'un jeu de vacances : effets, vitesse et réflexes en font un vrai sport, accessible à tous les âges.",
    "principe": "Deux joueurs (ou deux paires) se renvoient une petite balle de 40 mm par-dessus un filet posé sur une table. La balle doit rebondir une fois dans chaque camp. Les effets donnés à la balle (lift, coupé) sont au cœur du jeu.",
    "jeu": [
      "Une manche se joue en 11 points, avec 2 points d'écart.",
      "Un match se gagne en 3 ou 4 manches gagnantes.",
      "Le service change tous les 2 points.",
      "Au service, la balle doit rebondir une fois de ton côté puis une fois de l'autre.",
      "En double, les partenaires frappent la balle à tour de rôle."
    ],
    "materiel": "Une raquette (le club en prête au début), des chaussures de salle, un short et un tee-shirt. Les compétiteurs choisissent bois et revêtements selon leur jeu.",
    "pourQui": "Dès 4-5 ans avec le baby ping, et jusqu'à un âge très avancé. Le handisport y est très développé, debout comme en fauteuil.",
    "repere": {
      "format": "Simple ou double",
      "lieu": "Salle",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Classement par points : chaque match gagné ou perdu fait évoluer ton total.",
      "Catégories par âge (poussins à juniors, seniors, vétérans).",
      "Ping loisir, ping santé, fit ping."
    ],
    "competitions": [
      "Championnat par équipes, de la départementale à la Pro A.",
      "Critérium fédéral en individuel.",
      "Championnats de France et circuit international."
    ],
    "bienfaits": [
      "Réflexes",
      "Coordination",
      "Concentration",
      "Pratique à vie"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, une raquette. Un des sports les plus abordables."
    },
    "sources": [
      {
        "label": "FFTT — Pro A, Pro B, critérium fédéral",
        "url": "https://www.fftt.com"
      }
    ]
  },
  "squash": {
    "federation": "Fédération française de squash",
    "federationCodes": [
      "FFSquash"
    ],
    "accroche": "Un défoulement intense en 45 minutes : le squash fait travailler le cardio comme peu d'autres sports.",
    "principe": "Deux joueurs frappent à tour de rôle une petite balle contre le mur avant d'une salle fermée. La balle peut toucher les murs latéraux et arrière, mais ne doit rebondir qu'une fois au sol avant d'être reprise.",
    "jeu": [
      "Un jeu se gagne en 11 points, avec 2 points d'écart ; un match se joue en 3 jeux gagnants.",
      "Chaque échange rapporte un point, quel que soit le serveur.",
      "La balle doit frapper le mur avant entre la ligne du bas (la « tôle ») et la ligne du haut.",
      "Les joueurs partagent le même espace : il faut libérer le passage à son adversaire.",
      "En cas de gêne, on demande un « let » (le point est rejoué)."
    ],
    "materiel": "Une raquette de squash, des lunettes de protection (obligatoires chez les jeunes), des chaussures de salle à semelle claire, des balles adaptées au niveau.",
    "pourQui": "Dès 7-8 ans. Idéal pour les adultes pressés qui veulent un sport complet. Les balles à rebond plus vif rendent le jeu accessible aux débutants.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Classement national par points.",
      "Balles repérées par un point de couleur selon le niveau : de la balle d'initiation, qui rebondit le plus, à la balle double point jaune des confirmés.",
      "Squash loisir, catégories jeunes et vétérans."
    ],
    "competitions": [
      "Tournois régionaux et nationaux classés.",
      "Championnats de France individuels et par équipes.",
      "Circuit professionnel PSA ; le squash entre aux Jeux olympiques de 2028."
    ],
    "bienfaits": [
      "Cardio intense",
      "Agilité",
      "Réflexes",
      "Mental"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation ou location de court, raquette et lunettes de protection."
    },
    "sources": [
      {
        "label": "FFSquash — balles et classement",
        "url": "https://www.ffsquash.com"
      }
    ]
  },
  "natation": {
    "federation": "Fédération française de natation",
    "federationCodes": [
      "FFN"
    ],
    "accroche": "Le sport complet par excellence, doux pour les articulations. Et un club de natation, ce n'est pas que des longueurs : water-polo, artistique, eau libre…",
    "principe": "Il s'agit de parcourir une distance dans l'eau le plus vite possible, dans l'une des quatre nages : crawl (nage libre), dos, brasse et papillon. En club, tu apprends à bien nager, puis à nager vite, avec un entraîneur qui corrige ta technique.",
    "jeu": [
      "Les courses vont de 50 m à 1 500 m en bassin, et jusqu'à 10 km en eau libre.",
      "Chaque nage a ses règles de mouvement (par exemple, en brasse, bras et jambes bougent en même temps).",
      "Le 4 nages enchaîne papillon, dos, brasse et crawl.",
      "Les relais se courent à 4 nageurs.",
      "La FFN regroupe aussi le water-polo, la natation artistique, le plongeon et l'eau libre."
    ],
    "materiel": "Un maillot, un bonnet, des lunettes de natation. Plaquettes, pull-buoy et palmes s'ajoutent pour l'entraînement.",
    "pourQui": "Dès le plus jeune âge avec les bébés nageurs et le jardin aquatique, puis l'école de natation. Les adultes peuvent apprendre, se perfectionner ou nager en « Maîtres » (compétition dès 25 ans).",
    "repere": {
      "format": "Individuel et relais",
      "lieu": "Piscine",
      "age": "Dès les bébés nageurs"
    },
    "niveaux": [
      "Parcours de l'École de natation française : Sauv'nage, Pass'sports de l'eau, Pass'compétition.",
      "Catégories par âge (avenirs, jeunes, juniors, seniors), puis Maîtres.",
      "Natation santé, aquaforme, natation loisir."
    ],
    "competitions": [
      "Meetings et interclubs départementaux et régionaux.",
      "Championnats de France par catégorie.",
      "Championnats d'Europe, du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Travail de tout le corps",
      "Cardio sans chocs",
      "Souffle",
      "Bien-être"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation incluant l'accès aux créneaux de bassin, plus maillot, bonnet et lunettes."
    },
    "sources": [
      {
        "label": "FFN — École de natation française",
        "url": "https://www.ffnatation.fr"
      }
    ]
  },
  "plongee-et-sports-sous-marins": {
    "federation": "Fédération française d'études et de sports sous-marins",
    "federationCodes": [
      "FFESSM"
    ],
    "accroche": "Découvrir un monde silencieux, apprendre à respirer sous l'eau, explorer épaves et récifs : la plongée ouvre un univers à part.",
    "principe": "La plongée consiste à évoluer sous l'eau, avec une bouteille d'air (scaphandre) ou en apnée. En club, tu suis une formation progressive : d'abord en piscine, puis en milieu naturel, toujours accompagné. La fédération regroupe aussi de nombreuses activités : nage avec palmes, hockey subaquatique, photo, biologie…",
    "jeu": [
      "On plonge toujours au moins à deux (en binôme), jamais seul.",
      "Chaque niveau te donne le droit de descendre à une profondeur maximale.",
      "Des règles de remontée lente et de paliers protègent ton corps de la pression.",
      "Le baptême de plongée se fait en piscine ou à faible profondeur avec un moniteur.",
      "Les clubs organisent des sorties en mer, en lac ou en carrière."
    ],
    "materiel": "Masque, palmes et tuba pour commencer. Combinaison, gilet stabilisateur, détendeur et bouteille sont en général prêtés par le club pendant la formation.",
    "pourQui": "Dès 8 ans avec les formations enfants (Plongeur de bronze et d'argent dès 8 ans, d'or dès 10 ans) ; le Niveau 1 est accessible dès 12 ans. Il faut un certificat médical spécifique. La plongée est accessible aux personnes en situation de handicap avec des moniteurs formés.",
    "repere": {
      "format": "En binôme",
      "lieu": "Piscine et mer",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Niveaux 1 à 3 du plongeur (de 20 m encadré à 60 m en autonomie, Niveau 3 dès 18 ans), puis guide de palanquée (niveau 4) et moniteur.",
      "Brevets spécifiques : Nitrox, recycleur, Trimix, plongée souterraine.",
      "Niveaux d'apnée et de nage avec palmes."
    ],
    "competitions": [
      "La plongée bouteille n'est pas une compétition, mais de nombreuses disciplines de la FFESSM le sont : nage avec palmes, apnée, hockey subaquatique, tir sur cible, orientation.",
      "Championnats de France et internationaux dans ces disciplines."
    ],
    "bienfaits": [
      "Gestion du stress et du souffle",
      "Découverte de la nature",
      "Sens des responsabilités",
      "Calme et concentration"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, formation et sorties en milieu naturel. L'achat de son propre matériel se fait progressivement."
    },
    "sources": [
      {
        "label": "FFESSM — cursus et âges de formation",
        "url": "https://plongee.ffessm.fr"
      },
      {
        "label": "Site de la fédération",
        "url": "https://ffessm.fr"
      }
    ]
  },
  "chasse-sous-marine": {
    "federation": "Fédération française de pêche sportive en apnée",
    "federationCodes": [
      "FFPSA"
    ],
    "accroche": "Pêcher en apnée, au fusil, dans le respect de la mer : une activité qui mêle sport, patience et connaissance du milieu.",
    "principe": "Le chasseur sous-marin plonge en apnée (sans bouteille) pour pêcher des poissons avec un fusil sous-marin. Il doit connaître les espèces, leurs tailles minimales et les zones autorisées. C'est autant une activité d'observation que de pêche.",
    "jeu": [
      "La pêche se fait uniquement en apnée : la bouteille est interdite pour pêcher.",
      "Des tailles minimales de capture et des espèces protégées doivent être respectées.",
      "Il faut signaler sa présence en surface avec une bouée.",
      "La vente des prises est interdite pour les pêcheurs de loisir.",
      "En compétition, on compte le poids et le nombre d'espèces capturées."
    ],
    "materiel": "Combinaison néoprène, masque, tuba, longues palmes, ceinture de plombs, bouée de signalisation, fusil et couteau.",
    "pourQui": "À partir de 16 ans pour la pêche sous-marine en France. Il faut savoir bien nager et maîtriser l'apnée : les clubs proposent une formation à la sécurité.",
    "repere": {
      "format": "Individuel",
      "lieu": "Mer",
      "age": "Dès 16 ans"
    },
    "niveaux": [
      "Formation à l'apnée et à la sécurité.",
      "Pratique loisir encadrée par le club.",
      "Compétition par équipes ou en individuel."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France.",
      "Championnats internationaux."
    ],
    "bienfaits": [
      "Maîtrise de l'apnée",
      "Connaissance de la mer",
      "Calme",
      "Endurance"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation et équipement complet à acheter (combinaison, palmes, fusil)."
    },
    "sources": [
      {
        "label": "Ministère des Sports — délégation FFPSA",
        "url": "https://www.sports.gouv.fr"
      }
    ]
  },
  "voile": {
    "federation": "Fédération française de voile",
    "federationCodes": [
      "FFVoile"
    ],
    "accroche": "Glisser sur l'eau grâce au vent, seul ou en équipage : la voile se pratique sur la mer comme sur les lacs, de l'Optimist au catamaran.",
    "principe": "Il s'agit de faire avancer un bateau ou une planche en utilisant la force du vent dans la voile. On apprend à régler sa voile, à diriger le bateau et à lire le vent et les vagues. En régate, il faut faire un parcours balisé le plus vite possible.",
    "jeu": [
      "On peut naviguer sur dériveur, catamaran, planche à voile, kitesurf, wingfoil ou habitable.",
      "En régate, les bateaux partent ensemble et tournent autour de bouées.",
      "Des règles de priorité évitent les collisions (bâbord/tribord, au vent/sous le vent).",
      "On ne peut pas remonter directement face au vent : on tire des bords en zigzag.",
      "Le gilet de sauvetage est obligatoire pour les débutants et les jeunes."
    ],
    "materiel": "Une combinaison et un gilet de sauvetage. Les bateaux sont souvent fournis par le club ou l'école de voile.",
    "pourQui": "Dès 7 ans environ sur Optimist ou petit catamaran. Il faut savoir nager. Les adultes débutent en stage ou en cours collectif.",
    "repere": {
      "format": "Solo ou équipage",
      "lieu": "Mer et lacs",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Niveaux de compétence de la FFVoile, de la découverte à l'autonomie.",
      "Catégories de régate par âge et par support.",
      "Voile loisir, croisière, voile légère, glisse (kite, wing)."
    ],
    "competitions": [
      "Régates de club, de ligue et championnats de France.",
      "Grandes courses au large (Route du Rhum, Vendée Globe) pour les professionnels.",
      "Jeux olympiques dans plusieurs séries."
    ],
    "bienfaits": [
      "Lecture de la nature",
      "Équilibre",
      "Esprit d'équipage",
      "Autonomie"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation ou stage avec mise à disposition du bateau. Posséder son bateau ajoute des frais importants."
    },
    "sources": [
      {
        "label": "FFVoile — niveaux techniques",
        "url": "https://www.ffvoile.fr"
      }
    ]
  },
  "aviron": {
    "federation": "Fédération française d'aviron",
    "federationCodes": [
      "FFAviron"
    ],
    "accroche": "Un sport complet qui fait travailler jambes, dos et bras, au rythme de l'équipage, sur une rivière ou un lac.",
    "principe": "Le rameur, assis dos au sens de la marche sur un siège coulissant, propulse un bateau long et fin avec des avirons (rames). On pousse avec les jambes, puis on tire avec le dos et les bras. En équipage, il faut ramer parfaitement ensemble.",
    "jeu": [
      "En « couple », chaque rameur tient deux avirons ; en « pointe », un seul aviron tenu à deux mains.",
      "Les bateaux vont du skiff (1 rameur) au huit (8 rameurs et un barreur).",
      "Les courses olympiques se font sur 2 000 m en ligne droite.",
      "L'aviron de mer et le beach rowing se pratiquent sur la mer, en bateaux plus larges.",
      "L'aviron indoor se pratique sur rameur (ergomètre)."
    ],
    "materiel": "Une tenue près du corps et des chaussures fixées au bateau. Les bateaux et avirons appartiennent au club.",
    "pourQui": "Dès 10-11 ans, après une attestation de natation (50 m). Il est très apprécié des adultes qui débutent : l'aviron santé est adapté à tous.",
    "repere": {
      "format": "Solo ou équipage",
      "lieu": "Rivières et lacs",
      "age": "Dès 10 ans"
    },
    "niveaux": [
      "Brevets de rameur (bronze, argent, or chez les jeunes ; en eaux intérieures, en mer et en indoor).",
      "Catégories par âge (J10 à J18, seniors, masters).",
      "Aviron loisir, randonnée, aviron santé, aviron indoor."
    ],
    "competitions": [
      "Régates régionales, championnats de France par bateau.",
      "Aviron de mer, beach rowing (olympique à Los Angeles 2028) et indoor.",
      "Championnats du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Renforcement complet",
      "Endurance",
      "Synchronisation",
      "Pratique en plein air"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, le matériel est fourni par le club."
    },
    "sources": [
      {
        "label": "FFAviron — brevets de rameur",
        "url": "https://www.ffaviron.fr"
      }
    ]
  },
  "canoe-kayak": {
    "federation": "Fédération française de canoë-kayak et sports de pagaie",
    "federationCodes": [
      "FFCK"
    ],
    "accroche": "Descendre une rivière, filer sur un lac ou affronter les vagues : la pagaie se décline en une multitude de pratiques.",
    "principe": "On fait avancer une embarcation légère avec une pagaie. En kayak, on est assis et la pagaie a deux pales ; en canoë, on est à genoux ou assis avec une pagaie à une pale. Selon la discipline, on cherche la vitesse, la technique ou l'aventure.",
    "jeu": [
      "Course en ligne : sprint sur eau calme, de 200 à 1 000 m.",
      "Slalom : passer des portes sur une rivière agitée, le plus vite possible et sans les toucher.",
      "Descente : parcourir une rivière sauvage le plus vite possible.",
      "Kayak-polo : sport collectif en kayak avec un ballon.",
      "Stand up paddle, waveski, pirogue et dragon boat font aussi partie de la fédération."
    ],
    "materiel": "Gilet d'aide à la flottabilité, tenue qui sèche vite, chaussures fermées. Bateaux, pagaies et casques sont fournis par le club.",
    "pourQui": "Dès 8 ans, avec un test de natation. On peut pratiquer en loisir toute sa vie, en randonnée ou en compétition.",
    "repere": {
      "format": "Solo ou équipage",
      "lieu": "Eaux calmes et vives",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Pagaies couleurs : de la pagaie blanche à la pagaie noire, pour valider ta progression.",
      "Catégories par âge, de poussins à vétérans.",
      "Randonnée, loisir, paracanoë."
    ],
    "competitions": [
      "Championnats régionaux et de France dans chaque discipline.",
      "Coupes du monde, championnats du monde.",
      "Jeux olympiques (course en ligne, slalom, kayak cross) et paralympiques."
    ],
    "bienfaits": [
      "Haut du corps et gainage",
      "Équilibre",
      "Contact avec la nature",
      "Courage en eaux vives"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, matériel fourni par le club."
    },
    "sources": [
      {
        "label": "FFCK — Pagaies Couleurs",
        "url": "https://www.ffck.org"
      }
    ]
  },
  "surf": {
    "federation": "Fédération française de surf",
    "federationCodes": [
      "FFSurf"
    ],
    "accroche": "Glisser sur une vague, une sensation unique. En club, tu apprends en sécurité, à ton rythme, sur les plages de l'Atlantique, de la Manche ou de la Méditerranée.",
    "principe": "Tu rames allongé sur ta planche pour attraper une vague, tu te lèves (le « take-off ») et tu glisses sur la vague en suivant sa pente. On commence sur la mousse près du bord avant d'aller chercher des vagues plus grosses.",
    "jeu": [
      "La priorité appartient au surfeur le plus proche du pic de la vague : on ne « taxe » pas une vague déjà prise.",
      "Les débutants surfent sur des planches en mousse, larges et stables.",
      "En compétition, des juges notent chaque vague sur 10 selon la difficulté et la qualité des manœuvres.",
      "Les séries (heats) durent environ 20 à 30 minutes.",
      "La FFSurf regroupe aussi le bodyboard, le longboard, le stand up paddle et le skimboard."
    ],
    "materiel": "Une combinaison adaptée à la température de l'eau, une planche et un leash (cordon relié à la cheville). Le club prête le matériel pour débuter.",
    "pourQui": "Dès 7-8 ans, si tu sais nager. Les écoles labellisées proposent des cours pour tous les âges.",
    "repere": {
      "format": "Individuel",
      "lieu": "Océan",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Passeports glisse pour valider ta progression.",
      "Catégories par âge, de benjamins à vétérans.",
      "Surf, longboard, bodyboard, stand up paddle."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France.",
      "Circuit mondial (World Surf League).",
      "Jeux olympiques, avec l'épreuve de Paris 2024 à Teahupo'o (Tahiti)."
    ],
    "bienfaits": [
      "Gainage et équilibre",
      "Cardio",
      "Lecture de l'océan",
      "Liberté"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation ou cours, combinaison. Une planche personnelle est un achat important."
    },
    "sources": [
      {
        "label": "Fédération française de surf",
        "url": "https://www.surfingfrance.com"
      }
    ]
  },
  "ski-nautique-et-wakeboard": {
    "federation": "Fédération française de ski nautique et de wakeboard",
    "federationCodes": [
      "FFSNW"
    ],
    "accroche": "Glisser sur l'eau tracté par un bateau ou un téléski nautique : sensations de vitesse et figures garanties.",
    "principe": "Tu es tiré par un câble, derrière un bateau ou par un téléski nautique, et tu glisses sur l'eau avec des skis ou une planche. Après avoir appris à démarrer et à tenir l'équilibre, tu peux progresser en slalom, en figures ou en saut.",
    "jeu": [
      "Ski nautique : slalom entre des bouées, figures et saut sur tremplin.",
      "Wakeboard : planche unique avec fixations, figures en sautant sur la vague du bateau ou sur des modules.",
      "Le téléski nautique tracte plusieurs riders à la fois sur un circuit fermé.",
      "Le démarrage se fait accroupi dans l'eau, le corps groupé.",
      "Le gilet est obligatoire."
    ],
    "materiel": "Gilet, combinaison selon la saison. Skis, planches et bateau sont fournis par le club.",
    "pourQui": "Dès 6-7 ans, si tu sais nager. Le téléski nautique rend la découverte très accessible.",
    "repere": {
      "format": "Individuel",
      "lieu": "Plans d'eau",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Brevets fédéraux de progression.",
      "Catégories par âge en compétition.",
      "Ski nautique, wakeboard, wakeskate, ski nautique handisport."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Gainage",
      "Équilibre",
      "Force des jambes",
      "Sensations"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation et séances de traction (bateau ou téléski) facturées en supplément selon les clubs."
    },
    "sources": [
      {
        "label": "FFSNW",
        "url": "https://www.ffsnw.fr"
      }
    ]
  },
  "motonautique": {
    "federation": "Fédération française motonautique",
    "federationCodes": [
      "FFMN"
    ],
    "accroche": "La vitesse sur l'eau : jet-ski, bateaux de course et offshore, pour les amateurs de sensations et de mécanique.",
    "principe": "Le motonautisme regroupe les sports de vitesse et de pilotage sur l'eau avec des engins à moteur : jet (scooter des mers), bateaux de circuit et offshore. Il faut maîtriser le pilotage, la trajectoire et la sécurité.",
    "jeu": [
      "Courses en circuit autour de bouées.",
      "Jet : courses et épreuves de figures (freestyle).",
      "Offshore : courses en mer sur de longues distances.",
      "Sécurité stricte : gilet, casque et coupe-circuit obligatoires.",
      "Un permis peut être nécessaire selon l'engin et la puissance."
    ],
    "materiel": "Gilet, casque, combinaison. L'engin est un investissement important, parfois mis à disposition en initiation.",
    "pourQui": "Pour les jeunes à partir de catégories encadrées, et les adultes. Une initiation en club permet de découvrir en sécurité.",
    "repere": {
      "format": "Individuel",
      "lieu": "Plans d'eau",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Licences loisir et compétition.",
      "Catégories selon l'âge et la puissance des engins."
    ],
    "competitions": [
      "Championnats de France de jet et de circuit.",
      "Championnats d'Europe et du monde, dont le championnat du monde de F1 H2O."
    ],
    "bienfaits": [
      "Réflexes",
      "Concentration",
      "Pilotage",
      "Sensations fortes"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Engin, carburant, entretien et déplacements : une pratique coûteuse."
    },
    "sources": [
      {
        "label": "Fédération française motonautique",
        "url": "https://www.ffmotonautique.com"
      }
    ]
  },
  "sauvetage-et-secourisme": {
    "federation": "Fédération française de sauvetage et de secourisme",
    "federationCodes": [
      "FFSS"
    ],
    "accroche": "Un sport qui sert à sauver des vies : nage, course sur la plage et gestes de secours, en compétition comme en formation.",
    "principe": "Le sauvetage sportif reprend les gestes des sauveteurs : nager vite pour aller chercher une victime, la remorquer, utiliser une planche ou une bouée. Les clubs forment aussi aux premiers secours et aux diplômes de surveillant de baignade.",
    "jeu": [
      "Épreuves en piscine : nage avec obstacles, remorquage de mannequin, sauvetage avec palmes.",
      "Épreuves côtières : course sur la plage, nage en mer, planche de sauvetage, beach flags (course pour attraper un bâton planté dans le sable).",
      "Relais par équipe.",
      "Un temps ou un classement désigne le vainqueur.",
      "Les formations mènent au PSC1, au BNSSA (surveillant de baignade) ou au PSE."
    ],
    "materiel": "Maillot, bonnet, lunettes, palmes. Mannequins, bouées et planches sont fournis par le club.",
    "pourQui": "Dès 8-10 ans pour le sauvetage sportif. Les formations aux diplômes sont ouvertes selon l'âge requis (examen du BNSSA dès 17 ans, brevet délivré à 18 ans).",
    "repere": {
      "format": "Individuel et relais",
      "lieu": "Piscine et plage",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Catégories par âge, de benjamins à masters.",
      "Brevets de sauvetage et diplômes de secourisme."
    ],
    "competitions": [
      "Championnats régionaux et de France en eau plate et en côtier.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Natation et course",
      "Sens des responsabilités",
      "Gestes qui sauvent",
      "Esprit d'équipe"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation ; les formations diplômantes sont facturées à part."
    },
    "sources": [
      {
        "label": "FFSS — BNSSA et sauvetage sportif",
        "url": "https://www.ffss.fr"
      }
    ]
  },
  "judo-jujitsu": {
    "federation": "Fédération française de judo, jujitsu, kendo et disciplines associées",
    "federationCodes": [
      "FFJDA"
    ],
    "accroche": "Le judo apprend à tomber sans se faire mal, à se relever et à respecter l'autre. Un sport éducatif par excellence, qui va bien au-delà du tatami.",
    "principe": "Deux judokas en kimono (judogi) cherchent à se déséquilibrer pour projeter l'adversaire au sol sur le dos, ou à le contrôler au sol par une immobilisation. Les coups sont interdits : on utilise la force de l'autre plutôt que la sienne. Le code moral (politesse, courage, respect…) fait partie de l'apprentissage.",
    "jeu": [
      "Un combat dure 4 minutes chez les seniors.",
      "Une projection parfaite sur le dos donne « ippon » et la victoire immédiate ; une projection partielle donne « waza-ari », une moins nette « yuko ». Depuis 2025, deux waza-ari ne font plus ippon : sans ippon, on gagne à l'avantage.",
      "Au sol, une immobilisation de 20 secondes, un étranglement ou une clé de bras (chez les adultes) font gagner.",
      "On salue avant et après chaque combat.",
      "Le jujitsu ajoute coups et défense contre des attaques, sous forme de combat ou de démonstration."
    ],
    "materiel": "Un judogi (kimono) et une ceinture. On pratique pieds nus sur le tatami ; des tongs pour aller jusqu'au tapis.",
    "pourQui": "Dès 4 ans avec l'éveil judo, et à tout âge. Le Taïso permet de faire du renforcement sans combat. Le para judo s'adresse aux personnes déficientes visuelles.",
    "repere": {
      "format": "En duel",
      "lieu": "Dojo",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Ceintures de couleur : blanche, jaune, orange, verte, bleue, marron, puis noire et ses dans (degrés).",
      "Ceintures intermédiaires pour les plus jeunes.",
      "Catégories par âge et par poids en compétition."
    ],
    "competitions": [
      "Animations et tournois pour les enfants.",
      "Championnats départementaux, régionaux puis de France.",
      "Grand Slam de Paris, championnats du monde et Jeux olympiques, où la France brille régulièrement."
    ],
    "bienfaits": [
      "Souplesse et force",
      "Confiance en soi",
      "Respect et maîtrise de soi",
      "Savoir chuter"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et un kimono. Sport très accessible."
    },
    "sources": [
      {
        "label": "FFJDA — temps de combat, éveil judo, règles 2025",
        "url": "https://www.ffjudo.com"
      }
    ]
  },
  "karate": {
    "federation": "Fédération française de karaté et disciplines associées",
    "federationCodes": [
      "FFKDA"
    ],
    "accroche": "Rapidité, précision et contrôle : le karaté forme le corps et l'esprit, en combat comme dans l'art du kata.",
    "principe": "Art martial d'origine japonaise (Okinawa), le karaté utilise coups de poing, coups de pied et blocages. On s'entraîne aux techniques de base (kihon), aux enchaînements codifiés (kata) et au combat (kumite). En combat sportif, les coups sont contrôlés : il s'agit de toucher sans blesser.",
    "jeu": [
      "En kumite, on marque des points en touchant des zones autorisées avec une technique contrôlée : 1, 2 ou 3 points selon la difficulté.",
      "Un combat dure 3 minutes chez les seniors hommes, 2 minutes chez les femmes et les jeunes.",
      "En kata, des juges notent la précision, la puissance et le rythme d'un enchaînement face à un adversaire imaginaire.",
      "Le salut et l'étiquette encadrent chaque séance.",
      "La FFKDA regroupe aussi d'autres styles et disciplines (krav maga, karaté contact…)."
    ],
    "materiel": "Un karatégi (kimono) et une ceinture. Pour le combat : gants, protège-dents, protège-tibias et plastron selon l'âge.",
    "pourQui": "Dès 4-5 ans avec le baby karaté, et sans limite d'âge. Le karaté santé et le karaté défense training s'adressent aux adultes.",
    "repere": {
      "format": "En duel ou solo (kata)",
      "lieu": "Dojo",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Ceintures : blanche, jaune, orange, verte, bleue, marron, puis noire et ses dans.",
      "Catégories par âge et par poids en combat.",
      "Kata, kumite, body karaté, karaté santé, self-défense."
    ],
    "competitions": [
      "Coupes et championnats départementaux, régionaux et de France.",
      "Circuit international Karaté 1 Premier League.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Coordination et souplesse",
      "Concentration",
      "Maîtrise de soi",
      "Confiance"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, kimono, puis protections pour le combat."
    },
    "sources": [
      {
        "label": "FFKDA — kumite",
        "url": "https://www.ffkarate.fr"
      }
    ]
  },
  "taekwondo": {
    "federation": "Fédération française de taekwondo et disciplines associées",
    "federationCodes": [
      "FFTDA"
    ],
    "accroche": "L'art martial coréen des coups de pied : spectaculaire, rapide et olympique.",
    "principe": "Deux combattants s'affrontent en portant des coups, principalement avec les pieds, sur le plastron et le casque de l'adversaire. Des capteurs électroniques détectent les touches. On travaille aussi des enchaînements codifiés (poomsae) et la casse.",
    "jeu": [
      "Un combat se joue au meilleur des 3 rounds de 2 minutes : il faut en gagner 2.",
      "Coup de poing au plastron = 1 point, coup de pied au plastron = 2 points, au casque = 3 points.",
      "Les techniques retournées rapportent des points supplémentaires.",
      "Attaquer sous la ceinture ou frapper un adversaire au sol est interdit.",
      "Les poomsae sont jugés sur la précision et l'expression."
    ],
    "materiel": "Un dobok (tenue blanche) et une ceinture. Pour le combat : casque, plastron, protège-avant-bras et tibias, coquille et protège-dents.",
    "pourQui": "Dès 4-5 ans avec le baby taekwondo. Le body taekwondo s'adresse à ceux qui veulent faire du fitness sans combat. Le para taekwondo est paralympique.",
    "repere": {
      "format": "En duel ou solo",
      "lieu": "Dojo",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Keups (grades de couleur) puis dans (ceinture noire).",
      "Catégories par âge et par poids.",
      "Combat, poomsae, body taekwondo, self-défense."
    ],
    "competitions": [
      "Opens régionaux et championnats de France.",
      "Championnats d'Europe et du monde.",
      "Jeux olympiques et paralympiques."
    ],
    "bienfaits": [
      "Souplesse",
      "Explosivité",
      "Coordination",
      "Discipline"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, dobok, puis protections pour le combat."
    },
    "sources": [
      {
        "label": "Olympics.com — règles du taekwondo",
        "url": "https://www.olympics.com"
      },
      {
        "label": "FFTDA",
        "url": "https://www.fftda.fr"
      }
    ]
  },
  "aikido": {
    "federation": "Fédération française d'aïkido, aïkibudo et affinitaires · Fédération française d'aïkido et de budo",
    "federationCodes": [
      "FFAAA",
      "FFAB"
    ],
    "accroche": "Un art martial sans compétition, fondé sur l'harmonie : on neutralise l'attaque en utilisant l'énergie de l'adversaire.",
    "principe": "L'aïkido se pratique à deux : l'un attaque, l'autre esquive et répond par une projection ou une immobilisation (clé articulaire). Les rôles alternent sans cesse. Il n'y a ni vainqueur ni perdant : on progresse ensemble.",
    "jeu": [
      "Pas de compétition : la progression se fait par la pratique et les passages de grade.",
      "Chaque technique se répète des deux côtés, en alternant attaquant (uke) et défenseur (tori).",
      "On apprend à chuter en roulant (ukemi) pour se protéger.",
      "La pratique inclut le travail avec armes en bois : sabre (bokken), bâton (jo), couteau (tanto).",
      "L'étiquette (saluts, respect du dojo) est très présente."
    ],
    "materiel": "Un keikogi (kimono), une ceinture, et pour les gradés un hakama (pantalon large). Armes en bois pour certains cours.",
    "pourQui": "Dès 6-7 ans et à tout âge : l'absence de compétition en fait un art martial idéal pour débuter adulte.",
    "repere": {
      "format": "À deux",
      "lieu": "Dojo",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Grades kyu (souvent sans couleur de ceinture chez les adultes), puis dan (ceinture noire).",
      "Cours enfants, adultes, et stages avec des experts."
    ],
    "competitions": [
      "Pas de compétition. Des démonstrations et des stages nationaux et internationaux rythment la saison."
    ],
    "bienfaits": [
      "Souplesse",
      "Calme et contrôle",
      "Coordination",
      "Confiance"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et un kimono."
    },
    "sources": [
      {
        "label": "FFAAA",
        "url": "https://aikido.com.fr"
      },
      {
        "label": "FFAB",
        "url": "https://www.ffabaikido.fr"
      }
    ]
  },
  "arts-martiaux-chinois": {
    "federation": "Fédération française des arts énergétiques et martiaux chinois",
    "federationCodes": [
      "FFAEMC"
    ],
    "accroche": "Du kung-fu acrobatique au tai-chi tout en lenteur : une grande famille de pratiques pour tous les âges et tous les tempéraments.",
    "principe": "Les arts martiaux chinois (wushu) regroupent de nombreux styles : formes codifiées (taolu), combat (sanda), maniement d'armes traditionnelles, et arts énergétiques comme le tai-chi-chuan et le qi gong, qui travaillent la respiration et la lenteur.",
    "jeu": [
      "Taolu : enchaînements à mains nues ou avec armes, jugés sur la technique et la beauté du geste.",
      "Sanda : combat avec coups de poing, coups de pied et projections.",
      "Tai-chi-chuan : enchaînements lents, travail de l'équilibre et de la détente.",
      "Qi gong : exercices de respiration et de mouvements doux.",
      "Chaque école a ses styles et ses traditions."
    ],
    "materiel": "Tenue souple, chaussures légères. Gants et protections pour le combat ; armes d'entraînement pour certains styles.",
    "pourQui": "Dès 5-6 ans pour le kung-fu. Le tai-chi et le qi gong sont très adaptés aux adultes et aux seniors.",
    "repere": {
      "format": "Solo ou duel",
      "lieu": "Salle",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Grades ou ceintures selon les écoles.",
      "Pratiques internes (tai-chi, qi gong) et externes (kung-fu, sanda)."
    ],
    "competitions": [
      "Championnats de France de taolu et de sanda, compétitions de tai-chi.",
      "Championnats d'Europe et du monde de wushu."
    ],
    "bienfaits": [
      "Souplesse",
      "Équilibre",
      "Gestion du stress",
      "Concentration"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et tenue."
    },
    "sources": [
      {
        "label": "FFAEMC",
        "url": "https://www.ffaemc.fr"
      }
    ]
  },
  "boxe-anglaise": {
    "federation": "Fédération française de boxe",
    "federationCodes": [
      "FFB"
    ],
    "accroche": "Le « noble art » : un entraînement physique très complet, que tu peux pratiquer sans jamais monter sur un ring.",
    "principe": "Deux boxeurs s'affrontent sur un ring en ne frappant qu'avec les poings gantés, au-dessus de la ceinture. On gagne aux points (selon la qualité et le nombre de coups touchés) ou par arrêt de l'arbitre. L'entraînement mêle corde à sauter, sac de frappe, travail technique et sparring.",
    "jeu": [
      "En boxe amateur, un combat dure 3 rounds de 3 minutes.",
      "Seuls les coups de poing avec la partie avant du gant sont autorisés.",
      "On ne frappe ni sous la ceinture, ni dans le dos, ni la nuque.",
      "L'arbitre peut arrêter le combat pour protéger un boxeur.",
      "La boxe éducative, pour les jeunes, interdit de frapper fort : on touche sans appuyer."
    ],
    "materiel": "Gants, bandes de main, protège-dents. Casque pour l'entraînement au contact et la boxe éducative. Chaussures légères.",
    "pourQui": "Dès 6 ans en boxe éducative assaut. La boxe loisir et le fitness boxing permettent de s'entraîner sans combattre. De plus en plus de femmes pratiquent.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Boxe éducative assaut (sans frapper fort), puis boxe amateur, puis boxe professionnelle.",
      "Gants de couleur pour valider la technique.",
      "Boxe loisir, aéroboxe, boxe santé."
    ],
    "competitions": [
      "Critériums et championnats régionaux, puis de France.",
      "Championnats internationaux et Jeux olympiques.",
      "Boxe professionnelle avec ses titres nationaux et mondiaux."
    ],
    "bienfaits": [
      "Cardio",
      "Coordination",
      "Confiance en soi",
      "Défoulement"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, gants, bandes et protège-dents."
    },
    "sources": [
      {
        "label": "FFBoxe — gants de couleur et boxe éducative",
        "url": "https://www.ffboxe.com/formations-federales/gants-de-couleur/"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.ffboxe.com"
      }
    ]
  },
  "savate-boxe-francaise": {
    "federation": "Fédération française de savate, boxe française et disciplines associées",
    "federationCodes": [
      "FFSBFDA"
    ],
    "accroche": "Une boxe pieds-poings née en France, élégante et précise, où les chaussures font partie de l'arme.",
    "principe": "On boxe avec les poings et les pieds, chaussés de chaussures spécifiques. Les coups de pied touchent avec la semelle ou la pointe de la chaussure. On marque des points par des touches précises et contrôlées en assaut, ou plus puissantes en combat.",
    "jeu": [
      "Assaut : touches précises sans puissance, jugées sur la technique.",
      "Combat : coups portés, pour les compétiteurs expérimentés.",
      "Coups de pied autorisés : fouetté, chassé, revers, coup de pied bas.",
      "Pas de genou, pas de coude, pas de coups au sol.",
      "La canne de combat et le bâton font aussi partie de la fédération."
    ],
    "materiel": "Gants, chaussures de savate, protège-dents, coquille ou protège-poitrine, et une tenue intégrale pour les compétitions.",
    "pourQui": "Dès 6-7 ans. L'assaut, sans puissance, permet de pratiquer en sécurité à tout âge. La savate forme est adaptée aux adultes.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Gants de couleur techniques : bleu, vert, rouge, blanc, jaune, puis gants d'argent.",
      "Assaut, pré-combat, combat.",
      "Savate forme, savate défense, canne de combat."
    ],
    "competitions": [
      "Championnats régionaux et de France en assaut et en combat.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Souplesse",
      "Coordination",
      "Cardio",
      "Maîtrise des coups"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, gants et chaussures de savate."
    },
    "sources": [
      {
        "label": "FFSBFDA",
        "url": "https://www.ffsavate.com"
      },
      {
        "label": "Vidal — fiche savate",
        "url": "https://www.vidal.fr/sante/sport/infos-sport-medicosport-sante/58/savate-boxe-francaise/"
      }
    ]
  },
  "kick-boxing-muay-thai": {
    "federation": "Fédération française de kick boxing, muay thaï et disciplines associées",
    "federationCodes": [
      "FFKMDA"
    ],
    "accroche": "Les boxes pieds-poings les plus complètes : un entraînement intense, à faire en loisir ou en compétition.",
    "principe": "Deux combattants utilisent poings et pieds pour marquer. En muay thaï (boxe thaïlandaise), on ajoute les genoux, les coudes et le corps à corps (clinch). En kick-boxing, coudes et saisies sont interdits.",
    "jeu": [
      "Un combat se joue en rounds de 2 ou 3 minutes.",
      "Points attribués pour les coups nets et contrôlés en light contact, ou pour l'efficacité en plein contact.",
      "Le muay thaï commence par un rituel traditionnel (wai kru).",
      "Plusieurs formules : light contact, kick light, full contact, K1, muay thaï.",
      "Les jeunes pratiquent en contact léger avec protections."
    ],
    "materiel": "Gants, bandes, protège-tibias, protège-dents, coquille ; casque selon la formule et l'âge.",
    "pourQui": "Dès 7-8 ans en éducatif. Très populaire chez les adultes, hommes et femmes, pour se dépenser et apprendre à se défendre.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Grades techniques (prajieds en muay thaï, ceintures ou gants en kick-boxing).",
      "Loisir, light contact, plein contact.",
      "Catégories par âge et par poids."
    ],
    "competitions": [
      "Championnats régionaux et de France par formule.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Cardio",
      "Puissance",
      "Confiance",
      "Gestion du stress"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et protections."
    },
    "sources": [
      {
        "label": "FFKMDA",
        "url": "https://www.ffkmda.com"
      }
    ]
  },
  "boxe-americaine": {
    "federation": "Fédération française de kick boxing, muay thaï et disciplines associées (full contact)",
    "federationCodes": [
      "FFKMDA"
    ],
    "accroche": "Le full contact, ancêtre du kick-boxing : coups de poing et coups de pied au-dessus de la ceinture.",
    "principe": "La boxe américaine (full contact) combine les poings de la boxe anglaise et les coups de pied des arts martiaux. Contrairement au kick-boxing, les coups de pied ne visent que le haut du corps, au-dessus de la ceinture.",
    "jeu": [
      "Combat en rounds de 2 minutes en général.",
      "Coups de pied et de poing uniquement au-dessus de la ceinture.",
      "Formules light contact (touches contrôlées) et full contact (coups portés).",
      "Victoire aux points ou par arrêt de l'arbitre.",
      "Un nombre minimum de coups de pied par round est souvent imposé."
    ],
    "materiel": "Gants, protège-pieds, protège-tibias, casque, protège-dents, coquille.",
    "pourQui": "Adolescents et adultes, en loisir ou en compétition.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Ceintures de couleur.",
      "Light contact puis full contact."
    ],
    "competitions": [
      "Championnats régionaux et nationaux.",
      "Compétitions internationales."
    ],
    "bienfaits": [
      "Souplesse",
      "Cardio",
      "Coordination",
      "Confiance"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et protections."
    },
    "sources": [
      {
        "label": "FFKMDA (full contact)",
        "url": "https://www.ffkmda.com"
      }
    ]
  },
  "lutte": {
    "federation": "Fédération française de lutte et disciplines associées",
    "federationCodes": [
      "FFLDA"
    ],
    "accroche": "Le plus ancien sport de combat du monde : pas de coups, juste de la force, de la technique et de la stratégie.",
    "principe": "Deux lutteurs cherchent à amener l'adversaire au sol et à lui plaquer les deux épaules au tapis (le « tombé »), ce qui donne la victoire immédiate. À défaut, on gagne aux points marqués par des amenées au sol et des retournements.",
    "jeu": [
      "Un combat dure 2 périodes de 3 minutes chez les seniors.",
      "Lutte libre : on peut saisir les jambes.",
      "Lutte gréco-romaine : interdit de saisir les jambes ou de les utiliser pour attaquer.",
      "Lutte féminine : règles de la lutte libre.",
      "La passivité est sanctionnée."
    ],
    "materiel": "Un maillot de lutte (justaucorps), des chaussures de lutte. Le tapis est fourni par le club.",
    "pourQui": "Dès 3-6 ans avec la baby lutte dans certains clubs, puis la lutte éducative. Filles et garçons, toutes morphologies, grâce aux catégories de poids.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 3 ans (baby lutte)"
    },
    "niveaux": [
      "Maîtrises de couleur pour valider la progression technique.",
      "Catégories par âge (poussins à vétérans) et par poids.",
      "Lutte libre, gréco-romaine, féminine, lutte contact, beach wrestling."
    ],
    "competitions": [
      "Championnats régionaux et de France.",
      "Championnats d'Europe et du monde.",
      "Jeux olympiques."
    ],
    "bienfaits": [
      "Force",
      "Gainage",
      "Ténacité",
      "Stratégie"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, chaussures et maillot de lutte."
    },
    "sources": [
      {
        "label": "FFLDA — maîtrises, baby lutte, disciplines associées",
        "url": "https://www.fflutte.com"
      }
    ]
  },
  "escrime": {
    "federation": "Fédération française d'escrime",
    "federationCodes": [
      "FFE"
    ],
    "accroche": "Le sport le plus titré de l'histoire olympique française : un jeu d'échecs à grande vitesse, l'arme à la main.",
    "principe": "Deux escrimeurs s'affrontent sur une piste avec une arme (fleuret, épée ou sabre). Le but : toucher l'adversaire sur la zone autorisée sans être touché. Les touches sont détectées électriquement. Vitesse, anticipation et réflexion se combinent.",
    "jeu": [
      "Fleuret : touche avec la pointe, uniquement sur le tronc, avec une règle de priorité.",
      "Épée : touche avec la pointe, sur tout le corps, sans priorité (les coups doubles comptent).",
      "Sabre : touches avec la pointe et le tranchant, au-dessus de la ceinture, avec priorité.",
      "Un match en poule se joue en 5 touches ; en élimination directe, en 15 touches.",
      "On salue l'adversaire et l'arbitre avant et après chaque assaut."
    ],
    "materiel": "Masque, veste, sous-cuirasse, gant, arme. Le club prête le matériel pour débuter.",
    "pourQui": "Dès 5-6 ans avec l'escrime ludique (souvent au sabre laser ou en plastique). L'escrime est aussi accessible en fauteuil et sous forme d'escrime santé.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Blasons jaune, rouge et bleu pour valider les progrès (et blason vert pour l'arbitrage).",
      "Catégories par âge, dès M5-M7 jusqu'aux vétérans.",
      "Escrime artistique, escrime sabre laser, escrime santé."
    ],
    "competitions": [
      "Circuits régionaux et nationaux par catégorie.",
      "Championnats de France individuels et par équipes.",
      "Coupes du monde, Jeux olympiques et paralympiques."
    ],
    "bienfaits": [
      "Réflexes",
      "Stratégie",
      "Coordination",
      "Concentration"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, puis achat progressif de la tenue et des armes (prêtées au début)."
    },
    "sources": [
      {
        "label": "Fédération française d'escrime",
        "url": "https://www.ffescrime.fr"
      }
    ]
  },
  "athletisme": {
    "federation": "Fédération française d'athlétisme",
    "federationCodes": [
      "FFA"
    ],
    "accroche": "Courir, sauter, lancer : les gestes les plus naturels du sport, réunis dans une discipline où chacun trouve sa spécialité.",
    "principe": "L'athlétisme regroupe des épreuves où l'on cherche à aller le plus vite, le plus haut ou le plus loin. En club, les jeunes touchent à tout avant de se spécialiser. Les adultes peuvent aussi courir sur route, en trail ou pratiquer la marche nordique.",
    "jeu": [
      "Courses : sprint (100 à 400 m), demi-fond (800 m, 1 500 m), fond, haies, relais, steeple.",
      "Sauts : longueur, triple saut, hauteur, perche.",
      "Lancers : poids, disque, javelot, marteau.",
      "Épreuves combinées : heptathlon et décathlon.",
      "Hors stade : cross-country, course sur route, trail, marche athlétique."
    ],
    "materiel": "Des chaussures de course adaptées ; des pointes pour la piste et les sauts quand on progresse. Le club fournit les engins de lancer.",
    "pourQui": "Dès 3 ans avec le Baby Athlé (sans compétition), puis l'Éveil athlétique de 7 à 9 ans, et sans limite d'âge. Les adultes rejoignent souvent un club pour courir en groupe ou préparer un marathon.",
    "repere": {
      "format": "Individuel et relais",
      "lieu": "Stade et nature",
      "age": "Dès 3 ans"
    },
    "niveaux": [
      "Catégories par âge : baby athlé, éveil, poussins, benjamins, minimes, cadets, juniors, espoirs, seniors, masters.",
      "Pass'Athlé pour les enfants : Pass'Aventure (4-6 ans), Pass'Éveil (7-9 ans).",
      "Running, trail, marche nordique, athlé santé."
    ],
    "competitions": [
      "Compétitions départementales et régionales, sur piste, en salle et en cross.",
      "Championnats de France par catégorie.",
      "Courses sur route ouvertes à tous, des 10 km aux marathons.",
      "Championnats du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Vitesse et endurance",
      "Explosivité",
      "Dépassement de soi",
      "Polyvalence"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et une bonne paire de chaussures."
    },
    "sources": [
      {
        "label": "FFA — catégories d'âge",
        "url": "https://www.athle.fr/contenu/les-categories-d-age-en-2027/25"
      },
      {
        "label": "FFA — pratique jeunes",
        "url": "https://www.athle.fr/contenu/pratique-jeunes-competitions/7075"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.athle.fr"
      }
    ]
  },
  "triathlon": {
    "federation": "Fédération française de triathlon",
    "federationCodes": [
      "FFTri"
    ],
    "accroche": "Natation, vélo, course à pied enchaînés : le défi idéal pour ceux qui aiment varier les plaisirs et se dépasser.",
    "principe": "Le triathlon enchaîne trois disciplines sans s'arrêter : natation, cyclisme puis course à pied. Le chronomètre tourne aussi pendant les transitions, où l'on change d'équipement. Les distances vont du format découverte à l'Ironman.",
    "jeu": [
      "Format XS (découverte) : 400 m de nage, 10 km de vélo, 2,5 km de course, ouvert dès 12 ans.",
      "Format S (750 m / 20 km / 5 km), M (olympique : 1,5 km / 40 km / 10 km), L (3 / 80 / 20), XL (4 / 120 / 30) et XXL (3,8 / 180 / 42,2).",
      "En format olympique, l'aspiration (rouler dans la roue d'un autre) est souvent autorisée chez l'élite, pas sur les longues distances.",
      "Disciplines enchaînées : duathlon (course-vélo-course), aquathlon (nage-course), cross triathlon, swimrun, bike & run.",
      "Le paratriathlon est paralympique."
    ],
    "materiel": "Maillot de bain ou trifonction, lunettes, combinaison néoprène selon la température, vélo et casque, chaussures de course.",
    "pourQui": "En club dès 4 ans, en compétition dès 6 ans avec des distances adaptées. Beaucoup d'adultes s'y mettent pour se lancer un défi, souvent sur une distance découverte.",
    "repere": {
      "format": "Individuel",
      "lieu": "Eau, route, chemins",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Catégories par âge, de mini-poussins à vétérans.",
      "Distances progressives de XS à XXL.",
      "Pratique loisir, longue distance ou élite (Grand Prix)."
    ],
    "competitions": [
      "Épreuves ouvertes partout en France toute l'année.",
      "Championnats de France et Grand Prix (D1 des clubs).",
      "Championnats du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Endurance globale",
      "Polyvalence",
      "Gestion de l'effort",
      "Mental"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, et surtout le vélo et la combinaison, achetés progressivement."
    },
    "sources": [
      {
        "label": "FFTRI",
        "url": "https://www.fftri.com"
      },
      {
        "label": "Fiche FFTRI (France Olympique, 2026)",
        "url": "https://ressources-associations-sportives.franceolympique.com"
      }
    ]
  },
  "pentathlon-moderne": {
    "federation": "Fédération française de pentathlon moderne",
    "federationCodes": [
      "FFPM"
    ],
    "accroche": "Cinq sports en un : un défi complet pour les sportifs polyvalents, présent aux Jeux olympiques depuis 1912.",
    "principe": "Le pentathlon moderne combine plusieurs disciplines en une seule compétition : escrime, natation, épreuve d'obstacles (qui remplace l'équitation depuis 2025, après les Jeux de Paris 2024) et le « laser run », qui enchaîne course à pied et tir au pistolet laser. Les points de chaque épreuve s'additionnent.",
    "jeu": [
      "Escrime à l'épée, en touche unique.",
      "Natation : 200 m nage libre.",
      "Parcours d'obstacles, inspiré des émissions de type « Ninja ».",
      "Laser run : séances de tir au pistolet laser alternées avec des boucles de course ; le premier arrivé gagne.",
      "Les jeunes pratiquent des formes réduites : biathle, triathle, laser run."
    ],
    "materiel": "Maillot et lunettes, tenue d'escrime, chaussures de course. Pistolets laser et épées sont fournis par le club.",
    "pourQui": "Dès 8-10 ans avec le laser run et le biathle. Idéal pour les jeunes qui aiment plusieurs sports.",
    "repere": {
      "format": "Individuel",
      "lieu": "Multisites",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Catégories par âge, de U9 à masters.",
      "Laser run, biathle, triathle, tétrathlon, pentathlon complet."
    ],
    "competitions": [
      "Championnats de France de laser run et de pentathlon.",
      "Coupes du monde, championnats du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Polyvalence",
      "Concentration",
      "Endurance",
      "Gestion du stress"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation et équipement de plusieurs disciplines."
    },
    "sources": [
      {
        "label": "FFPM — règlement national 2025-2026",
        "url": "https://ffpentathlon.fr/wp-content/uploads/2025/10/VF3-Reglement-National-General-saison-2025-2026.-docx.pdf"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.ffpentathlon.fr"
      }
    ]
  },
  "course-d-orientation": {
    "federation": "Fédération française de course d'orientation",
    "federationCodes": [
      "FFCO"
    ],
    "accroche": "Une carte, une boussole et la nature : un sport qui fait courir les jambes et la tête.",
    "principe": "Tu dois trouver des balises placées dans la nature (forêt, parc, ville) en suivant l'ordre indiqué sur une carte très détaillée. À chaque balise, tu valides ton passage avec une puce électronique. Le gagnant est celui qui choisit les meilleurs itinéraires et va le plus vite.",
    "jeu": [
      "Les balises sont des fanions orange et blanc numérotés.",
      "L'itinéraire entre deux balises est libre : c'est toi qui choisis.",
      "Il existe des parcours de toutes difficultés, signalés par des couleurs.",
      "Formats : sprint en ville, moyenne et longue distance en forêt, relais, nocturne.",
      "Variantes : course d'orientation à VTT, à ski, raid multisport."
    ],
    "materiel": "Des chaussures de trail, une tenue couvrante pour la forêt, une boussole. La carte et la puce sont fournies à la course.",
    "pourQui": "Dès 6-7 ans (parcours très faciles) et sans limite d'âge. Se pratique en famille, en marchant ou en courant.",
    "repere": {
      "format": "Individuel ou relais",
      "lieu": "Forêt et ville",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Circuits par couleur : vert, bleu, jaune, orange, violet et noir ; les jeunes valident des « balises de couleur ».",
      "Catégories par âge et par niveau.",
      "Loisir, compétition, raid."
    ],
    "competitions": [
      "Courses régionales tous les week-ends.",
      "Championnats de France individuels, relais et clubs.",
      "Championnats du monde."
    ],
    "bienfaits": [
      "Endurance",
      "Concentration",
      "Sens de l'orientation",
      "Autonomie"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et inscriptions aux courses, généralement modestes."
    },
    "sources": [
      {
        "label": "FFCO — guide des circuits de couleur",
        "url": "https://www.ffcorientation.fr/media/cms_page_media/72/Guide_mise_en_place_des_circuits_de_couleur.pdf"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.ffcorientation.fr"
      }
    ]
  },
  "randonnee-pedestre": {
    "federation": "Fédération française de la randonnée pédestre",
    "federationCodes": [
      "FFRandonnée"
    ],
    "accroche": "Marcher en groupe, découvrir des paysages, prendre l'air : la randonnée en club, c'est le plaisir de la nature, encadré et convivial.",
    "principe": "Le club organise des sorties à pied, de la balade de quelques kilomètres à la randonnée de plusieurs jours. Des animateurs formés choisissent les itinéraires, gèrent la sécurité et le rythme du groupe. Il n'y a pas de compétition : chacun choisit le niveau de sorties qui lui convient.",
    "jeu": [
      "Les sorties sont classées par distance, dénivelé et rythme.",
      "Les sentiers GR et PR sont balisés par la fédération (blanc et rouge pour les GR).",
      "On marche en groupe, en respectant le rythme du plus lent.",
      "Le club propose aussi des pratiques variées : marche nordique, longe-côte, raquettes.",
      "Des formations apprennent à lire une carte et à encadrer un groupe."
    ],
    "materiel": "De bonnes chaussures de marche, un sac à dos, de l'eau, une veste imperméable. Bâtons conseillés pour le dénivelé.",
    "pourQui": "Pour tous, des enfants (en famille) aux seniors. Idéale pour reprendre une activité physique en douceur. Des sorties adaptées existent pour les personnes en situation de handicap.",
    "repere": {
      "format": "En groupe",
      "lieu": "Sentiers",
      "age": "Tout âge"
    },
    "niveaux": [
      "Sorties par niveau : facile, moyen, sportif.",
      "Rando santé pour les personnes qui reprennent ou ont une fragilité.",
      "Itinérance sur plusieurs jours."
    ],
    "competitions": [
      "Pas de compétition pour la randonnée classique.",
      "Les Randochallenges proposent des défis amicaux par équipe.",
      "Le longe-côte et la marche nordique ont leurs compétitions."
    ],
    "bienfaits": [
      "Endurance douce",
      "Santé cardiovasculaire",
      "Lien social",
      "Découverte"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes ; l'investissement principal est une bonne paire de chaussures."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffrandonnee.fr"
      }
    ]
  },
  "escalade": {
    "federation": "Fédération française de la montagne et de l'escalade",
    "federationCodes": [
      "FFME"
    ],
    "accroche": "Grimper, c'est résoudre des énigmes avec son corps. En salle ou en falaise, l'escalade allie force, souplesse et réflexion.",
    "principe": "Tu grimpes sur un mur ou une falaise en utilisant des prises pour les mains et les pieds. En voie, tu es assuré par une corde tenue par un partenaire. En bloc, tu grimpes sans corde sur des murs bas, au-dessus de gros tapis. Chaque parcours a une cotation qui indique sa difficulté.",
    "jeu": [
      "Escalade en voie (difficulté) : monter le plus haut possible sur une voie de 10 à 20 m, encordé.",
      "Bloc : résoudre de courts passages sans corde, au-dessus de tapis.",
      "Vitesse : grimper une voie standard le plus vite possible.",
      "En salle, les voies sont repérées par la couleur des prises.",
      "La sécurité repose sur le binôme grimpeur-assureur, qui se vérifient mutuellement."
    ],
    "materiel": "Des chaussons d'escalade et un baudrier, un sac à magnésie. Pour la voie, une corde et un système d'assurage (souvent fournis par le club).",
    "pourQui": "Dès 5-6 ans, et à tout âge. Le gabarit compte peu : la technique et la souplesse priment. Le para-escalade est très développé.",
    "repere": {
      "format": "En binôme",
      "lieu": "Salle et falaise",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Cotations de difficulté (du 3 au 9c en voie).",
      "Passeports FFME (blanc, jaune, orange, vert, bleu…) pour valider l'autonomie.",
      "Loisir en salle, falaise, grandes voies."
    ],
    "competitions": [
      "Compétitions de bloc, de difficulté et de vitesse, du niveau départemental au national.",
      "Coupes et championnats du monde.",
      "Jeux olympiques depuis Tokyo 2020."
    ],
    "bienfaits": [
      "Force et gainage",
      "Souplesse",
      "Concentration",
      "Confiance"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation (accès au mur), chaussons et baudrier."
    },
    "sources": [
      {
        "label": "FFME — passeports escalade",
        "url": "https://www.ffme.fr"
      }
    ]
  },
  "alpinisme-et-montagne": {
    "federation": "Fédération française des clubs alpins et de montagne",
    "federationCodes": [
      "FFCAM"
    ],
    "accroche": "Gravir des sommets, traverser des glaciers, dormir en refuge : le club alpin t'emmène en montagne en toute sécurité.",
    "principe": "Les clubs alpins proposent toutes les activités de montagne, encadrées par des bénévoles formés : randonnée, alpinisme, escalade, ski de randonnée, raquettes, canyoning, via ferrata… On apprend à progresser en autonomie et en sécurité, en cordée.",
    "jeu": [
      "L'alpinisme combine marche, escalade sur rocher, neige et glace.",
      "On progresse en cordée, reliés par une corde.",
      "Les courses sont choisies selon la météo et les conditions.",
      "Le club gère des refuges en montagne.",
      "Des formations apprennent les techniques (cramponnage, rappel, secours)."
    ],
    "materiel": "Chaussures de montagne, vêtements chauds et imperméables, puis crampons, piolet, casque, baudrier. Le club prête souvent le matériel technique.",
    "pourQui": "Les enfants et ados découvrent en écoles d'aventure. Les adultes peuvent débuter à tout âge en randonnée, puis évoluer vers l'alpinisme.",
    "repere": {
      "format": "En cordée",
      "lieu": "Montagne",
      "age": "Enfants, ados et adultes"
    },
    "niveaux": [
      "Cotations de difficulté des courses (F, PD, AD, D, TD, ED).",
      "Formations progressives pour devenir autonome, puis encadrant.",
      "Randonnée, ski de rando, alpinisme, escalade, canyoning."
    ],
    "competitions": [
      "Peu de compétition : c'est surtout une pratique d'aventure.",
      "Le ski-alpinisme a ses compétitions (gérées par la FFME) et a fait son entrée aux Jeux olympiques d'hiver en 2026."
    ],
    "bienfaits": [
      "Endurance",
      "Autonomie",
      "Gestion du risque",
      "Contact avec la nature"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, puis équipement de montagne et nuits en refuge."
    },
    "sources": [
      {
        "label": "FFCAM",
        "url": "https://www.ffcam.fr"
      },
      {
        "label": "FFME — ski-alpinisme (délégation)",
        "url": "https://www.ffme.fr"
      }
    ]
  },
  "speleologie": {
    "federation": "Fédération française de spéléologie",
    "federationCodes": [
      "FFS"
    ],
    "accroche": "Explorer le monde souterrain : ramper, descendre en rappel, découvrir des rivières et des salles que peu d'humains ont vues.",
    "principe": "La spéléologie consiste à explorer les grottes et gouffres naturels. On progresse à pied, en ramping, en escaladant ou en descendant sur corde. C'est une activité d'équipe, d'exploration et parfois de science (topographie, géologie, biologie).",
    "jeu": [
      "On descend et remonte les puits sur corde avec des techniques spécifiques.",
      "L'éclairage frontal est indispensable.",
      "On ne laisse aucune trace et on protège le milieu souterrain.",
      "Les sorties sont préparées (météo, crues, matériel).",
      "Le canyonisme, descente de rivières encaissées, fait aussi partie de la fédération."
    ],
    "materiel": "Casque avec éclairage, combinaison, bottes, baudrier et matériel de corde. Le club le prête aux débutants.",
    "pourQui": "Dès 8-10 ans en sortie découverte. Il faut aimer l'aventure et ne pas craindre les espaces confinés.",
    "repere": {
      "format": "En équipe",
      "lieu": "Grottes",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Initiation, puis autonomie, puis encadrement.",
      "Stages fédéraux d'initiateur et de moniteur.",
      "Spéléo, canyonisme, plongée souterraine."
    ],
    "competitions": [
      "Pas de compétition : c'est une activité d'exploration et de découverte."
    ],
    "bienfaits": [
      "Force et endurance",
      "Esprit d'équipe",
      "Gestion de soi",
      "Curiosité scientifique"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation ; l'équipement de progression sur corde s'achète progressivement."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffspeleo.fr"
      }
    ]
  },
  "cyclisme": {
    "federation": "Fédération française de cyclisme",
    "federationCodes": [
      "FFC"
    ],
    "accroche": "Route, VTT, BMX, piste : le vélo en compétition se décline en dizaines de disciplines, du sprint au tour de France.",
    "principe": "Le cyclisme de compétition consiste à aller plus vite que les autres sur un vélo. Selon la discipline, on court sur route, sur piste (vélodrome), en tout-terrain (VTT, cyclo-cross) ou sur des pistes à bosses (BMX). Le club t'apprend la technique, la tactique et la sécurité en groupe.",
    "jeu": [
      "Route : courses en ligne, contre-la-montre, critériums.",
      "Piste : sprint, poursuite, keirin, omnium, au vélodrome.",
      "VTT : cross-country, descente, enduro.",
      "BMX : course sur piste à bosses et freestyle.",
      "Cyclo-cross : course tout-terrain en hiver, avec passages à pied."
    ],
    "materiel": "Un vélo adapté à la discipline, un casque (obligatoire), des gants. Certains clubs prêtent vélos de BMX ou de piste.",
    "pourQui": "Dès 5-6 ans à l'école de vélo et en BMX. Adultes : en compétition ou en pratique sportive encadrée.",
    "repere": {
      "format": "Individuel et en équipe",
      "lieu": "Route, piste, chemins",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Catégories par âge (pré-licenciés à masters).",
      "Licences selon le niveau (départemental, régional, national, élite).",
      "Loisir, pass'cyclisme, compétition."
    ],
    "competitions": [
      "Courses régionales et nationales dans chaque discipline.",
      "Coupes de France, championnats de France.",
      "Tour de France, championnats du monde et Jeux olympiques."
    ],
    "bienfaits": [
      "Endurance",
      "Puissance des jambes",
      "Stratégie de course",
      "Dépassement de soi"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation et surtout le vélo, dont le prix varie énormément selon la discipline."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffc.fr"
      }
    ]
  },
  "cyclotourisme": {
    "federation": "Fédération française de cyclotourisme (FFVélo)",
    "federationCodes": [
      "FFVélo"
    ],
    "accroche": "Rouler pour le plaisir, découvrir des régions et partager des sorties : le vélo sans chronomètre.",
    "principe": "Le cyclotourisme, c'est le vélo de loisir et de randonnée, sans compétition. Les clubs organisent des sorties hebdomadaires sur route ou en VTT, des randonnées ouvertes à tous et des voyages à vélo. Chacun roule à son rythme, dans des groupes de niveau.",
    "jeu": [
      "Sorties en groupe par niveau de vitesse et de distance.",
      "Randonnées organisées (« randos ») avec plusieurs parcours au choix.",
      "Brevets de distance (dont les Brevets de randonneurs mondiaux) pour se lancer des défis.",
      "Voyages itinérants sur plusieurs jours.",
      "Écoles de vélo pour les jeunes."
    ],
    "materiel": "Un vélo de route, VTT ou vélo à assistance électrique, un casque, une tenue adaptée.",
    "pourQui": "Pour tous, des enfants (écoles de vélo) aux seniors. Idéal pour reprendre une activité ou découvrir le VTT en douceur.",
    "repere": {
      "format": "En groupe",
      "lieu": "Route et chemins",
      "age": "Tout âge"
    },
    "niveaux": [
      "Groupes de niveau dans chaque club.",
      "Brevets de distance croissante.",
      "Route, VTT, gravel, vélo à assistance électrique."
    ],
    "competitions": [
      "Pas de compétition. Grands rendez-vous comme la Semaine fédérale internationale de cyclotourisme, ou Paris-Brest-Paris (randonnée organisée par l'Audax Club Parisien, club de la fédération)."
    ],
    "bienfaits": [
      "Endurance douce",
      "Découverte",
      "Convivialité",
      "Santé cardiovasculaire"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes, plus le vélo."
    },
    "sources": [
      {
        "label": "FFVélo — Paris-Brest-Paris 2027",
        "url": "https://ffvelo.fr/app/uploads/2026/03/CP_Paris-Brest-Paris_2027.pdf"
      },
      {
        "label": "Audax Club Parisien",
        "url": "https://www.paris-brest-paris.org"
      },
      {
        "label": "Site de la fédération",
        "url": "https://ffvelo.fr"
      }
    ]
  },
  "equitation": {
    "federation": "Fédération française d'équitation",
    "federationCodes": [
      "FFE"
    ],
    "accroche": "Une complicité unique avec un animal : l'équitation, c'est apprendre à communiquer avec un cheval ou un poney, et partager des sensations ensemble.",
    "principe": "Le cavalier apprend à diriger sa monture au pas, au trot et au galop, avec les mains, les jambes et le poids du corps. Il apprend aussi à s'en occuper : pansage, soins, alimentation. Ensuite, il choisit une ou plusieurs disciplines : saut d'obstacles, dressage, concours complet, endurance, pony-games, attelage…",
    "jeu": [
      "Saut d'obstacles : franchir un parcours sans faute, dans un temps imparti.",
      "Dressage : enchaîner des figures imposées, notées par des juges.",
      "Concours complet : dressage + cross + saut d'obstacles.",
      "Endurance, horse-ball, pony-games, TREC, attelage, voltige…",
      "Le casque est obligatoire."
    ],
    "materiel": "Casque, bottes ou boots avec mini-chaps, pantalon d'équitation. Les chevaux et le matériel de sellerie sont fournis par le centre équestre.",
    "pourQui": "Dès 3-4 ans avec le baby poney, et à tout âge. L'équitation adaptée et l'équithérapie s'adressent aux personnes en situation de handicap.",
    "repere": {
      "format": "Avec un cheval",
      "lieu": "Centre équestre",
      "age": "Dès 3 ans"
    },
    "niveaux": [
      "Galops de 1 à 7 pour valider les connaissances et la pratique.",
      "Compétitions Club, Amateur, puis Pro.",
      "Pratique loisir, randonnée, tourisme équestre."
    ],
    "competitions": [
      "Concours Club et Poney, accessibles dès les premiers galops.",
      "Championnats de France (Open de France à Lamotte-Beuvron).",
      "Compétitions internationales et Jeux olympiques."
    ],
    "bienfaits": [
      "Équilibre et posture",
      "Confiance",
      "Responsabilité",
      "Lien avec l'animal"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Forfait de cours ou cartes de leçons, licence, équipement. Posséder un cheval représente un budget important."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffe.com"
      }
    ]
  },
  "golf": {
    "federation": "Fédération française de golf",
    "federationCodes": [
      "FFGolf"
    ],
    "accroche": "Un sport de précision et de patience, en pleine nature, qui se pratique à tout âge et en famille.",
    "principe": "Le but est de mettre une balle dans un trou en un minimum de coups, en la frappant avec des clubs. Un parcours compte 9 ou 18 trous, chacun avec un « par » (nombre de coups de référence). Le joueur avec le moins de coups au total gagne.",
    "jeu": [
      "Chaque trou part d'une zone de départ et se termine sur le green.",
      "On choisit le club selon la distance et la situation (bois, fers, putter).",
      "Un handicap (index) permet à des joueurs de niveaux différents de jouer ensemble.",
      "L'étiquette (silence, respect du parcours) est très importante.",
      "Formats : stroke play (au total de coups), match play (trou par trou), scramble (par équipe)."
    ],
    "materiel": "Des clubs (le club en prête pour débuter), des balles, des chaussures de golf. Le practice permet de s'entraîner.",
    "pourQui": "Dès 4-5 ans à l'école de golf, et jusqu'à un âge avancé. Les formules découverte permettent de tester sans investir.",
    "repere": {
      "format": "Individuel",
      "lieu": "Parcours",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Drapeaux de progression pour apprendre.",
      "Index de 54 (débutant) jusqu'à moins de 0 pour les meilleurs.",
      "Carte verte pour jouer sur un parcours."
    ],
    "competitions": [
      "Compétitions de club chaque week-end.",
      "Championnats régionaux et nationaux.",
      "Circuits professionnels, Ryder Cup et Jeux olympiques."
    ],
    "bienfaits": [
      "Concentration",
      "Patience",
      "Marche en plein air",
      "Coordination"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Abonnement au golf (accès au parcours), licence, matériel. Des formules découverte et des practices rendent l'entrée plus accessible."
    },
    "sources": [
      {
        "label": "ffgolf — drapeaux, carte verte, index",
        "url": "https://www.ffgolf.org"
      }
    ]
  },
  "sports-canins-et-traineau": {
    "federation": "Fédération française des sports de traîneau, de ski/VTT joëring et de canicross · Fédération française de pulka et traîneau à chiens · Fédération française des sports et loisirs canins",
    "federationCodes": [
      "FFST",
      "FFPTC",
      "FFSLC"
    ],
    "accroche": "Faire du sport avec son chien : course, obstacles, traîneau… une complicité qui se construit à chaque séance.",
    "principe": "Les sports canins réunissent le maître et son chien dans une activité sportive. Au cani-cross, on court relié à son chien par une ligne. En agility, on guide son chien sur un parcours d'obstacles. Au traîneau et à la pulka, les chiens tirent sur la neige.",
    "jeu": [
      "Cani-cross : course à pied avec le chien attelé devant.",
      "Cani-VTT et cani-trottinette : le chien tire un vélo ou une trottinette.",
      "Agility : parcours d'obstacles (sauts, tunnels, slalom) guidé à la voix et aux gestes ; il relève en France de la Société centrale canine.",
      "Traîneau à chiens et pulka sur neige, attelage de plusieurs chiens.",
      "Le bien-être animal est une règle centrale."
    ],
    "materiel": "Un harnais adapté au chien, une ligne de trait avec amortisseur, une ceinture pour le maître. Matériel spécifique pour le traîneau.",
    "pourQui": "Pour tout maître de chien en bonne santé, adulte ou adolescent. Le chien doit être en âge et en forme pour l'effort.",
    "repere": {
      "format": "Avec ton chien",
      "lieu": "Nature et neige",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Initiation, loisir, compétition.",
      "Catégories selon la discipline et le nombre de chiens."
    ],
    "competitions": [
      "Courses régionales et championnats de France de cani-cross, d'agility ou de traîneau.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Endurance",
      "Lien avec son chien",
      "Plein air",
      "Éducation canine"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et harnais. Le traîneau demande un investissement plus important."
    },
    "sources": [
      {
        "label": "FFST",
        "url": "https://www.ffstmushing.org"
      },
      {
        "label": "FFPTC",
        "url": "https://www.ffptc.fr"
      }
    ]
  },
  "peche-sportive": {
    "federation": "Fédération française des pêches sportives",
    "federationCodes": [
      "FFPS"
    ],
    "accroche": "Lecture de l'eau, technique et patience : la pêche sportive se pratique en compétition, souvent en no-kill.",
    "principe": "La pêche sportive consiste à capturer des poissons selon des règles précises de technique et de temps. En compétition, on compte le poids ou le nombre de poissons, puis on les relâche souvent vivants. Il existe de nombreuses techniques : au coup, à la mouche, aux leurres, en mer.",
    "jeu": [
      "Pêche au coup : avec une canne et un flotteur, en attirant le poisson par l'amorce.",
      "Pêche à la mouche : avec des imitations d'insectes.",
      "Pêche aux leurres (carnassiers), carpe, pêche en mer.",
      "Les poissons sont pesés ou mesurés, puis relâchés.",
      "Une carte de pêche est obligatoire en eau douce."
    ],
    "materiel": "Cannes, moulinet, lignes et accessoires selon la technique. Bottes ou waders pour certaines pêches.",
    "pourQui": "Dès 7-8 ans dans les écoles de pêche, et à tout âge.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Rivières, lacs, mer",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Catégories jeunes, seniors, vétérans, dames.",
      "Divisions régionales et nationales.",
      "Loisir, compétition, no-kill."
    ],
    "competitions": [
      "Concours locaux, championnats régionaux et de France.",
      "Championnats du monde par équipes nationales."
    ],
    "bienfaits": [
      "Patience",
      "Concentration",
      "Connaissance de la nature",
      "Calme"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, carte de pêche, matériel dont le coût augmente avec le niveau de pratique."
    },
    "sources": [
      {
        "label": "Ministère des Sports — pêches sportives",
        "url": "https://www.sports.gouv.fr/peches-sportives-153"
      }
    ]
  },
  "ski": {
    "federation": "Fédération française de ski",
    "federationCodes": [
      "FFS"
    ],
    "accroche": "Dévaler les pentes, glisser sur la neige en forêt, s'envoler sur un tremplin : le ski club, c'est apprendre et progresser toute la saison.",
    "principe": "Le ski consiste à glisser sur la neige avec des skis ou une planche. Le ski alpin se pratique en descente sur pistes ; le ski nordique (ski de fond) sur des pistes plus plates, en avançant par la force des jambes et des bras. Les clubs organisent entraînements, sorties et compétitions, y compris pour les jeunes des villes.",
    "jeu": [
      "Ski alpin : slalom, géant, super-G et descente, chronométrés autour de portes.",
      "Ski de fond : courses en style classique (dans des traces) ou skating (pas de patineur).",
      "Biathlon : ski de fond et tir à la carabine.",
      "Snowboard et ski freestyle : figures en snowpark, boardercross, skicross.",
      "Saut à ski et combiné nordique (saut + fond)."
    ],
    "materiel": "Skis, chaussures, bâtons, casque (obligatoire en compétition), vêtements chauds. Location possible, et les clubs ont souvent du matériel pour les jeunes.",
    "pourQui": "Dès 3-4 ans en jardin des neiges. Les clubs de ville emmènent les jeunes en montagne le week-end et pendant les vacances.",
    "repere": {
      "format": "Individuel",
      "lieu": "Montagne",
      "age": "Dès 3 ans"
    },
    "niveaux": [
      "Tests de niveau de l'École du ski français, utilisés aussi en club (Ourson, Flocons, Étoiles, Flèche, Chamois).",
      "Catégories par âge (U8 à U21, puis seniors et masters).",
      "Loisir, compétition, ski santé."
    ],
    "competitions": [
      "Courses de club et de comité régional, Coupes de France.",
      "Championnats de France.",
      "Coupe du monde, championnats du monde et Jeux olympiques d'hiver."
    ],
    "bienfaits": [
      "Équilibre",
      "Force des jambes",
      "Sensations",
      "Plein air"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Licence, cotisation, forfaits de remontées, matériel et déplacements en montagne."
    },
    "sources": [
      {
        "label": "Fédération française de ski",
        "url": "https://www.ffs.fr"
      }
    ]
  },
  "sports-de-glace": {
    "federation": "Fédération française des sports de glace",
    "federationCodes": [
      "FFSG"
    ],
    "accroche": "Grâce, vitesse ou stratégie : la glace offre des sports très différents, du patinage artistique au curling.",
    "principe": "La fédération regroupe les sports pratiqués sur la glace (hors hockey) : patinage artistique, danse sur glace, patinage de vitesse, curling, bobsleigh, luge… On commence toujours par apprendre à patiner et à tenir l'équilibre, avant de choisir sa discipline.",
    "jeu": [
      "Patinage artistique : sauts, pirouettes et pas sur une musique, notés par des juges.",
      "Danse sur glace : en couple, accent sur le rythme et l'interprétation.",
      "Patinage de vitesse (short-track, longue piste) : courses chronométrées ou en peloton.",
      "Curling : faire glisser des pierres de granit vers une cible, en balayant la glace.",
      "Bobsleigh, luge, skeleton : descentes à grande vitesse sur des pistes de glace."
    ],
    "materiel": "Patins adaptés à la discipline, gants, vêtements chauds ; casque pour les petits et le short-track. Location de patins possible pour débuter.",
    "pourQui": "Dès 4 ans à l'école de glace. Le curling se pratique à tout âge. Le para hockey et le curling fauteuil sont ouverts aux personnes handicapées.",
    "repere": {
      "format": "Solo, duo ou équipe",
      "lieu": "Patinoire",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Tests fédéraux de patinage homologués par la FFSG, récompensés par des insignes.",
      "Catégories par âge.",
      "Loisir, compétition, ballet sur glace."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France par discipline.",
      "Grand Prix de France de patinage artistique.",
      "Championnats du monde et Jeux olympiques d'hiver."
    ],
    "bienfaits": [
      "Équilibre",
      "Souplesse",
      "Expression artistique",
      "Concentration"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation incluant les heures de glace, patins. Le haut niveau en artistique devient coûteux."
    },
    "sources": [
      {
        "label": "FFSG",
        "url": "https://www.ffsg.org"
      },
      {
        "label": "Vidal — sports de glace",
        "url": "https://www.vidal.fr/sante/sport/infos-sport-medicosport-sante/52/sports-de-glace-patinage-artistique-ou-synchronise-danse-sur-glace-et-short-track/"
      }
    ]
  },
  "roller-et-skateboard": {
    "federation": "Fédération française de roller et skateboard",
    "federationCodes": [
      "FFRS"
    ],
    "accroche": "Glisse urbaine, vitesse, figures ou sport collectif : le roller et le skate se pratiquent partout, toute l'année.",
    "principe": "Tu glisses sur des patins à roulettes ou une planche. En club, tu apprends d'abord à freiner, à tomber et à te diriger, puis tu choisis ta discipline : skate en skatepark, roller course, roller artistique, roller freestyle, rink-hockey ou roller derby.",
    "jeu": [
      "Skateboard : figures en street ou en park (bowl), notées par des juges.",
      "Roller course : courses de vitesse sur piste ou sur route.",
      "Roller artistique : sauts et pirouettes en musique.",
      "Rink-hockey et roller hockey : hockey sur roulettes, en salle.",
      "Roller derby : sport de contact par équipes sur une piste ovale."
    ],
    "materiel": "Rollers ou skateboard, casque, protège-poignets, genouillères et coudières.",
    "pourQui": "Dès 4-5 ans, filles et garçons. Le skate et le roller attirent autant les jeunes que les adultes qui veulent apprendre.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Rue, skatepark, salle",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Roues de couleur pour valider la progression.",
      "Catégories par âge en compétition.",
      "Loisir, randonnée roller, compétition."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France par discipline.",
      "Le skateboard est olympique depuis Tokyo 2020.",
      "Championnats du monde (World Skate)."
    ],
    "bienfaits": [
      "Équilibre",
      "Agilité",
      "Persévérance",
      "Liberté"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, rollers ou skate et protections."
    },
    "sources": [
      {
        "label": "FFRS — roues de couleur",
        "url": "https://www.ffroller-skateboard.fr"
      }
    ]
  },
  "char-a-voile": {
    "federation": "Fédération française de char à voile",
    "federationCodes": [
      "FFCV"
    ],
    "accroche": "Filer à toute vitesse sur une grande plage, propulsé par le vent : sensations garanties.",
    "principe": "Le char à voile est un véhicule à trois roues équipé d'une voile. Le pilote, allongé ou assis, se dirige avec les pieds ou un palonnier et règle sa voile avec une écoute. Il se pratique sur les grandes plages de sable à marée basse.",
    "jeu": [
      "Le vent fait avancer le char, comme un voilier.",
      "On se dirige avec les pieds, et on règle la vitesse avec la voile.",
      "Des règles de priorité évitent les collisions.",
      "En régate, on fait des tours autour de bouées.",
      "Le speed-sail (planche à roulettes avec voile) et le kite-buggy font aussi partie de la fédération."
    ],
    "materiel": "Casque, gants, lunettes, vêtements coupe-vent. Les chars sont fournis par le club ou l'école.",
    "pourQui": "Dès 7-8 ans sur des petits chars adaptés. Accessible aux débutants dès la première séance.",
    "repere": {
      "format": "Individuel",
      "lieu": "Plage",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Niveaux de pratique fédéraux.",
      "Classes de chars selon la taille et la puissance.",
      "Loisir, balade, régate."
    ],
    "competitions": [
      "Régates régionales et championnats de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Sensations de vitesse",
      "Lecture du vent",
      "Réflexes",
      "Plein air"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation ou séances avec location du char."
    },
    "sources": [
      {
        "label": "FFCV",
        "url": "https://www.ffcv.org"
      },
      {
        "label": "Vidal — fiche char à voile",
        "url": "https://www.vidal.fr/sante/sport/infos-sport-medicosport-sante/23/char-a-voile/"
      }
    ]
  },
  "gymnastique": {
    "federation": "Fédération française de gymnastique",
    "federationCodes": [
      "FFGym"
    ],
    "accroche": "Sauter, tourner, voler : la gymnastique développe force, souplesse et coordination comme aucun autre sport, et c'est la base de beaucoup d'autres.",
    "principe": "Le gymnaste réalise des enchaînements de figures acrobatiques sur des agrès (barres, poutre, sol, cheval…) ou au sol en musique. Des juges notent la difficulté et la qualité d'exécution. La fédération propose aussi des pratiques non compétitives : baby gym, gym pour tous, fitness.",
    "jeu": [
      "Gymnastique artistique féminine : saut, barres asymétriques, poutre, sol.",
      "Gymnastique artistique masculine : sol, cheval d'arçons, anneaux, saut, barres parallèles, barre fixe.",
      "Gymnastique rythmique : avec ballon, cerceau, massues, ruban ou corde, en musique.",
      "Trampoline, tumbling, gymnastique acrobatique, aérobic, TeamGym.",
      "La note combine difficulté et exécution."
    ],
    "materiel": "Un justaucorps ou une tenue près du corps, pieds nus ou chaussons. Maniques pour les barres quand on progresse.",
    "pourQui": "Dès 15 mois avec la baby gym, puis l'école de gym dès 4-6 ans. Gym pour tous, pilates et gym seniors pour les adultes.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Salle",
      "age": "Dès 15 mois (baby gym)"
    },
    "niveaux": [
      "Programmes Fédéral, Performance, puis Élite.",
      "Catégories par âge.",
      "Gym loisir, gym santé, freestyle gym, parkour."
    ],
    "competitions": [
      "Compétitions départementales, régionales et championnats de France.",
      "Championnats d'Europe et du monde.",
      "Jeux olympiques (artistique, rythmique, trampoline)."
    ],
    "bienfaits": [
      "Souplesse",
      "Force et gainage",
      "Coordination",
      "Courage"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et justaucorps."
    },
    "sources": [
      {
        "label": "FFGym — Baby Gym",
        "url": "https://www.ffgym.fr"
      }
    ]
  },
  "danse": {
    "federation": "Fédération française de danse",
    "federationCodes": [
      "FFDanse"
    ],
    "accroche": "Classique, hip-hop, salsa, rock, contemporain… la danse, c'est exprimer qui tu es en musique, seul, à deux ou en groupe.",
    "principe": "La danse associe mouvement, musique et expression. Il existe une multitude de styles, du classique aux danses urbaines, en passant par les danses de couple et les danses du monde. En club, tu apprends les pas de base, puis des chorégraphies, et tu peux monter sur scène ou en compétition.",
    "jeu": [
      "Les cours alternent échauffement, technique, puis chorégraphie.",
      "Danses de couple : un guide et un suiveur, sur des pas codifiés (rock, salsa, tango…).",
      "Danses en solo ou en groupe : classique, jazz, contemporain, hip-hop.",
      "Le breaking a été discipline olympique à Paris 2024 (il n'est pas au programme de Los Angeles 2028).",
      "Les galas de fin d'année permettent de présenter son travail sur scène."
    ],
    "materiel": "Une tenue souple, des chaussons, des baskets ou des chaussures de danse selon le style.",
    "pourQui": "Dès 4 ans en éveil, et à tout âge. Les danses de couple et de salon attirent beaucoup d'adultes et de seniors.",
    "repere": {
      "format": "Solo, duo ou groupe",
      "lieu": "Studio",
      "age": "Dès 4 ans"
    },
    "niveaux": [
      "Niveaux débutant, intermédiaire, avancé selon les écoles.",
      "Catégories par âge et par niveau en compétition.",
      "Loisir, spectacle, compétition."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France par style.",
      "Championnats d'Europe et du monde, battles de breaking."
    ],
    "bienfaits": [
      "Coordination",
      "Souplesse",
      "Expression",
      "Confiance en soi"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et chaussures de danse. Les costumes de gala s'ajoutent parfois."
    },
    "sources": [
      {
        "label": "Fédération française de danse",
        "url": "https://www.ffdanse.fr"
      }
    ]
  },
  "halterophilie-musculation-et-force": {
    "federation": "Fédération française d'haltérophilie-musculation · Fédération française de force",
    "federationCodes": [
      "FFHM",
      "FFForce"
    ],
    "accroche": "Devenir plus fort, avec méthode : en club, la charge s'apprend avec un coach, la technique avant le poids.",
    "principe": "L'haltérophilie consiste à soulever une barre chargée au-dessus de la tête en deux mouvements explosifs : l'arraché et l'épaulé-jeté. La force athlétique (powerlifting) repose sur trois mouvements : squat, développé couché et soulevé de terre. La musculation, enfin, vise à renforcer le corps.",
    "jeu": [
      "Haltérophilie : 3 essais à l'arraché et 3 à l'épaulé-jeté ; on additionne les meilleures barres.",
      "Force athlétique : 3 essais au squat, au développé couché et au soulevé de terre.",
      "Les athlètes sont classés par catégorie de poids corporel.",
      "Des arbitres valident chaque essai.",
      "Le développé couché se pratique aussi seul en compétition."
    ],
    "materiel": "Une tenue près du corps, des chaussures d'haltérophilie (talon surélevé) ou plates selon la discipline, une ceinture de force quand on progresse.",
    "pourQui": "Dès 10-12 ans pour l'apprentissage technique avec des charges légères. Très bonne pratique pour les adultes et les seniors qui veulent se renforcer.",
    "repere": {
      "format": "Individuel",
      "lieu": "Salle",
      "age": "Dès 10 ans"
    },
    "niveaux": [
      "Catégories par âge et par poids de corps.",
      "Niveaux de performance régionaux puis nationaux.",
      "Musculation loisir, préparation physique, compétition."
    ],
    "competitions": [
      "Compétitions régionales et championnats de France.",
      "Championnats d'Europe et du monde.",
      "Haltérophilie aux Jeux olympiques ; aux Jeux paralympiques, le para powerlifting se limite au développé couché."
    ],
    "bienfaits": [
      "Force",
      "Explosivité",
      "Densité osseuse",
      "Confiance en soi"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et chaussures adaptées."
    },
    "sources": [
      {
        "label": "FFHM",
        "url": "https://www.ffhaltero.fr"
      },
      {
        "label": "FFForce",
        "url": "https://www.ffforce.fr"
      }
    ]
  },
  "twirling-baton": {
    "federation": "Fédération française sportive de twirling bâton",
    "federationCodes": [
      "FFSTB"
    ],
    "accroche": "Un sport artistique qui mêle danse, gymnastique et maniement d'un bâton qui virevolte et s'envole.",
    "principe": "Le twirler fait tourner, lancer et rattraper un bâton tout en dansant et en réalisant des éléments gymniques, sur une musique. Des juges notent la technique du bâton, la qualité du corps et l'interprétation.",
    "jeu": [
      "Le bâton tourne autour des doigts, du corps, et peut être lancé très haut.",
      "Épreuves en solo, en duo, en équipe et en groupe.",
      "Programmes imposés et libres, notés par des juges.",
      "Le travail des deux mains est essentiel.",
      "Rubans, chorégraphies et costumes font partie du spectacle."
    ],
    "materiel": "Un bâton adapté à la taille, des chaussons ou chaussures de twirling, un justaucorps pour les compétitions.",
    "pourQui": "Dès 5-6 ans. Pratique mixte, souvent par équipes, qui convient à ceux qui aiment la danse et la gym.",
    "repere": {
      "format": "Solo ou équipe",
      "lieu": "Salle",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Niveaux techniques de progression.",
      "Catégories par âge et par niveau.",
      "Loisir, compétition nationale et internationale."
    ],
    "competitions": [
      "Championnats régionaux et de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Coordination",
      "Dextérité",
      "Souplesse",
      "Expression artistique"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, bâton et tenue de compétition."
    },
    "sources": [
      {
        "label": "FFSTB",
        "url": "https://fftwirl.fr"
      },
      {
        "label": "Contrat de délégation 2026-2029",
        "url": "https://www.sports.gouv.fr/sites/default/files/2026-06/ff-twirling-baton-2026-2029-signe-6671.pdf"
      }
    ]
  },
  "double-dutch": {
    "federation": "Fédération française de double dutch",
    "federationCodes": [
      "FFDD"
    ],
    "accroche": "Sauter entre deux cordes qui tournent en sens inverse : un sport urbain, rythmé et acrobatique.",
    "principe": "Deux tourneurs font tourner deux cordes en sens inverse, et un ou plusieurs sauteurs sautent à l'intérieur en réalisant des figures. Le jump rope (corde à sauter individuelle) fait partie de la même famille.",
    "jeu": [
      "Épreuves de vitesse : nombre de sauts en un temps donné.",
      "Épreuves de figures libres (freestyle) en musique, notées par des juges.",
      "Les tourneurs et sauteurs changent de rôle.",
      "Formats en simple, en équipe de 3 ou 4.",
      "Figures acrobatiques : roues, flips, pompes entre les cordes."
    ],
    "materiel": "Des cordes de double dutch, des baskets légères.",
    "pourQui": "Dès 6-7 ans. Très populaire dans les écoles et les quartiers, filles et garçons.",
    "repere": {
      "format": "En équipe",
      "lieu": "Salle et rue",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Initiation, loisir, compétition.",
      "Catégories par âge."
    ],
    "competitions": [
      "Championnats de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Cardio",
      "Coordination",
      "Rythme",
      "Esprit d'équipe"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation, cordes : très accessible."
    },
    "sources": [
      {
        "label": "Ville de Paris — le double dutch en 5 questions",
        "url": "https://www.paris.fr/pages/le-double-dutch-en-5-questions-7919"
      }
    ]
  },
  "sport-automobile": {
    "federation": "Fédération française du sport automobile",
    "federationCodes": [
      "FFSA"
    ],
    "accroche": "Du karting dès 7 ans aux rallyes et circuits : le sport automobile commence souvent en club, au volant d'un kart.",
    "principe": "Le pilote cherche à aller plus vite que ses adversaires sur un circuit, une route fermée ou un parcours tout-terrain, en maîtrisant les trajectoires, le freinage et la mécanique. Les associations sportives automobiles (ASA) organisent les épreuves et accueillent pilotes, copilotes, commissaires et bénévoles.",
    "jeu": [
      "Karting : la porte d'entrée, sur des petits circuits.",
      "Circuit : courses en peloton ou contre la montre.",
      "Rallye : spéciales chronométrées sur routes fermées, avec un copilote qui lit les notes.",
      "Course de côte, slalom, autocross, rallycross, drift.",
      "La sécurité est stricte : casque, combinaison ignifugée, équipements homologués."
    ],
    "materiel": "Casque, combinaison, gants et bottines homologués. Le véhicule peut être loué en karting ou en formule de découverte.",
    "pourQui": "Dès 6 ans en karting dans les Écoles françaises de karting, et en compétition Minikart dès 7 ans. On peut aussi s'impliquer comme commissaire de course, sans piloter.",
    "repere": {
      "format": "Individuel",
      "lieu": "Circuit",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Licences selon la discipline et le niveau (régional, national, international).",
      "Catégories de karting par âge (Minikart, Mini 60, Cadet, Junior, Senior).",
      "Pilotage, copilotage, officiel."
    ],
    "competitions": [
      "Coupes et championnats régionaux.",
      "Championnats de France de karting, rallye, circuit.",
      "Rallye Monte-Carlo, 24 Heures du Mans, Formule 1."
    ],
    "bienfaits": [
      "Concentration",
      "Réflexes",
      "Gestion du stress",
      "Culture mécanique"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Licence, véhicule, pneumatiques, carburant et engagements aux épreuves. Le karting de location permet de débuter à moindre coût."
    },
    "sources": [
      {
        "label": "FFSA Karting — catégories et âges",
        "url": "https://www.ffsakarting.org"
      },
      {
        "label": "Site de la fédération",
        "url": "https://www.ffsa.org"
      }
    ]
  },
  "motocyclisme": {
    "federation": "Fédération française de motocyclisme",
    "federationCodes": [
      "FFM"
    ],
    "accroche": "Motocross, enduro, trial, vitesse : la moto sportive se découvre en club, souvent dès l'enfance.",
    "principe": "Le pilote maîtrise sa moto sur différents terrains : pistes de terre avec bosses (motocross), sentiers naturels (enduro), zones d'obstacles à franchir sans poser le pied (trial), ou circuits asphaltés (vitesse). Le club t'apprend le pilotage et la sécurité.",
    "jeu": [
      "Motocross : courses sur circuit de terre avec sauts.",
      "Enduro : parcours nature chronométré.",
      "Trial : franchir des obstacles en posant le pied le moins possible.",
      "Vitesse : courses sur circuit asphalté.",
      "Supermotard, quad, side-car, moto-ball…"
    ],
    "materiel": "Casque, bottes, gants, lunettes, protections (pare-pierres, genouillères). La moto peut être prêtée dans les écoles de pilotage.",
    "pourQui": "Dès 6 ans environ dans les écoles de pilotage, sur des motos adaptées. Les adultes peuvent débuter en loisir sur terrain.",
    "repere": {
      "format": "Individuel",
      "lieu": "Terrain et circuit",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Guidons de progression pour les jeunes (bronze dès 6 ans, argent dès 7 ans, or), puis le CASM obligatoire dès 12 ans.",
      "Catégories par âge et par cylindrée.",
      "Licences loisir et compétition."
    ],
    "competitions": [
      "Championnats régionaux et de France par discipline.",
      "Motocross des Nations, MotoGP, championnats du monde."
    ],
    "bienfaits": [
      "Équilibre",
      "Réflexes",
      "Endurance musculaire",
      "Concentration"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Licence, moto, entretien, équipement et déplacements."
    },
    "sources": [
      {
        "label": "FFM — référentiel jeunes pilotes",
        "url": "https://www.ffmoto.org"
      }
    ]
  },
  "voitures-radiocommandees": {
    "federation": "Fédération française de voitures radiocommandées",
    "federationCodes": [
      "FFVRC"
    ],
    "accroche": "Le pilotage et la mécanique en modèle réduit : réglages, trajectoires et courses palpitantes.",
    "principe": "Tu pilotes une voiture miniature (souvent au 1/10e ou 1/8e) à l'aide d'une radiocommande, sur une piste aménagée. Tu apprends aussi à régler et réparer ta voiture. En course, les voitures s'affrontent pendant des manches chronométrées.",
    "jeu": [
      "Voitures électriques ou thermiques.",
      "Pistes sur route (asphalte, moquette) ou tout-terrain.",
      "Manches de qualification puis finales.",
      "Le classement se fait au nombre de tours et au temps.",
      "Un comptage électronique enregistre chaque passage."
    ],
    "materiel": "Une voiture radiocommandée, une radiocommande, des batteries ou du carburant, des outils de réglage.",
    "pourQui": "Dès 7 ans, âge conseillé par la fédération, et à tout âge. Idéal pour les passionnés de mécanique et de pilotage.",
    "repere": {
      "format": "Individuel",
      "lieu": "Piste",
      "age": "Dès 7 ans"
    },
    "niveaux": [
      "Catégories par type de voiture et d'échelle.",
      "Loisir, courses de club, compétition."
    ],
    "competitions": [
      "Courses régionales et championnats de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Réflexes",
      "Concentration",
      "Habileté technique",
      "Patience"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, voiture et pièces de rechange."
    },
    "sources": [
      {
        "label": "FFVRC",
        "url": "https://www.ffvrc.fr"
      }
    ]
  },
  "aeromodelisme": {
    "federation": "Fédération française d'aéromodélisme",
    "federationCodes": [
      "FFAM"
    ],
    "accroche": "Construire et piloter des avions, planeurs, hélicoptères ou drones en modèle réduit : technique, patience et sensations.",
    "principe": "L'aéromodélisme consiste à concevoir, construire et faire voler des aéronefs miniatures, le plus souvent télécommandés. En club, tu apprends à piloter sur simulateur puis en double commande avec un moniteur, avant de voler seul.",
    "jeu": [
      "Avions, planeurs, hélicoptères et drones radiocommandés.",
      "Vol de voltige, vol de vitesse, maquettes, vol libre.",
      "Course de drones (FPV), pilotée avec des lunettes vidéo.",
      "Le vol se fait sur des terrains autorisés et selon une réglementation stricte.",
      "La construction et le réglage font partie du plaisir."
    ],
    "materiel": "Un modèle, une radiocommande, des batteries. Le club prête souvent un avion école pour débuter.",
    "pourQui": "Dès 8-10 ans, et à tout âge. Les clubs proposent des écoles de pilotage.",
    "repere": {
      "format": "Individuel",
      "lieu": "Terrain de vol",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Brevets et qualifications de pilote délivrés par la fédération.",
      "Catégories selon le type de modèle.",
      "Loisir, compétition, construction."
    ],
    "competitions": [
      "Concours régionaux et championnats de France par catégorie.",
      "Championnats du monde."
    ],
    "bienfaits": [
      "Précision",
      "Patience",
      "Habileté manuelle",
      "Culture scientifique"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, cotisation, modèle et radiocommande."
    },
    "sources": [
      {
        "label": "FFAM",
        "url": "https://www.ffam.asso.fr"
      }
    ]
  },
  "parachutisme": {
    "federation": "Fédération française de parachutisme",
    "federationCodes": [
      "FFP"
    ],
    "accroche": "Sauter d'un avion et voler en chute libre : une des expériences les plus intenses qui soient, encadrée par des moniteurs.",
    "principe": "Le parachutiste saute d'un avion, chute librement pendant quelques dizaines de secondes, puis ouvre son parachute pour atterrir en douceur. On découvre souvent avec un saut en tandem, attaché à un moniteur, puis on apprend seul avec la méthode PAC (progression accompagnée en chute).",
    "jeu": [
      "Saut en tandem : baptême, attaché à un moniteur.",
      "PAC : apprentissage de la chute libre avec deux moniteurs à tes côtés.",
      "Disciplines : vol relatif (figures à plusieurs), précision d'atterrissage, voile contact, freefly, wingsuit.",
      "Les sauts se font depuis 1 000 à 4 000 m d'altitude.",
      "Le parachute de secours et l'ouvreur automatique assurent la sécurité."
    ],
    "materiel": "Le parachute, l'altimètre, le casque et la combinaison sont fournis pendant la formation.",
    "pourQui": "Le baptême en tandem est ouvert dès un âge minimum fixé par chaque centre ; la formation en solo s'adresse aux adolescents (avec autorisation parentale) et aux adultes.",
    "repere": {
      "format": "Solo ou en groupe",
      "lieu": "Ciel",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Brevets A, B, C, D selon le nombre de sauts et les compétences.",
      "Spécialisations par discipline.",
      "Moniteur, parachutiste confirmé."
    ],
    "competitions": [
      "Championnats de France par discipline.",
      "Championnats du monde."
    ],
    "bienfaits": [
      "Gestion du stress",
      "Concentration",
      "Confiance",
      "Sensations fortes"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Formation et sauts facturés à l'unité ou en forfait : une pratique coûteuse au départ."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffp.asso.fr"
      }
    ]
  },
  "vol-en-planeur": {
    "federation": "Fédération française de vol en planeur",
    "federationCodes": [
      "FFVP"
    ],
    "accroche": "Voler sans moteur, en utilisant les courants d'air chaud : le pilotage dans ce qu'il a de plus pur.",
    "principe": "Le planeur est un avion sans moteur, très léger, avec de grandes ailes. Il est lancé par un avion remorqueur ou par un treuil, puis le pilote utilise les courants ascendants (thermiques) pour monter et parcourir des distances parfois très longues.",
    "jeu": [
      "Le décollage se fait en remorquage par un avion ou au treuil.",
      "On monte en tournant dans les ascendances, puis on plane jusqu'à la suivante.",
      "Les vols peuvent durer plusieurs heures et parcourir des centaines de kilomètres.",
      "Formation en double commande avec un instructeur.",
      "Le lâché (premier vol seul) est un grand moment."
    ],
    "materiel": "Les planeurs appartiennent au club. Un parachute de secours est fourni.",
    "pourQui": "Dès l'adolescence : le premier vol seul est possible à partir de 14 ans. Les jeunes bénéficient souvent d'aides fédérales ou régionales.",
    "repere": {
      "format": "Solo",
      "lieu": "Ciel",
      "age": "Dès 14 ans"
    },
    "niveaux": [
      "Brevet de pilote planeur (SPL), puis qualifications.",
      "Insignes de performance (argent, or, diamant).",
      "Voltige, vol de distance, vol en montagne."
    ],
    "competitions": [
      "Championnats régionaux et de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Concentration",
      "Lecture de la météo",
      "Autonomie",
      "Sang-froid"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Cotisation, licence et heures de vol. Les clubs associatifs restent bien moins chers que l'aviation à moteur."
    },
    "sources": [
      {
        "label": "FFVP",
        "url": "https://www.ffvp.fr"
      }
    ]
  },
  "vol-libre": {
    "federation": "Fédération française de vol libre",
    "federationCodes": [
      "FFVL"
    ],
    "accroche": "Décoller d'une montagne à pied et planer comme un oiseau : parapente, delta et cerf-volant réunis.",
    "principe": "Le vol libre regroupe les activités où l'on vole grâce à une voile, sans moteur : le parapente (voile souple), le deltaplane (aile rigide) et le kite. On décolle en courant dans une pente face au vent, puis on utilise les courants ascendants pour rester en l'air.",
    "jeu": [
      "Parapente : la discipline la plus pratiquée, accessible après un stage d'initiation.",
      "Deltaplane : aile rigide, plus rapide.",
      "Le cerf-volant et le kite à terre ou sur neige (landkite, snowkite) font aussi partie de la fédération ; le kitesurf de compétition dépend de la FFVoile.",
      "Les vols durent de quelques minutes à plusieurs heures.",
      "La météo décide de tout : on ne vole que dans de bonnes conditions."
    ],
    "materiel": "Voile, sellette, casque, parachute de secours. Prêtés en école pendant les stages.",
    "pourQui": "Dès 14 ans environ pour un stage d'initiation au parapente ; le baptême biplace est possible plus jeune. Les écoles labellisées accueillent tous les profils.",
    "repere": {
      "format": "Solo",
      "lieu": "Ciel",
      "age": "Dès 14 ans"
    },
    "niveaux": [
      "Brevets (initial, pilote, pilote confirmé) et passeport de progression.",
      "Vol de distance, voltige, vol rando, kite."
    ],
    "competitions": [
      "Compétitions de distance (cross) et de précision d'atterrissage.",
      "Championnats de France et du monde."
    ],
    "bienfaits": [
      "Gestion des émotions",
      "Lecture de la météo",
      "Autonomie",
      "Contact avec la nature"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Stages d'initiation, puis achat d'une voile et d'un équipement complet."
    },
    "sources": [
      {
        "label": "FFVL",
        "url": "https://federation.ffvl.fr"
      },
      {
        "label": "FFVoile — kiteboard",
        "url": "https://www.ffvoile.fr"
      }
    ]
  },
  "ulm": {
    "federation": "Fédération française d'ULM",
    "federationCodes": [
      "FFPLUM"
    ],
    "accroche": "Voler en avion léger, avec une formation plus courte et moins chère : l'ULM rend le ciel accessible.",
    "principe": "L'ULM (ultra-léger motorisé) est un petit aéronef à moteur : pendulaire, multiaxe (petit avion), paramoteur, autogire, aérostat ou hélicoptère ultra-léger. Le pilote apprend en double commande avec un instructeur avant de voler seul.",
    "jeu": [
      "Six classes d'ULM, du paramoteur à l'autogire.",
      "Formation pratique en double commande.",
      "Brevet de pilote ULM et théorie aéronautique.",
      "Navigation en vue du sol.",
      "La météo et la sécurité guident chaque vol."
    ],
    "materiel": "L'appareil est mis à disposition par le club ou l'école. Casque et tenue adaptée.",
    "pourQui": "Adolescents et adultes : le brevet de pilote ULM est accessible dès 15 ans, avec autorisation parentale pour les mineurs.",
    "repere": {
      "format": "Solo ou à deux",
      "lieu": "Ciel",
      "age": "Dès 15 ans"
    },
    "niveaux": [
      "Brevet et licence de pilote ULM par classe.",
      "Qualifications d'emport de passager et d'instructeur."
    ],
    "competitions": [
      "Rallyes de navigation et épreuves de précision.",
      "Championnats de France et du monde."
    ],
    "bienfaits": [
      "Concentration",
      "Sang-froid",
      "Lecture de la météo",
      "Découverte"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Formation et heures de vol, ou achat d'un appareil. Plus abordable que l'aviation classique."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffplum.fr"
      }
    ]
  },
  "aviation": {
    "federation": "Fédération française aéronautique",
    "federationCodes": [
      "FFA-Aéro"
    ],
    "accroche": "Apprendre à piloter un avion dans un aéroclub, comme des générations de pilotes avant toi.",
    "principe": "En aéroclub, tu apprends à piloter un avion léger avec un instructeur, en double commande : décollage, tours de piste, atterrissage, navigation. Après quelques heures, tu effectues ton premier vol seul, puis tu passes un brevet ou une licence de pilote privé.",
    "jeu": [
      "Formation théorique (réglementation, météo, navigation) et pratique.",
      "Lâché solo après plusieurs heures de vol.",
      "Brevet de base, LAPL ou PPL (pilote privé).",
      "Voltige aérienne, vol de navigation, rallyes.",
      "Le BIA (brevet d'initiation aéronautique) est accessible aux collégiens et lycéens."
    ],
    "materiel": "Les avions appartiennent au club. Un casque audio peut être prêté.",
    "pourQui": "La formation peut commencer à l'adolescence ; le premier vol seul est possible à partir de 16 ans. Le BIA se prépare dès le collège.",
    "repere": {
      "format": "Solo ou à deux",
      "lieu": "Ciel",
      "age": "Dès l'adolescence"
    },
    "niveaux": [
      "BIA, brevet de base, LAPL, PPL.",
      "Qualifications voltige, vol de nuit, instructeur."
    ],
    "competitions": [
      "Rallyes aériens et championnats de voltige.",
      "Championnats du monde de voltige et de pilotage de précision."
    ],
    "bienfaits": [
      "Rigueur",
      "Concentration",
      "Autonomie",
      "Culture scientifique"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Cotisation et heures de vol facturées : la licence représente un budget conséquent. Des bourses existent pour les jeunes."
    },
    "sources": [
      {
        "label": "Fédération française aéronautique",
        "url": "https://www.ff-aero.fr"
      }
    ]
  },
  "helicoptere": {
    "federation": "Fédération française d'hélicoptère",
    "federationCodes": [
      "FFHélico"
    ],
    "accroche": "Le pilotage le plus exigeant : faire tenir un hélicoptère en vol stationnaire est un défi technique passionnant.",
    "principe": "Le pilote d'hélicoptère contrôle simultanément le pas collectif, le cyclique et le palonnier pour décoller verticalement, se maintenir en stationnaire et se déplacer dans toutes les directions. La formation se fait en école avec un instructeur.",
    "jeu": [
      "Formation en double commande.",
      "Vol stationnaire, translation, atterrissage de précision.",
      "Licence de pilote privé hélicoptère.",
      "Épreuves sportives de précision (maniabilité, slalom).",
      "Sécurité et préparation des vols."
    ],
    "materiel": "Appareil mis à disposition par l'école ou le club.",
    "pourQui": "Adolescents et adultes, sous conditions d'âge et d'aptitude médicale.",
    "repere": {
      "format": "Solo",
      "lieu": "Ciel",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Licence pilote privé hélicoptère.",
      "Qualifications et épreuves sportives."
    ],
    "competitions": [
      "Championnats de France et du monde d'hélicoptère sportif (épreuves de précision)."
    ],
    "bienfaits": [
      "Coordination",
      "Concentration",
      "Sang-froid",
      "Précision"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Heures de vol très coûteuses : c'est l'une des pratiques aériennes les plus chères."
    },
    "sources": [
      {
        "label": "Ministère des Sports — giraviation",
        "url": "https://www.sports.gouv.fr/giraviation-158"
      }
    ]
  },
  "aerostation": {
    "federation": "Fédération française d'aérostation",
    "federationCodes": [
      "FFAé"
    ],
    "accroche": "Voler en montgolfière, porté par le vent, au-dessus des paysages : la plus ancienne façon de voler.",
    "principe": "Le pilote de montgolfière fait monter ou descendre le ballon en chauffant l'air de l'enveloppe avec un brûleur. Il ne dirige pas directement le ballon : il choisit l'altitude pour trouver le vent qui l'emmène dans la bonne direction.",
    "jeu": [
      "Le ballon suit le vent : le pilote joue sur les différentes couches d'air.",
      "Les vols se font tôt le matin ou en fin de journée, quand l'air est calme.",
      "Une équipe au sol suit le ballon en voiture pour le récupérer.",
      "En compétition, il faut lancer un marqueur au plus près d'une cible.",
      "Une licence de pilote est nécessaire."
    ],
    "materiel": "Ballon, nacelle, brûleur et bouteilles de gaz, souvent mis en commun par le club.",
    "pourQui": "Adolescents et adultes ; tout le monde peut participer à l'équipe au sol.",
    "repere": {
      "format": "En équipage",
      "lieu": "Ciel",
      "age": "Ados et adultes"
    },
    "niveaux": [
      "Licence de pilote de ballon.",
      "Qualifications pour emporter des passagers."
    ],
    "competitions": [
      "Championnats de France et du monde de montgolfière."
    ],
    "bienfaits": [
      "Lecture de la météo",
      "Travail d'équipe",
      "Calme",
      "Émerveillement"
    ],
    "budget": {
      "niveau": 3,
      "texte": "Matériel, gaz et formation : une pratique coûteuse, souvent partagée en club."
    },
    "sources": [
      {
        "label": "FFAé",
        "url": "https://www.ffaerostation.org"
      }
    ]
  },
  "tir-sportif": {
    "federation": "Fédération française de tir",
    "federationCodes": [
      "FFTir"
    ],
    "accroche": "Calme, respiration et précision absolue : le tir sportif est un sport de concentration où le mental fait la différence.",
    "principe": "Le tireur vise une cible à distance fixe avec une carabine ou un pistolet, à air comprimé ou à feu. Chaque impact rapporte des points selon la zone touchée, jusqu'à 10 au centre. On apprend d'abord la sécurité, puis la position, la visée et le lâcher du coup.",
    "jeu": [
      "Tir à 10 m à air comprimé : la discipline de base, en salle.",
      "Tir à 25 m et 50 m avec des armes à feu de petit calibre.",
      "Plateau (fosse, skeet) : tirer au fusil sur des plateaux d'argile lancés en l'air.",
      "Disciplines variées : arbalète, tir aux armes anciennes, tir sportif de vitesse.",
      "La sécurité est la règle n°1 : l'arme est toujours dirigée vers la cible."
    ],
    "materiel": "Le club prête les armes et le matériel aux débutants. Les tireurs confirmés acquièrent leur propre matériel, avec les autorisations nécessaires.",
    "pourQui": "Dès 8 ans à l'école de tir (à air comprimé). Le tir est accessible aux personnes en situation de handicap, debout ou en fauteuil.",
    "repere": {
      "format": "Individuel",
      "lieu": "Stand de tir",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "« Cibles Couleurs » pour valider la progression (blanche, jaune, orange, verte, bleue, marron, arc-en-ciel), puis niveaux averti, confirmé et expert.",
      "Catégories par âge, de poussins à seniors.",
      "Loisir, compétition, tir handisport."
    ],
    "competitions": [
      "Championnats départementaux, régionaux et de France.",
      "Championnats d'Europe et du monde.",
      "Jeux olympiques et paralympiques."
    ],
    "bienfaits": [
      "Concentration",
      "Maîtrise de soi",
      "Gestion du stress",
      "Patience"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et munitions ou plombs. Le matériel est prêté pour débuter."
    },
    "sources": [
      {
        "label": "FFTir — Cibles Couleurs",
        "url": "https://www.fftir.org"
      }
    ]
  },
  "tir-a-l-arc": {
    "federation": "Fédération française de tir à l'arc",
    "federationCodes": [
      "FFTA"
    ],
    "accroche": "Un geste ancestral devenu sport olympique : précision, régularité et sérénité, en salle ou en pleine nature.",
    "principe": "L'archer tire des flèches sur une cible à distance fixe. Chaque flèche rapporte de 1 à 10 points selon l'endroit où elle se plante. La régularité du geste est la clé : il faut répéter exactement le même mouvement à chaque tir.",
    "jeu": [
      "Tir en salle à 18 m, tir en extérieur jusqu'à 70 m (arc classique olympique).",
      "Arc classique (olympique), arc à poulies (compound), arc nu, arc droit.",
      "Tir en campagne et tir 3D en forêt, sur des cibles en forme d'animaux.",
      "Les archers tirent par volées de 3 ou 6 flèches.",
      "Les règles de sécurité encadrent strictement les déplacements sur le pas de tir."
    ],
    "materiel": "Le club prête l'arc, les flèches, le carquois et les protections (palette, protège-bras) aux débutants.",
    "pourQui": "Dès 8-9 ans, et à tout âge. Très accessible aux personnes en situation de handicap (para-tir à l'arc).",
    "repere": {
      "format": "Individuel",
      "lieu": "Salle et extérieur",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Plumes de progression pour les plus jeunes, puis flèches de progression (blanche, noire, bleue, rouge, jaune).",
      "Catégories par âge et par type d'arc.",
      "Loisir, compétition, tir nature."
    ],
    "competitions": [
      "Concours en salle l'hiver et en extérieur l'été.",
      "Championnats régionaux et de France.",
      "Coupes du monde, Jeux olympiques et paralympiques."
    ],
    "bienfaits": [
      "Concentration",
      "Posture et dos",
      "Patience",
      "Calme"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation ; l'achat d'un arc personnel vient plus tard."
    },
    "sources": [
      {
        "label": "FFTA — distinctions (plumes et flèches)",
        "url": "https://www.ffta.fr"
      }
    ]
  },
  "ball-trap": {
    "federation": "Fédération française de ball-trap et de tir à balle",
    "federationCodes": [
      "FFBT"
    ],
    "accroche": "Toucher une cible en mouvement lancée dans le ciel : réflexes, anticipation et précision.",
    "principe": "Le tireur, armé d'un fusil de chasse, tire sur des plateaux en argile lancés par des machines à différentes vitesses et trajectoires. Chaque plateau cassé rapporte un point.",
    "jeu": [
      "Fosse universelle et DTL : les plateaux partent loin devant le tireur dans des directions variées (la fosse et le skeet olympiques relèvent de la FFTir).",
      "Compak sporting et parcours de chasse : trajectoires imitant le gibier.",
      "Le tireur dispose d'un ou deux coups par plateau selon la discipline.",
      "Les tireurs passent à tour de rôle sur plusieurs postes.",
      "Les règles de sécurité sont très strictes."
    ],
    "materiel": "Fusil, cartouches, protections auditives et lunettes. Le matériel peut être prêté en initiation.",
    "pourQui": "Adolescents et adultes, en initiation encadrée sur un stand agréé ; la licence de compétition est accessible dès 12 ans.",
    "repere": {
      "format": "Individuel",
      "lieu": "Stand",
      "age": "Dès 12 ans"
    },
    "niveaux": [
      "Catégories par âge et par niveau.",
      "Loisir et compétition."
    ],
    "competitions": [
      "Concours régionaux et championnats de France.",
      "Championnats internationaux."
    ],
    "bienfaits": [
      "Réflexes",
      "Concentration",
      "Coordination",
      "Calme"
    ],
    "budget": {
      "niveau": 2,
      "texte": "Licence, plateaux et cartouches à chaque séance, fusil personnel ensuite."
    },
    "sources": [
      {
        "label": "FFBT — statuts et disciplines",
        "url": "https://www.ffbt.asso.fr"
      }
    ]
  },
  "javelot-tir-sur-cible": {
    "federation": "Fédération française de javelot tir sur cible",
    "federationCodes": [
      "FFJTSC"
    ],
    "accroche": "Un jeu populaire du Nord, hérité du Moyen Âge : lancer de lourdes fléchettes sur une cible en bois, dans une ambiance conviviale.",
    "principe": "Le javeloteur lance à la main des javelots (de grosses fléchettes lestées) sur une cible ronde en bois de peuplier. Toucher le petit cercle central rapporte plus de points que le grand cercle. Le jeu se pratique surtout dans les Hauts-de-France.",
    "jeu": [
      "Le joueur lance ses javelots à tour de rôle vers une cible en bois de peuplier placée à 80 cm du sol.",
      "Le petit cercle central vaut 2 points, la zone entre le petit et le grand cercle vaut 1 point.",
      "Les compétitions se jouent en individuel, en doublette ou en triplette.",
      "Les finales de championnat se disputent en 3 tours de 24 javelots, en additionnant les points.",
      "Le jeu est souvent pratiqué dans des estaminets et lors de fêtes."
    ],
    "materiel": "Des javelots ; la cible est fournie par le club.",
    "pourQui": "Pour tous, des jeunes aux seniors. Un jeu de tradition très convivial.",
    "repere": {
      "format": "Solo ou en équipe",
      "lieu": "Salle et estaminet",
      "age": "Tout âge"
    },
    "niveaux": [
      "Catégories par âge et par niveau.",
      "Loisir et compétition."
    ],
    "competitions": [
      "Concours de clubs, championnats de ligue et de France."
    ],
    "bienfaits": [
      "Adresse",
      "Concentration",
      "Convivialité",
      "Patrimoine régional"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes."
    },
    "sources": [
      {
        "label": "Dico du sport — javelot tir sur cible",
        "url": "https://dicodusport.fr/?p=285"
      }
    ]
  },
  "billard": {
    "federation": "Fédération française de billard",
    "federationCodes": [
      "FFB"
    ],
    "accroche": "Géométrie, toucher de bille et stratégie : le billard est un vrai sport de précision, pratiqué à tout âge.",
    "principe": "À l'aide d'une queue, tu frappes une bille pour qu'elle en touche d'autres selon les règles du jeu. Selon la discipline, il faut empocher des billes dans des poches ou réaliser des points en touchant deux billes avec la tienne.",
    "jeu": [
      "Carambole (billard français) : table sans poches, il faut toucher les deux autres billes avec la sienne.",
      "Blackball (billard anglais) et billard américain : empocher ses billes, puis la noire.",
      "Snooker : table plus grande, enchaînement des billes rouges et de couleur.",
      "Chaque coup réussi permet de rejouer.",
      "Les effets donnés à la bille sont au cœur de la technique."
    ],
    "materiel": "Le club fournit tables, billes et queues. Une queue personnelle vient avec la progression.",
    "pourQui": "Dès 8-10 ans, et à tout âge. Peu physique, il est idéal pour pratiquer longtemps.",
    "repere": {
      "format": "En duel",
      "lieu": "Salle",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Catégories de niveau (Régional, National, Master…) selon les moyennes.",
      "Catégories par âge.",
      "Loisir, compétition par équipes ou individuelle."
    ],
    "competitions": [
      "Championnats régionaux et de France par discipline.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Concentration",
      "Précision",
      "Réflexion",
      "Patience"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation (accès aux tables), queue personnelle ensuite."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffbillard.com"
      }
    ]
  },
  "bowling-et-quilles": {
    "federation": "Fédération française de bowling et de sport de quilles",
    "federationCodes": [
      "FFBSQ"
    ],
    "accroche": "Le bowling, ce n'est pas qu'une sortie entre amis : c'est un sport de précision, avec ses techniques, ses championnats et ses effets.",
    "principe": "Le joueur lance une boule sur une piste pour renverser 10 quilles. Il dispose de deux lancers par jeu (frame). Une partie compte 10 frames. Abattre toutes les quilles en un lancer, c'est un strike ; en deux lancers, un spare.",
    "jeu": [
      "Une partie dure 10 frames, le score maximal est de 300.",
      "Strike et spare rapportent des bonus sur les lancers suivants.",
      "Les joueurs confirmés donnent de l'effet à la boule pour la faire tourner vers les quilles.",
      "Les compétitions se jouent en individuel, en doublette ou en équipe.",
      "Les sports de quilles traditionnels (quilles de 9, quilles au maillet…) font aussi partie de la fédération."
    ],
    "materiel": "Chaussures de bowling et boule adaptée à ta main (prêtées au début).",
    "pourQui": "Dès 6-7 ans, et à tout âge. Très accessible et mixte.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Bowling",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Classement par moyenne de score.",
      "Catégories jeunes, seniors, vétérans.",
      "Loisir et compétition."
    ],
    "competitions": [
      "Ligues de club, championnats régionaux et de France.",
      "Championnats d'Europe et du monde."
    ],
    "bienfaits": [
      "Précision",
      "Coordination",
      "Concentration",
      "Convivialité"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, parties jouées et, plus tard, boule personnelle."
    },
    "sources": [
      {
        "label": "FFBSQ",
        "url": "https://www.ffbsq.fr"
      },
      {
        "label": "Vidal — bowling et sports de quilles",
        "url": "https://www.vidal.fr/sante/sport/infos-sport-medicosport-sante/154/bowling-et-sports-de-quilles/"
      }
    ]
  },
  "petanque-et-jeu-provencal": {
    "federation": "Fédération française de pétanque et jeu provençal",
    "federationCodes": [
      "FFPJP"
    ],
    "accroche": "Tu pointes ou tu tires ? La pétanque est un vrai sport de précision et de stratégie, avec ses championnats et ses champions du monde.",
    "principe": "Deux équipes lancent des boules métalliques le plus près possible d'une petite boule en bois, le but (ou cochonnet). On peut « pointer » (approcher) ou « tirer » (déloger une boule adverse). L'équipe qui a la boule la plus proche marque un point par boule mieux placée que la meilleure adverse.",
    "jeu": [
      "On joue en tête-à-tête (3 boules chacun), doublette (3 boules chacun) ou triplette (2 boules chacun).",
      "La partie se joue généralement en 13 points.",
      "On lance pieds joints dans un cercle tracé au sol.",
      "Le jeu provençal (ou longue) se joue sur une distance plus longue, avec élan.",
      "Le tir de précision est une épreuve individuelle chronométrée."
    ],
    "materiel": "Des boules homologuées adaptées à ta main, un but. Les clubs prêtent souvent des boules pour débuter.",
    "pourQui": "Pour tous, des enfants (écoles de pétanque) aux seniors. Un sport intergénérationnel par excellence.",
    "repere": {
      "format": "Solo, doublette, triplette",
      "lieu": "Boulodrome",
      "age": "Tout âge"
    },
    "niveaux": [
      "Catégories : minimes, cadets, juniors, seniors, vétérans, féminines.",
      "Classement des joueurs (promotion, honneur, élite).",
      "Loisir, concours officiels, championnats des clubs."
    ],
    "competitions": [
      "Concours locaux tous les week-ends.",
      "Championnats départementaux, régionaux et de France.",
      "Championnats du monde."
    ],
    "bienfaits": [
      "Précision",
      "Concentration",
      "Convivialité",
      "Lien intergénérationnel"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence, cotisation et un jeu de boules."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffpjp.org"
      }
    ]
  },
  "sport-boules": {
    "federation": "Fédération française du sport boules",
    "federationCodes": [
      "FFSB"
    ],
    "accroche": "La boule lyonnaise : un sport de boules plus physique qu'il n'y paraît, avec des épreuves de tir rapide spectaculaires.",
    "principe": "Comme à la pétanque, il faut placer ses boules au plus près du but, mais sur un terrain plus long et avec de grosses boules. Le jeu se pratique avec élan, et des épreuves athlétiques (tir progressif, tir rapide) mettent le physique à l'épreuve.",
    "jeu": [
      "Jeu traditionnel en simple, double, triple ou quadrette.",
      "Tir progressif : courir et tirer sur des boules placées à distance croissante, en un temps limité.",
      "Tir de précision : toucher des cibles dans un ordre précis.",
      "Épreuves de combiné et de relais.",
      "Le terrain (cadre) est plus long qu'à la pétanque."
    ],
    "materiel": "Boules lyonnaises (fournies par le club au début), chaussures de sport.",
    "pourQui": "Dès 8-10 ans, et à tout âge. Les épreuves de tir attirent les plus sportifs.",
    "repere": {
      "format": "Solo ou en équipe",
      "lieu": "Boulodrome",
      "age": "Dès 8 ans"
    },
    "niveaux": [
      "Catégories par âge et par division.",
      "Jeu traditionnel et épreuves athlétiques."
    ],
    "competitions": [
      "Concours, championnats régionaux et de France.",
      "Championnats du monde."
    ],
    "bienfaits": [
      "Précision",
      "Explosivité",
      "Endurance",
      "Convivialité"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes."
    },
    "sources": [
      {
        "label": "Fédération française du sport-boules",
        "url": "https://www.ffsb.fr"
      }
    ]
  },
  "echecs": {
    "federation": "Fédération française des échecs",
    "federationCodes": [
      "FFE"
    ],
    "accroche": "Le sport de l'esprit : anticipation, logique et créativité, contre un adversaire qui pense aussi vite que toi.",
    "principe": "Deux joueurs s'affrontent sur un échiquier de 64 cases, chacun avec 16 pièces. Le but est de mettre le roi adverse « échec et mat », c'est-à-dire en position d'être pris sans pouvoir s'échapper. Chaque pièce a sa façon de se déplacer.",
    "jeu": [
      "Les blancs commencent ; les joueurs jouent à tour de rôle.",
      "Une pendule limite le temps de réflexion de chaque joueur.",
      "Cadences : parties lentes (plusieurs heures), rapides, et blitz (quelques minutes).",
      "Une partie peut aussi se terminer par une nulle (pat, accord, répétition).",
      "Le classement Elo mesure ton niveau et évolue après chaque partie."
    ],
    "materiel": "Rien ! Le club fournit échiquiers et pendules. On peut aussi s'entraîner en ligne.",
    "pourQui": "Dès 5-6 ans, et sans limite d'âge. Garçons, filles, jeunes et seniors jouent ensemble.",
    "repere": {
      "format": "En duel",
      "lieu": "Club",
      "age": "Dès 5 ans"
    },
    "niveaux": [
      "Classement Elo, de débutant à grand maître international.",
      "Catégories par âge en compétition jeune.",
      "Loisir, tournois, interclubs."
    ],
    "competitions": [
      "Tournois ouverts tous les week-ends.",
      "Interclubs, du niveau départemental au Top 16.",
      "Championnats de France jeunes et adultes, olympiades d'échecs."
    ],
    "bienfaits": [
      "Concentration",
      "Mémoire",
      "Logique",
      "Patience"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, souvent modestes."
    },
    "sources": [
      {
        "label": "FFE — Top 16",
        "url": "https://www.echecs.asso.fr"
      }
    ]
  },
  "pelote-basque": {
    "federation": "Fédération française de pelote basque",
    "federationCodes": [
      "FFPB"
    ],
    "accroche": "Le sport emblématique du Pays basque : une balle, un mur (le fronton) et une multitude de façons de jouer.",
    "principe": "Deux joueurs ou deux équipes frappent une pelote contre un mur, à tour de rôle, pour que l'adversaire ne puisse pas la renvoyer. Selon la spécialité, on frappe à main nue, avec une raquette en bois (pala), ou avec un panier en osier (chistera, cesta punta).",
    "jeu": [
      "La pelote doit frapper le mur au-dessus d'une ligne, puis retomber dans la zone de jeu.",
      "Spécialités en place libre (fronton à l'air libre) ou en trinquet et mur à gauche (salles fermées).",
      "Main nue, pala, xare, chistera, cesta punta, frontenis.",
      "Les points se comptent jusqu'à un total fixé par la spécialité et la catégorie.",
      "Le jeu demande réflexes et puissance."
    ],
    "materiel": "Selon la spécialité : pala, chistera, raquette ou protections de main. Pelotes fournies par le club.",
    "pourQui": "Dès 6-8 ans dans les écoles de pelote, et à tout âge. Très implantée dans le Sud-Ouest, elle se pratique aussi dans d'autres régions.",
    "repere": {
      "format": "Solo ou en équipe",
      "lieu": "Fronton et trinquet",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Catégories par âge et par niveau (Nationale B, Nationale A, Première…).",
      "De nombreuses spécialités, à main nue ou avec instrument."
    ],
    "competitions": [
      "Championnats régionaux et de France par spécialité.",
      "Championnats du monde de pelote basque."
    ],
    "bienfaits": [
      "Réflexes",
      "Puissance",
      "Coordination",
      "Patrimoine"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation ; l'instrument (pala, chistera) selon la spécialité."
    },
    "sources": [
      {
        "label": "Fédération française de pelote basque",
        "url": "https://ffpb.net"
      }
    ]
  },
  "longue-paume": {
    "federation": "Fédération française de longue paume",
    "federationCodes": [
      "FFLP"
    ],
    "accroche": "L'ancêtre du tennis, joué en plein air dans les parcs, surtout en Picardie et à Paris au jardin du Luxembourg.",
    "principe": "La longue paume est un jeu d'échanges et de « gagne-terrain ». Deux équipes se renvoient une petite balle avec une raquette, sur un long terrain sans filet. Le jeu de « chasses » détermine les changements de camp : il faut gagner du terrain sur l'adversaire.",
    "jeu": [
      "On joue en équipes, sur un terrain en extérieur.",
      "La balle est frappée avec une raquette (autrefois à la main, d'où le nom).",
      "Les « chasses » marquent l'endroit où la balle s'est arrêtée et servent à départager les équipes.",
      "Le comptage des points ressemble à celui du tennis.",
      "Un arbitre, des commissaires et un marqueur encadrent les parties."
    ],
    "materiel": "Raquette et balles, fournies par le club.",
    "pourQui": "Jeunes et adultes ; un sport rare, à découvrir dans les clubs de Picardie et d'Île-de-France.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur",
      "age": "Jeunes et adultes"
    },
    "niveaux": [
      "Catégories par niveau et par âge.",
      "Simple et équipes."
    ],
    "competitions": [
      "Championnats de France, souvent disputés à Amiens.",
      "Rencontres traditionnelles régionales."
    ],
    "bienfaits": [
      "Coordination",
      "Endurance",
      "Esprit d'équipe",
      "Patrimoine"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes."
    },
    "sources": [
      {
        "label": "Ministère de la Culture — fiche patrimoine",
        "url": "https://www.culture.gouv.fr/Media/Thematiques/Patrimoine-culturel-immateriel/Files/Fiches-inventaire-du-PCI/Le-jeu-de-longue-paume"
      },
      {
        "label": "Site de la fédération",
        "url": "http://www.federation-longue-paume.fr"
      }
    ]
  },
  "balle-au-tambourin": {
    "federation": "Fédération française de jeu de balle au tambourin",
    "federationCodes": [
      "FFJBT"
    ],
    "accroche": "Le jeu traditionnel de l'Hérault : on frappe la balle avec un tambourin, dans une ambiance de fête de village.",
    "principe": "Deux équipes se renvoient une balle avec un tambourin (une sorte de raquette en peau tendue sur un cercle). Le terrain n'a pas de filet : une ligne centrale sépare les deux camps. L'équipe qui fait sortir la balle ou la laisse rebondir deux fois perd l'échange.",
    "jeu": [
      "En extérieur, les équipes comptent 5 joueurs ; en salle, 3 joueurs.",
      "Le comptage se fait comme au tennis : 15, 30, 45, jeu.",
      "Le « batteur » met la balle en jeu.",
      "La balle doit être frappée uniquement avec le tambourin ou l'avant-bras qui le tient.",
      "Le terrain extérieur est un long rectangle de terre battue ou de revêtement dur."
    ],
    "materiel": "Un tambourin et des balles, souvent fournis par le club.",
    "pourQui": "Jeunes et adultes, surtout en Occitanie (Hérault, Gard).",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur et salle",
      "age": "Jeunes et adultes"
    },
    "niveaux": [
      "Catégories par âge, de jeunes à seniors.",
      "Divisions nationales et régionales, féminines et masculines.",
      "Tambourin de plein air et tambourin en salle."
    ],
    "competitions": [
      "Championnats de Nationale 1 et Coupe de France.",
      "Coupes d'Europe et du monde, avec l'Italie notamment."
    ],
    "bienfaits": [
      "Réflexes",
      "Coordination",
      "Esprit d'équipe",
      "Patrimoine occitan"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes, matériel souvent prêté."
    },
    "sources": [
      {
        "label": "Ministère de la Culture — fiche patrimoine",
        "url": "https://www.culture.gouv.fr/Media/Thematiques/Patrimoine-culturel-immateriel/Files/Fiches-inventaire-du-PCI/Le-jeu-de-la-balle-au-tambourin"
      }
    ]
  },
  "ballon-au-poing": {
    "federation": "Fédération française de ballon au poing",
    "federationCodes": [
      "FFBAP"
    ],
    "accroche": "Un sport collectif picard, joué en frappant le ballon avec le poing, à découvrir autour d'Amiens.",
    "principe": "Deux équipes de 6 joueurs s'affrontent sur un terrain en extérieur. Le ballon, de la taille d'un ballon de handball, est frappé avec le poignet ou le poing. C'est un jeu de « gagne-terrain » : on marque des jeux en faisant reculer l'adversaire ou en le mettant en échec.",
    "jeu": [
      "Les équipes comptent 6 joueurs.",
      "On frappe le ballon avec le poing ou le poignet, jamais avec la main ouverte.",
      "Le jeu de chasses permet de gagner du terrain.",
      "Le comptage des points ressemble à celui du tennis ; la première équipe à remporter 7 jeux gagne.",
      "Le terrain est délimité par des lignes de rapport."
    ],
    "materiel": "Ballon homologué, fourni par le club. Bandage ou protection de poignet conseillés.",
    "pourQui": "Jeunes et adultes, surtout en Picardie (Somme). Une passerelle école-club existe dans certaines communes.",
    "repere": {
      "format": "En équipe",
      "lieu": "Extérieur et salle",
      "age": "Jeunes et adultes"
    },
    "niveaux": [
      "Catégories par âge.",
      "Championnat en extérieur et championnat en salle."
    ],
    "competitions": [
      "Championnat de France, Coupe de France et Poing d'Or, souvent à Amiens."
    ],
    "bienfaits": [
      "Coordination",
      "Puissance",
      "Esprit d'équipe",
      "Patrimoine picard"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation modestes."
    },
    "sources": [
      {
        "label": "Fédération française de ballon au poing",
        "url": "https://ballonaupoing.com"
      },
      {
        "label": "Ministère de la Culture — fiche patrimoine",
        "url": "https://www.culture.gouv.fr/Media/Thematiques/Patrimoine-culturel-immateriel/Files/Fiches-inventaire-du-PCI/le-ballon-au-poing-de-l-amienois2"
      }
    ]
  },
  "course-camarguaise": {
    "federation": "Fédération française de la course camarguaise",
    "federationCodes": [
      "FFCC"
    ],
    "accroche": "Un sport de tradition provençale, sans mise à mort : des raseteurs défient le taureau avec agilité et courage.",
    "principe": "Dans les arènes, les raseteurs, vêtus de blanc, doivent attraper avec un crochet des attributs (cocarde, glands, ficelles) fixés entre les cornes d'un taureau camarguais. Le taureau n'est jamais blessé : la vedette, c'est souvent lui.",
    "jeu": [
      "Chaque taureau reste quelques minutes en piste.",
      "Les raseteurs courent en arc de cercle pour passer devant le taureau et attraper les attributs.",
      "Les tourneurs les aident en orientant le taureau.",
      "Chaque attribut rapporte une prime au raseteur.",
      "Les meilleurs raseteurs concourent pour le Trophée des As."
    ],
    "materiel": "Tenue blanche et crochet, fournis selon les écoles.",
    "pourQui": "Les jeunes apprennent dans les écoles de raseteurs à partir de l'adolescence. Le public est nombreux à suivre les courses.",
    "repere": {
      "format": "Individuel",
      "lieu": "Arènes",
      "age": "Dès l'adolescence"
    },
    "niveaux": [
      "Écoles de raseteurs, puis courses de l'Avenir, puis courses des As pour les meilleurs."
    ],
    "competitions": [
      "Trophée de l'Avenir et Trophée des As.",
      "Cocarde d'or d'Arles et autres grandes courses."
    ],
    "bienfaits": [
      "Agilité",
      "Vitesse",
      "Courage",
      "Patrimoine provençal"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Formation en école taurine ; l'accès dépend des associations locales."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffcc.info"
      }
    ]
  },
  "course-landaise": {
    "federation": "Fédération française de la course landaise",
    "federationCodes": [
      "FFCL"
    ],
    "accroche": "Un sport de tradition gasconne : écarteurs et sauteurs défient des vaches avec élégance, sans aucune blessure pour l'animal.",
    "principe": "Dans les arènes des Landes et du Gers, des écarteurs esquivent la vache qui charge au dernier moment, par une rotation du corps, et des sauteurs la franchissent en réalisant une figure en l'air (saut de l'ange, saut périlleux). Des juges notent l'élégance et la difficulté de chaque figure.",
    "jeu": [
      "Les écarteurs esquivent la vache par un écart ou une feinte.",
      "Les sauteurs bondissent au-dessus de la vache.",
      "Une cuadrilla (équipe) entoure les acteurs et le cordier qui guide la vache.",
      "Les figures sont notées par un jury.",
      "La saison va du printemps à l'automne, au rythme des fêtes de village."
    ],
    "materiel": "Tenue traditionnelle (boléro brodé), fournie par la cuadrilla.",
    "pourQui": "Les jeunes découvrent la discipline à l'école et dans les écoles taurines à partir de l'adolescence.",
    "repere": {
      "format": "En cuadrilla",
      "lieu": "Arènes",
      "age": "Dès l'adolescence"
    },
    "niveaux": [
      "Écoles, courses formelles, concours.",
      "Écarteurs, sauteurs, cordiers."
    ],
    "competitions": [
      "Championnat de France des écarteurs et des sauteurs.",
      "Concours landais lors des grandes fêtes (Mont-de-Marsan, Dax, Nogaro)."
    ],
    "bienfaits": [
      "Agilité",
      "Courage",
      "Esprit d'équipe",
      "Patrimoine gascon"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Formation dans les écoles et clubs taurins de la région."
    },
    "sources": [
      {
        "label": "Ministère de la Culture — fiche patrimoine",
        "url": "https://www.culture.gouv.fr/Media/Medias-creation-rapide/La-course-landaise.pdf"
      }
    ]
  },
  "joute-et-sauvetage-nautique": {
    "federation": "Fédération française de joute et de sauvetage nautique",
    "federationCodes": [
      "FFJSN"
    ],
    "accroche": "Debout sur une plateforme, lance en main, faire tomber son adversaire à l'eau : un duel spectaculaire au cœur des fêtes d'été.",
    "principe": "Deux barques, propulsées par des rameurs, foncent l'une vers l'autre. Sur chacune, un jouteur se tient debout sur une plateforme, armé d'une lance et protégé par un pavois (bouclier). Au moment du croisement, chacun tente de faire tomber l'autre à l'eau.",
    "jeu": [
      "Six méthodes régionales : languedocienne, provençale, lyonnaise, givordine, parisienne et alsacienne.",
      "Le jouteur qui tombe à l'eau perd la passe.",
      "Des règles précises de posture interdisent certains gestes.",
      "Les tournois se jouent par élimination, souvent par catégorie de poids.",
      "Les barques sont menées par des rameurs et un barreur."
    ],
    "materiel": "Tenue blanche, lance et pavois fournis par la société de joute.",
    "pourQui": "Enfants (écoles de joute dès 6 ans en méthode parisienne, minimes de 11 à 13 ans en lyonnaise) et adultes, dans les sociétés de joute des villes de canal et de rivière (Sète, Lyon, Strasbourg…).",
    "repere": {
      "format": "En duel",
      "lieu": "Canaux et rivières",
      "age": "Dès 6 ans"
    },
    "niveaux": [
      "Catégories de poids et d'âge.",
      "Juniors, seniors, vétérans."
    ],
    "competitions": [
      "Tournois locaux, championnats de France par méthode.",
      "Grands tournois de la Saint-Louis à Sète."
    ],
    "bienfaits": [
      "Équilibre",
      "Force",
      "Courage",
      "Patrimoine"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Cotisation à la société de joute et licence."
    },
    "sources": [
      {
        "label": "Ministère de la Culture — joutes lyonnaise et givordine",
        "url": "https://www.culture.gouv.fr/Media/Thematiques/Patrimoine-culturel-immateriel/Files/Fiches-inventaire-du-PCI/Les-joutes-nautiques-methodes-givordine-et-lyonnaise"
      }
    ]
  },
  "handisport": {
    "federation": "Fédération française handisport",
    "federationCodes": [
      "FFH"
    ],
    "accroche": "Faire du sport avec un handicap physique ou sensoriel, en loisir comme au plus haut niveau : la fédération handisport propose des dizaines de disciplines.",
    "principe": "La Fédération française handisport s'adresse aux personnes ayant une déficience motrice, visuelle ou auditive. Les règles des sports sont adaptées pour que chacun puisse pratiquer : basket fauteuil, natation, athlétisme, cécifoot, boccia, torball… Les clubs accueillent aussi des pratiquants valides dans certaines disciplines.",
    "jeu": [
      "Les sportifs sont classés selon leur type et leur degré de handicap, pour des compétitions équitables.",
      "Certaines disciplines sont spécifiques : boccia, goalball, torball, cécifoot.",
      "D'autres sont adaptées : basket fauteuil, tennis fauteuil, para-natation, ski assis.",
      "Le matériel est adapté (fauteuils de sport, lames de course, guides pour les déficients visuels).",
      "Les pratiques loisir et découverte sont nombreuses."
    ],
    "materiel": "Selon la discipline : fauteuil de sport, prothèses, matériel adapté. Les clubs disposent souvent de matériel de prêt.",
    "pourQui": "Pour toute personne ayant un handicap moteur ou sensoriel, enfant ou adulte, débutant ou confirmé.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Selon la discipline",
      "age": "Tout âge"
    },
    "niveaux": [
      "Classification médico-sportive par discipline.",
      "Loisir, compétition régionale, nationale et internationale."
    ],
    "competitions": [
      "Championnats régionaux et de France dans chaque discipline.",
      "Championnats du monde et Jeux paralympiques."
    ],
    "bienfaits": [
      "Autonomie",
      "Confiance en soi",
      "Lien social",
      "Santé"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation ; le matériel spécifique peut être coûteux mais il est souvent prêté ou financé par des aides."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.handisport.org"
      }
    ]
  },
  "sport-adapte": {
    "federation": "Fédération française du sport adapté",
    "federationCodes": [
      "FFSA"
    ],
    "accroche": "Le sport pour les personnes en situation de handicap mental ou psychique, avec des pratiques pensées pour chacun.",
    "principe": "La Fédération française du sport adapté propose des activités sportives aux personnes ayant un handicap mental, des troubles psychiques ou des troubles du spectre autistique. Les règles et les encadrements sont adaptés aux capacités de chacun, du loisir au haut niveau.",
    "jeu": [
      "Plusieurs divisions de pratique selon les capacités (classes AB, BC, CD).",
      "Sports collectifs, natation, athlétisme, judo, tennis de table, équitation, sports de nature…",
      "Activités motrices pour les personnes les plus dépendantes.",
      "Encadrement formé au sport adapté.",
      "Souvent en lien avec les établissements spécialisés (IME, ESAT, foyers)."
    ],
    "materiel": "Selon la discipline, comme pour le sport ordinaire.",
    "pourQui": "Pour les enfants et adultes en situation de handicap mental ou psychique, quel que soit le niveau.",
    "repere": {
      "format": "Individuel ou en équipe",
      "lieu": "Selon la discipline",
      "age": "Tout âge"
    },
    "niveaux": [
      "Classes de compétition AB, BC, CD selon l'autonomie.",
      "Loisir, compétition, haut niveau (sport adapté para)."
    ],
    "competitions": [
      "Championnats régionaux et de France sport adapté.",
      "Compétitions internationales (Virtus) et Jeux paralympiques pour certaines disciplines."
    ],
    "bienfaits": [
      "Autonomie",
      "Lien social",
      "Confiance",
      "Santé"
    ],
    "budget": {
      "niveau": 1,
      "texte": "Licence et cotisation, souvent prises en charge en partie par les établissements."
    },
    "sources": [
      {
        "label": "Site de la fédération",
        "url": "https://www.ffsa.asso.fr"
      }
    ]
  }
};

export const DISCIPLINE_GUIDES: Record<string, DisciplineGuide> = {
  "rugby--competition-a-xv": {
    "accroche": "Le rugby dans sa forme la plus complète : 15 joueurs, des postes très différents et un championnat chaque week-end.",
    "principe": "C'est le rugby classique, celui du Tournoi des Six Nations et du Top 14. Avants et arrières se partagent les rôles : les uns gagnent le ballon dans les mêlées et les touches, les autres le font vivre en mouvement. Chaque club engage ses équipes dans un championnat adapté à son niveau.",
    "pratique": [
      "Les matchs se jouent en 2 × 40 minutes chez les adultes.",
      "Mêlées, touches, rucks et mauls rythment la conquête du ballon.",
      "Chaque poste a son rôle : pilier, talonneur, deuxième ligne, troisième ligne, demis, centres, ailiers, arrière."
    ],
    "pourQui": "Pour les jeunes qui sortent de l'école de rugby et les adultes qui veulent le vrai défi du rugby à XV. Toutes les morphologies trouvent un poste.",
    "materiel": "Crampons, protège-dents obligatoire, casque souple facultatif. Le club fournit les maillots de match.",
    "format": "15 contre 15",
    "lieu": "Extérieur",
    "age": "Dès l'école de rugby",
    "tags": [
      "Compétition"
    ]
  },
  "rugby--competition-a-x": {
    "accroche": "Un rugby plus aéré et plus rapide, à 10 joueurs : plus de course, plus de ballons touchés.",
    "principe": "Le rugby à X garde les règles du XV mais avec 10 joueurs et des mêlées simplifiées. Il y a donc plus d'espace sur le terrain et le jeu de mouvement prend le dessus. Il est souvent pratiqué en tournois, notamment l'été.",
    "pratique": [
      "Les mêlées sont réduites à quelques joueurs, sans poussée forte.",
      "Les matchs sont plus courts qu'à XV.",
      "Le jeu au large et les courses avec ballon sont très valorisés."
    ],
    "pourQui": "Pour les joueurs qui aiment courir et les clubs qui n'ont pas assez d'effectif pour une équipe à XV.",
    "materiel": "Crampons et protège-dents. Tenue fournie par le club.",
    "format": "10 contre 10",
    "lieu": "Extérieur",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Plein air"
    ]
  },
  "rugby--competition-a-7": {
    "accroche": "La version olympique du rugby : 7 joueurs sur un grand terrain, des matchs éclairs et beaucoup de vitesse.",
    "principe": "Le rugby à 7 se joue sur un terrain de taille normale avec seulement 7 joueurs par équipe. Les espaces sont immenses : la vitesse, les crochets et le jeu de passes font la différence. Les matchs, très courts, s'enchaînent en tournois sur une ou deux journées.",
    "pratique": [
      "Les matchs durent 2 × 7 minutes.",
      "Mêlées à 3 joueurs et touches simplifiées.",
      "Les équipes jouent plusieurs matchs dans la même journée de tournoi."
    ],
    "pourQui": "Pour les joueurs rapides et endurants. C'est aussi une belle porte d'entrée pour les filles, très présentes à 7.",
    "materiel": "Crampons, protège-dents. Tenue fournie par le club.",
    "format": "7 contre 7",
    "lieu": "Extérieur",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "rugby--rugby-a-5-loisir-bien-etre": {
    "accroche": "Du rugby sans plaquage ni mêlée, mixte et convivial : la meilleure façon de découvrir ou de reprendre.",
    "principe": "Au rugby à 5, on arrête le porteur du ballon en le touchant à deux mains, sans le plaquer. Il n'y a ni mêlée ni touche : le jeu est fluide, sans chocs, et accessible quel que soit ton niveau physique. Hommes et femmes jouent ensemble.",
    "pratique": [
      "Un toucher à deux mains arrête l'action, puis le jeu repart.",
      "Les passes se font toujours vers l'arrière, comme au rugby classique.",
      "Les séances se terminent souvent par des petits matchs et un moment convivial."
    ],
    "pourQui": "Pour les adultes de tout âge, débutants complets comme anciens joueurs. Parfait pour les équipes mixtes et les entreprises.",
    "materiel": "Des baskets ou des crampons moulés, une tenue de sport. Pas de protections nécessaires.",
    "format": "5 contre 5, mixte",
    "lieu": "Extérieur ou salle",
    "age": "Adultes, tout âge",
    "tags": [
      "Loisir",
      "Santé",
      "Découverte"
    ]
  },
  "rugby--rugby-loisir-avec-plaquage": {
    "accroche": "Le vrai rugby avec contact, mais sans la pression du classement : pour le plaisir du jeu et de la troisième mi-temps.",
    "principe": "Ces équipes, souvent appelées « vieux crampons » ou « rugby loisir », jouent avec plaquages et mêlées, mais en matchs amicaux ou en rencontres entre clubs. L'esprit est convivial, l'engagement réel mais maîtrisé.",
    "pratique": [
      "Matchs amicaux et tournois entre équipes loisirs.",
      "Règles adaptées selon les rencontres (mêlées simulées, temps de jeu réduit).",
      "Entraînements souvent en soirée, une à deux fois par semaine."
    ],
    "pourQui": "Pour les adultes qui ont déjà joué ou qui veulent goûter au contact, sans viser la compétition.",
    "materiel": "Crampons, protège-dents. Le club fournit les maillots.",
    "format": "En équipe",
    "lieu": "Extérieur",
    "age": "Adultes",
    "tags": [
      "Loisir"
    ]
  },
  "rugby--rugby-sante": {
    "accroche": "Bouger pour sa santé avec un ballon ovale : une pratique douce, encadrée par des éducateurs formés.",
    "principe": "Le rugby santé reprend les gestes du rugby (passes, courses, jeu collectif) sans contact ni chute. Les séances sont adaptées aux capacités de chacun et visent la forme, le souffle et le lien social.",
    "pratique": [
      "Échauffement, exercices de passes et de déplacements, puis jeu sans contact.",
      "L'intensité s'adapte à chaque participant.",
      "Des clubs labellisés proposent ce programme avec des éducateurs formés."
    ],
    "pourQui": "Pour les adultes qui reprennent une activité, les seniors et les personnes ayant une maladie chronique, avec l'accord de leur médecin.",
    "materiel": "Une tenue de sport et des baskets.",
    "format": "En groupe",
    "lieu": "Extérieur ou salle",
    "age": "Adultes et seniors",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "rugby--beach": {
    "accroche": "Le rugby les pieds dans le sable, en équipes réduites et en tournois festifs l'été.",
    "principe": "Le beach rugby se joue sur la plage, sur un petit terrain, avec quelques joueurs par équipe. Le sable rend les appuis difficiles et les chutes plus douces. Les tournois ont lieu surtout l'été, dans une ambiance festive.",
    "pratique": [
      "Équipes de 4 à 5 joueurs sur le terrain selon les formats.",
      "Versions avec contact ou en « touché ».",
      "Matchs très courts, enchaînés en tournoi."
    ],
    "pourQui": "Pour tous ceux qui aiment le rugby et le soleil, en loisir ou en compétition.",
    "materiel": "Pieds nus le plus souvent, maillot et short.",
    "format": "Petites équipes",
    "lieu": "Sable",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Compétition",
      "Plein air"
    ]
  },
  "rugby--rugby-entreprises": {
    "accroche": "Jouer au rugby entre collègues : cohésion d'équipe garantie, sur le terrain comme au bureau.",
    "principe": "Des entreprises montent leur équipe, souvent en rugby à 5 sans plaquage, et participent à des tournois inter-entreprises. C'est une façon simple de faire du sport ensemble et de créer du lien.",
    "pratique": [
      "Format le plus courant : rugby à 5 sans plaquage.",
      "Entraînements en semaine, pause déjeuner ou soirée.",
      "Tournois inter-entreprises organisés par les clubs et comités."
    ],
    "pourQui": "Pour les salariés de tous niveaux, hommes et femmes, débutants bienvenus.",
    "materiel": "Tenue de sport, baskets ou crampons moulés.",
    "format": "Entre collègues",
    "lieu": "Extérieur",
    "age": "Adultes",
    "tags": [
      "Loisir"
    ]
  },
  "handball--handball-a-7": {
    "accroche": "Le handball classique : 6 joueurs de champ et un gardien, en salle, en championnat.",
    "principe": "C'est la forme officielle du handball, celle des Jeux olympiques. Deux équipes de 7 s'affrontent sur un terrain de 40 m de long. Le jeu est rapide et alterne attaques placées, contre-attaques et défense en bloc.",
    "pratique": [
      "Matchs en 2 × 30 minutes chez les seniors, plus courts chez les jeunes.",
      "3 pas et 3 secondes maximum avec le ballon en main.",
      "Personne n'entre dans la zone des 6 mètres, sauf le gardien."
    ],
    "pourQui": "Pour les jeunes à partir de l'école de hand et pour les adultes, en compétition ou en loisir.",
    "materiel": "Chaussures de salle, short, tee-shirt. Le club fournit ballons et maillots.",
    "format": "7 contre 7",
    "lieu": "Salle",
    "age": "Dès 7-8 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "handball--hand-a-4": {
    "accroche": "Un handball sur petit terrain, à 4 contre 4 : on touche plus le ballon et on marque plus.",
    "principe": "Le hand à 4 réduit le nombre de joueurs et la taille du terrain. Chacun participe davantage, défend et attaque. C'est un format idéal pour apprendre, pour les petits effectifs ou pour jouer en extérieur.",
    "pratique": [
      "3 joueurs de champ et 1 gardien de chaque côté.",
      "Terrain et buts plus petits.",
      "Matchs courts, souvent en tournois."
    ],
    "pourQui": "Pour les enfants qui découvrent le handball, et pour les adultes qui veulent jouer en loisir.",
    "materiel": "Chaussures de sport, tenue souple.",
    "format": "4 contre 4",
    "lieu": "Salle ou extérieur",
    "age": "Enfants et adultes",
    "tags": [
      "Découverte",
      "Loisir"
    ]
  },
  "handball--handfit": {
    "accroche": "Le handball version santé : renforcement, cardio et ballon, sans compétition.",
    "principe": "Le HandFit est une pratique « sport-santé » de la Fédération française de handball. Les séances mêlent exercices physiques, travail de l'équilibre et jeux avec le ballon, adaptés à la forme de chacun. Pas de match officiel : l'objectif est de se sentir bien.",
    "pratique": [
      "Séances encadrées par des animateurs formés au HandFit.",
      "Exercices de mobilité, de renforcement et de coordination.",
      "Petits jeux avec ballon, sans contact."
    ],
    "pourQui": "Pour les adultes qui veulent reprendre une activité, les seniors et les personnes atteintes de maladies chroniques, avec l'accord de leur médecin.",
    "materiel": "Une tenue de sport et des baskets.",
    "format": "En groupe",
    "lieu": "Salle",
    "age": "Adultes et seniors",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "handball--beach-handball": {
    "accroche": "Le handball sur sable, spectaculaire, où les buts acrobatiques valent double.",
    "principe": "Le beach handball se joue pieds nus sur le sable, à 3 joueurs de champ et un gardien. Les buts marqués en « kung-fu » (une passe attrapée en l'air) ou en tournant sur soi rapportent 2 points. Les matchs se jouent en deux manches courtes.",
    "pratique": [
      "Chaque manche se gagne indépendamment ; en cas d'égalité, on joue une séance de tirs.",
      "Les buts spectaculaires et ceux du gardien valent 2 points.",
      "Le jeu est très rapide et peu physique au contact."
    ],
    "pourQui": "Pour les handballeurs qui veulent jouer l'été, et pour les curieux qui aiment les sports de plage.",
    "materiel": "Pieds nus, tenue légère. Ballon spécifique fourni par le club.",
    "format": "4 contre 4",
    "lieu": "Sable",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Loisir",
      "Plein air"
    ]
  },
  "plongee-et-sports-sous-marins--plongee-sous-marine": {
    "accroche": "Respirer sous l'eau et découvrir un monde silencieux : la plongée avec bouteille, en toute sécurité.",
    "principe": "Équipé d'une bouteille d'air et d'un détendeur, tu évolues sous l'eau en palanquée, c'est-à-dire en petit groupe. La formation commence en piscine, puis se poursuit en mer, en lac ou en carrière. Chaque niveau élargit ce que tu as le droit de faire.",
    "pratique": [
      "Baptême avec un moniteur, puis niveau 1 pour plonger encadré jusqu'à 20 m.",
      "Les remontées sont lentes et contrôlées pour protéger ton corps.",
      "Signes de communication sous l'eau et vérifications avant chaque plongée."
    ],
    "pourQui": "Pour les enfants dès 8 ans (formations jeunes) et pour les adultes. Un certificat médical spécifique est demandé.",
    "materiel": "Masque, palmes et tuba personnels. Combinaison, gilet, détendeur et bouteille sont prêtés pendant la formation.",
    "format": "En binôme",
    "lieu": "Piscine puis mer",
    "age": "Dès 8 ans",
    "tags": [
      "Découverte",
      "Formation",
      "Plein air"
    ]
  },
  "plongee-et-sports-sous-marins--rando-sub": {
    "accroche": "Observer les fonds marins en surface, avec masque, palmes et tuba : la porte d'entrée vers la mer.",
    "principe": "La randonnée subaquatique se pratique en surface, en suivant un parcours le long de la côte. On observe poissons, algues et rochers, et on fait de petites descentes en apnée si l'on veut. C'est une activité accessible et très riche en découvertes.",
    "pratique": [
      "Parcours encadrés, souvent balisés par des bouées.",
      "Les guides expliquent la faune et la flore rencontrées.",
      "Pas besoin de savoir plonger : on reste en surface."
    ],
    "pourQui": "Pour toute la famille, dès que l'on sait nager.",
    "materiel": "Masque, tuba, palmes, et une combinaison selon la température de l'eau.",
    "format": "En groupe",
    "lieu": "Bord de mer",
    "age": "Enfants et adultes",
    "tags": [
      "Découverte",
      "Loisir",
      "Plein air"
    ]
  },
  "plongee-et-sports-sous-marins--apnee": {
    "accroche": "Plonger sur une seule inspiration : un travail de relaxation, de souffle et de maîtrise de soi.",
    "principe": "L'apnée consiste à retenir sa respiration sous l'eau, en piscine ou en mer. On apprend à se relâcher, à économiser son oxygène et à progresser par étapes. On ne pratique jamais seul : un binôme surveille toujours l'apnéiste.",
    "pratique": [
      "Apnée statique : rester immobile le plus longtemps possible.",
      "Apnée dynamique : parcourir la plus grande distance sous l'eau.",
      "Apnée en profondeur, en mer, pour les plus expérimentés."
    ],
    "pourQui": "Pour les adolescents et les adultes à l'aise dans l'eau. Un certificat médical est demandé.",
    "materiel": "Masque à faible volume, tuba, palmes longues, combinaison et lest pour la mer.",
    "format": "En binôme",
    "lieu": "Piscine et mer",
    "age": "Ados et adultes",
    "tags": [
      "Formation",
      "Compétition"
    ]
  },
  "plongee-et-sports-sous-marins--plongee-nitrox": {
    "accroche": "Plonger avec un air enrichi en oxygène pour rester plus longtemps sous l'eau.",
    "principe": "Le nitrox est un mélange qui contient plus d'oxygène que l'air. Il permet de prolonger le temps de plongée à certaines profondeurs et de réduire la fatigue. Une formation spécifique apprend à l'utiliser en toute sécurité.",
    "pratique": [
      "Formation théorique sur les mélanges et leurs limites.",
      "Analyse du mélange avant chaque plongée.",
      "Profondeur maximale à respecter selon le mélange."
    ],
    "pourQui": "Pour les plongeurs déjà titulaires d'un niveau de plongée.",
    "materiel": "Le matériel de plongée habituel, avec des bouteilles identifiées pour le nitrox.",
    "format": "En binôme",
    "lieu": "Mer",
    "age": "Plongeurs certifiés",
    "tags": [
      "Formation",
      "Technique"
    ]
  },
  "plongee-et-sports-sous-marins--environnement-et-bio": {
    "accroche": "Apprendre à reconnaître ce que tu vois sous l'eau, et à le protéger.",
    "principe": "Les clubs proposent des formations en biologie subaquatique : identifier les poissons, les invertébrés, les algues, comprendre les écosystèmes. On peut aussi participer à des inventaires de biodiversité.",
    "pratique": [
      "Sorties d'observation en plongée ou en randonnée palmée.",
      "Soirées de formation avec des guides et des fiches d'identification.",
      "Participation à des programmes de sciences participatives."
    ],
    "pourQui": "Pour tous les curieux, plongeurs ou non.",
    "materiel": "Le matériel de plongée ou de randonnée palmée, un carnet ou une ardoise sous-marine.",
    "format": "En groupe",
    "lieu": "Mer et lacs",
    "age": "Enfants et adultes",
    "tags": [
      "Découverte",
      "Formation"
    ]
  },
  "plongee-et-sports-sous-marins--nage-avec-palmes": {
    "accroche": "La discipline la plus rapide dans l'eau : on nage avec une monopalme ou deux palmes.",
    "principe": "La nage avec palmes est une course de vitesse, en piscine ou en eau libre. Avec une monopalme, le nageur ondule comme un dauphin, souvent avec un tuba frontal. C'est un sport très physique et très rapide.",
    "pratique": [
      "Épreuves en surface, en immersion et en bi-palmes.",
      "Distances du sprint au fond, en bassin ou en eau libre.",
      "Relais par équipe."
    ],
    "pourQui": "Pour les nageurs à l'aise qui aiment la vitesse, dès 8 ans.",
    "materiel": "Monopalme ou bi-palmes, tuba frontal, masque ou lunettes, maillot.",
    "format": "Individuel et relais",
    "lieu": "Piscine et eau libre",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "plongee-et-sports-sous-marins--photo-et-video": {
    "accroche": "Rapporter des images du monde sous-marin : cadrage, lumière et patience.",
    "principe": "La photo et la vidéo sous-marines demandent de maîtriser à la fois la plongée et l'image. Les clubs forment à la prise de vue, à l'éclairage et au respect du milieu, et organisent des concours.",
    "pratique": [
      "Formations à l'appareil en caisson et aux éclairages.",
      "Sorties dédiées à la prise de vue.",
      "Concours photo et vidéo."
    ],
    "pourQui": "Pour les plongeurs qui maîtrisent bien leur flottabilité.",
    "materiel": "Un appareil photo ou une caméra dans un caisson étanche, des phares.",
    "format": "Individuel",
    "lieu": "Mer",
    "age": "Plongeurs",
    "tags": [
      "Loisir",
      "Technique"
    ]
  },
  "plongee-et-sports-sous-marins--plongee-recycleur": {
    "accroche": "Plonger sans bulles, avec un appareil qui recycle l'air que tu expires.",
    "principe": "Le recycleur réutilise le gaz expiré en éliminant le gaz carbonique et en ajoutant de l'oxygène. Il permet des plongées longues et silencieuses, appréciées des photographes. C'est une pratique très technique qui demande une formation sérieuse.",
    "pratique": [
      "Formation spécifique à l'appareil choisi.",
      "Vérifications minutieuses avant chaque plongée.",
      "Gestion des pannes et procédures de secours."
    ],
    "pourQui": "Pour les plongeurs expérimentés et rigoureux.",
    "materiel": "Un recycleur et son équipement de secours.",
    "format": "En binôme",
    "lieu": "Mer",
    "age": "Plongeurs confirmés",
    "tags": [
      "Formation",
      "Technique"
    ]
  },
  "plongee-et-sports-sous-marins--nage-en-eau-vive": {
    "accroche": "Descendre une rivière en palmes, allongé sur un flotteur : sensations garanties.",
    "principe": "La nage en eau vive, aussi appelée hydrospeed, consiste à descendre une rivière en palmes en s'appuyant sur un flotteur. On apprend à lire le courant, à éviter les obstacles et à se placer dans les rapides.",
    "pratique": [
      "Descentes encadrées sur des rivières adaptées au niveau.",
      "Lecture du courant et des obstacles.",
      "Compétitions de descente et de slalom."
    ],
    "pourQui": "Pour les bons nageurs à l'aise dans l'eau vive.",
    "materiel": "Combinaison épaisse, casque, gilet, palmes et flotteur.",
    "format": "En groupe",
    "lieu": "Rivière",
    "age": "Ados et adultes",
    "tags": [
      "Plein air",
      "Loisir",
      "Compétition"
    ]
  },
  "plongee-et-sports-sous-marins--plongee-trimix": {
    "accroche": "Explorer en profondeur grâce à un mélange de gaz contenant de l'hélium.",
    "principe": "Le trimix mélange oxygène, azote et hélium pour plonger plus profond qu'avec l'air. Il réduit certains risques liés à la profondeur. C'est une pratique réservée aux plongeurs très expérimentés.",
    "pratique": [
      "Formation avancée avec un moniteur spécialisé.",
      "Planification précise de la plongée et des paliers.",
      "Plusieurs bouteilles et mélanges de gaz."
    ],
    "pourQui": "Pour les plongeurs de haut niveau, après un long parcours de formation.",
    "materiel": "Équipement technique complet, plusieurs bouteilles.",
    "format": "En binôme",
    "lieu": "Mer",
    "age": "Plongeurs très expérimentés",
    "tags": [
      "Formation",
      "Technique"
    ]
  },
  "plongee-et-sports-sous-marins--peche-sous-marine": {
    "accroche": "Pêcher en apnée, au fusil, en connaissant et en respectant la mer.",
    "principe": "La pêche sous-marine se pratique en apnée, jamais en bouteille. Le pêcheur doit connaître les espèces, les tailles minimales et les zones autorisées. Les clubs forment à la sécurité et à une pêche responsable.",
    "pratique": [
      "Pêche uniquement en apnée, avec une bouée de signalisation.",
      "Respect des tailles minimales et des espèces protégées.",
      "Compétitions par équipe ou en individuel."
    ],
    "pourQui": "À partir de 16 ans, pour les bons apnéistes.",
    "materiel": "Combinaison, masque, tuba, longues palmes, lest, bouée et fusil.",
    "format": "Individuel",
    "lieu": "Mer",
    "age": "Dès 16 ans",
    "tags": [
      "Plein air",
      "Compétition"
    ]
  },
  "plongee-et-sports-sous-marins--orientation": {
    "accroche": "Une course d'orientation sous l'eau, à la boussole.",
    "principe": "L'orientation subaquatique consiste à suivre un parcours sous l'eau en se repérant à la boussole et au compteur de distance. Il faut être précis et rapide pour atteindre les balises.",
    "pratique": [
      "Parcours balisés à suivre le plus vite possible.",
      "Navigation au compas et à la distance.",
      "Épreuves individuelles et par équipe."
    ],
    "pourQui": "Pour les plongeurs qui aiment la précision et le défi.",
    "materiel": "Équipement de plongée et une planche de navigation avec compas.",
    "format": "Individuel ou en équipe",
    "lieu": "Lac ou mer",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Technique"
    ]
  },
  "plongee-et-sports-sous-marins--tir-sur-cible": {
    "accroche": "Viser une cible au fusil sous-marin, en apnée : un sport de précision dans l'eau.",
    "principe": "Le tir sur cible subaquatique se pratique en piscine, en apnée. Le tireur doit atteindre une cible avec un fusil sous-marin, le plus précisément et le plus vite possible.",
    "pratique": [
      "Épreuves de précision et de vitesse.",
      "Tir en apnée, à distance fixe.",
      "Compétitions régionales et nationales."
    ],
    "pourQui": "Pour les apnéistes qui aiment la précision.",
    "materiel": "Masque, tuba, palmes, fusil de compétition (souvent prêté).",
    "format": "Individuel",
    "lieu": "Piscine",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "plongee-et-sports-sous-marins--hockey": {
    "accroche": "Le hockey subaquatique : un sport collectif qui se joue au fond de la piscine, en apnée.",
    "principe": "Deux équipes poussent un palet lesté au fond du bassin avec une petite crosse, pour le mettre dans le but adverse. Les joueurs se relaient en apnée entre la surface et le fond. C'est intense, tactique et très collectif.",
    "pratique": [
      "6 joueurs dans l'eau par équipe, avec des remplaçants.",
      "Le palet reste au fond ; on le pousse en apnée.",
      "Les rotations entre la surface et le fond sont essentielles."
    ],
    "pourQui": "Pour les bons nageurs, jeunes et adultes.",
    "materiel": "Masque, tuba, palmes, bonnet de protection, gant et crosse.",
    "format": "6 contre 6",
    "lieu": "Piscine",
    "age": "Dès 10 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "plongee-et-sports-sous-marins--plongee-souterraine": {
    "accroche": "Explorer les galeries noyées des grottes : une aventure réservée aux plongeurs expérimentés.",
    "principe": "La plongée souterraine permet d'explorer les réseaux de grottes inondées. On progresse en suivant un fil d'Ariane, avec du matériel doublé pour la sécurité. C'est une pratique d'exploration très encadrée.",
    "pratique": [
      "Progression le long d'un fil guide.",
      "Matériel en double pour chaque fonction vitale.",
      "Formation progressive en milieu souterrain."
    ],
    "pourQui": "Pour les plongeurs confirmés, très à l'aise et rigoureux.",
    "materiel": "Équipement technique complet, éclairages multiples, dévidoir.",
    "format": "En équipe",
    "lieu": "Grottes noyées",
    "age": "Plongeurs confirmés",
    "tags": [
      "Technique",
      "Formation"
    ]
  },
  "plongee-et-sports-sous-marins--archeologie": {
    "accroche": "Participer à la découverte d'épaves et de vestiges sous l'eau.",
    "principe": "L'archéologie subaquatique forme les plongeurs à observer, mesurer et documenter les vestiges. Les clubs participent à des chantiers encadrés par des archéologues, dans le respect de la réglementation.",
    "pratique": [
      "Formations aux techniques de relevé et de photographie.",
      "Participation à des chantiers encadrés.",
      "Respect strict de la protection du patrimoine."
    ],
    "pourQui": "Pour les plongeurs passionnés d'histoire.",
    "materiel": "Le matériel de plongée et des outils de mesure.",
    "format": "En équipe",
    "lieu": "Mer",
    "age": "Plongeurs",
    "tags": [
      "Découverte",
      "Formation"
    ]
  },
  "plongee-et-sports-sous-marins--sirenes-tritons": {
    "accroche": "Nager avec une queue de sirène : de la grâce, de l'imaginaire et beaucoup de gainage.",
    "principe": "La nage en sirène se pratique avec une monopalme recouverte d'une queue en tissu. On apprend l'ondulation, l'apnée courte et des figures dans l'eau. C'est ludique, artistique et très physique.",
    "pratique": [
      "Apprentissage de l'ondulation, comme un dauphin.",
      "Petites apnées et figures sous l'eau.",
      "Chorégraphies et spectacles."
    ],
    "pourQui": "Pour les enfants et les adultes qui savent bien nager.",
    "materiel": "Une monopalme et une queue de sirène (souvent prêtées), un maillot.",
    "format": "Individuel ou en groupe",
    "lieu": "Piscine",
    "age": "Enfants et adultes",
    "tags": [
      "Loisir",
      "Découverte"
    ]
  },
  "sauvetage-et-secourisme--secourisme-operationnel": {
    "accroche": "Apprendre les gestes qui sauvent, puis tenir des postes de secours lors d'événements.",
    "principe": "Le secourisme opérationnel forme des bénévoles aux premiers secours, puis à intervenir lors de manifestations sportives, culturelles ou festives. On progresse du PSC1 aux formations d'équipier secouriste.",
    "pratique": [
      "Formation PSC1 (prévention et secours civiques).",
      "Formations d'équipier secouriste (PSE1, PSE2).",
      "Participation aux dispositifs prévisionnels de secours."
    ],
    "pourQui": "Pour les adolescents et les adultes qui veulent être utiles aux autres.",
    "materiel": "Une tenue adaptée ; le matériel de secours est fourni par l'association.",
    "format": "En équipe",
    "lieu": "Postes de secours",
    "age": "Ados et adultes",
    "tags": [
      "Formation"
    ]
  },
  "sauvetage-et-secourisme--sauvetage-sportif": {
    "accroche": "Nager, courir et remorquer comme un sauveteur : un sport complet et utile.",
    "principe": "Le sauvetage sportif reprend les gestes des sauveteurs en compétition. En piscine, on nage avec obstacles et on remorque un mannequin. Sur la plage, on court, on nage en mer et on utilise la planche de sauvetage.",
    "pratique": [
      "Épreuves en piscine : obstacles, remorquage de mannequin, palmes.",
      "Épreuves côtières : course, nage, planche, beach flags.",
      "Relais par équipe."
    ],
    "pourQui": "Pour les nageurs à partir de 8 ans environ, filles et garçons.",
    "materiel": "Maillot, bonnet, lunettes, palmes. Mannequins et planches fournis.",
    "format": "Individuel et relais",
    "lieu": "Piscine et plage",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Formation"
    ]
  },
  "judo-jujitsu--judo": {
    "accroche": "Projeter, contrôler au sol, respecter son partenaire : le judo, sport éducatif par excellence.",
    "principe": "Le judo consiste à déséquilibrer son adversaire pour le projeter sur le dos, ou à le maîtriser au sol. On utilise la force de l'autre plutôt que la sienne. Le code moral (politesse, courage, respect, maîtrise de soi) fait partie de chaque cours.",
    "pratique": [
      "Apprendre d'abord à chuter sans se faire mal (ukemi).",
      "Projections (nage-waza) et techniques au sol (ne-waza).",
      "Combats d'entraînement (randori) et passages de ceintures."
    ],
    "pourQui": "Dès 4 ans en éveil judo, puis à tout âge. Filles et garçons pratiquent ensemble chez les plus jeunes.",
    "materiel": "Un judogi et une ceinture. Pieds nus sur le tatami.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Dès 4 ans",
    "tags": [
      "Compétition",
      "Loisir",
      "Enfants"
    ]
  },
  "judo-jujitsu--taiso": {
    "accroche": "La préparation physique du judo, sans combat ni chute : idéal pour se remettre en forme.",
    "principe": "Le taïso reprend les exercices d'échauffement et de renforcement du judo : gainage, souplesse, cardio, coordination. Il n'y a ni projection ni combat. Chacun travaille à son rythme, en musique ou en petits ateliers.",
    "pratique": [
      "Séances de renforcement musculaire et d'étirements.",
      "Exercices en duo pour la coordination.",
      "Aucun contact, aucune chute imposée."
    ],
    "pourQui": "Pour les adultes et seniors qui veulent bouger sans faire de compétition.",
    "materiel": "Une tenue souple ; certains clubs pratiquent en judogi.",
    "format": "En groupe",
    "lieu": "Dojo",
    "age": "Adultes et seniors",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "judo-jujitsu--jujitsu": {
    "accroche": "L'art de se défendre en combinant coups, projections et contrôles au sol.",
    "principe": "Le jujitsu mélange frappes, projections, clés et immobilisations. Il se pratique en combat (fighting system), en démonstration codifiée à deux (duo system) ou sous forme de self-défense.",
    "pratique": [
      "Fighting : combat en trois phases (coups, saisies, sol).",
      "Duo : enchaînements de défense notés par des juges.",
      "Travail de self-défense face à différentes attaques."
    ],
    "pourQui": "Pour les adolescents et adultes, judokas ou débutants.",
    "materiel": "Judogi, ceinture, et protections (gants, protège-tibias) pour le combat.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Self-défense"
    ]
  },
  "judo-jujitsu--kendo": {
    "accroche": "L'escrime japonaise : sabre de bambou, armure, cris et précision.",
    "principe": "Le kendo oppose deux combattants armés d'un shinai, un sabre en bambou. Protégés par une armure (bogu), ils cherchent à toucher des zones précises : tête, poignets, flanc ou gorge. Chaque frappe valable doit être accompagnée d'un cri et d'une posture juste.",
    "pratique": [
      "Un point se marque en frappant une cible autorisée avec engagement.",
      "L'étiquette et le salut encadrent chaque échange.",
      "Les débutants s'entraînent plusieurs mois sans armure."
    ],
    "pourQui": "Dès 8 ans environ, et très pratiqué par les adultes de tout âge.",
    "materiel": "Keikogi, hakama, shinai, puis l'armure (bogu) au fil de la progression.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Technique"
    ]
  },
  "judo-jujitsu--self-defense": {
    "accroche": "Apprendre des gestes simples et efficaces pour se protéger.",
    "principe": "La self-défense enseigne à réagir face à une agression : se dégager d'une saisie, éviter un coup, s'échapper. Les cours insistent aussi sur la prévention et la gestion du stress.",
    "pratique": [
      "Dégagements de saisies (poignets, vêtements, étranglements).",
      "Esquives et ripostes simples.",
      "Mises en situation encadrées."
    ],
    "pourQui": "Pour les adolescents et adultes, sans prérequis sportif.",
    "materiel": "Une tenue souple ou un judogi.",
    "format": "En binôme",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Self-défense"
    ]
  },
  "judo-jujitsu--kata": {
    "accroche": "Des enchaînements codifiés réalisés à deux, notés sur leur précision et leur beauté.",
    "principe": "Le kata est une forme d'étude du judo : un partenaire attaque, l'autre exécute une technique, selon un ordre précis. On recherche la justesse, le rythme et l'harmonie entre les deux pratiquants.",
    "pratique": [
      "Plusieurs katas existent, du plus simple au plus avancé.",
      "Les compétitions sont notées par des juges.",
      "Le kata est aussi exigé pour certains grades."
    ],
    "pourQui": "Pour les judokas qui aiment la technique, à tout âge.",
    "materiel": "Un judogi et une ceinture.",
    "format": "À deux",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Technique"
    ]
  },
  "judo-jujitsu--iaido": {
    "accroche": "L'art de dégainer et de trancher au sabre, en gestes lents et précis.",
    "principe": "Le iaido se pratique seul, face à un adversaire imaginaire. On enchaîne des formes codifiées : dégainer, couper, essuyer la lame et rengainer. C'est un travail de concentration et de précision.",
    "pratique": [
      "Formes codifiées (kata) réalisées seul.",
      "Travail de la posture, de la respiration et de la précision.",
      "Passages de grades devant un jury."
    ],
    "pourQui": "Pour les adolescents et adultes qui recherchent un art martial calme et exigeant.",
    "materiel": "Keikogi, hakama, ceinture et sabre d'entraînement (iaito).",
    "format": "Individuel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Technique"
    ]
  },
  "judo-jujitsu--ne-waza": {
    "accroche": "Le combat entièrement au sol : immobilisations, clés et étranglements.",
    "principe": "Le ne-waza est la partie au sol du judo et du jujitsu, pratiquée comme une discipline à part entière. Les combats commencent à genoux ou debout et se gagnent par abandon ou aux points.",
    "pratique": [
      "Immobilisations, clés de bras et étranglements.",
      "Combats à partir de positions au sol.",
      "Tactique et patience priment sur la force."
    ],
    "pourQui": "Pour les adolescents et adultes, notamment les judokas.",
    "materiel": "Un judogi et une ceinture.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "judo-jujitsu--kyudo": {
    "accroche": "Le tir à l'arc japonais, pratiqué comme une voie de concentration.",
    "principe": "Le kyudo se pratique avec un grand arc asymétrique. Chaque tir suit une suite de mouvements codifiés, de la posture au lâcher. L'important n'est pas seulement de toucher la cible, mais de tirer juste.",
    "pratique": [
      "Huit étapes codifiées pour chaque tir.",
      "Cible placée à distance fixe.",
      "Passages de grades jugés sur la forme et le résultat."
    ],
    "pourQui": "Pour les adolescents et adultes à la recherche de calme et de précision.",
    "materiel": "Tenue traditionnelle, gant de tir, arc et flèches (souvent prêtés au début).",
    "format": "Individuel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Technique"
    ]
  },
  "judo-jujitsu--sport-chanbara": {
    "accroche": "Le combat au sabre en mousse : ludique, rapide et sans danger.",
    "principe": "Le sport chanbara oppose deux combattants armés de sabres en mousse. Le premier qui touche l'autre gagne. Il existe plusieurs armes : sabre court, sabre long, bâton, double sabre.",
    "pratique": [
      "Une touche suffit pour gagner l'échange.",
      "Plusieurs armes et formats de combat.",
      "Protection de tête légère."
    ],
    "pourQui": "Pour les enfants dès 5 ans et pour les adultes qui veulent s'amuser.",
    "materiel": "Sabres en mousse et masque, fournis par le club.",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 5 ans",
    "tags": [
      "Loisir",
      "Enfants",
      "Compétition"
    ]
  },
  "judo-jujitsu--jodo": {
    "accroche": "L'art du bâton face au sabre, en formes codifiées.",
    "principe": "Le jodo se pratique à deux : l'un manie un bâton de bois (jo), l'autre un sabre en bois (bokken). Les formes codifiées enseignent la distance, le rythme et la précision.",
    "pratique": [
      "Formes à deux, très codifiées.",
      "Travail de la distance et du timing.",
      "Passages de grades."
    ],
    "pourQui": "Pour les adolescents et adultes qui aiment les arts martiaux traditionnels.",
    "materiel": "Keikogi, hakama, jo et bokken.",
    "format": "À deux",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Technique"
    ]
  },
  "judo-jujitsu--jiu-jitsu-bresilien": {
    "accroche": "Le combat au sol en kimono, centré sur les clés et les étranglements.",
    "principe": "Le jiu-jitsu brésilien (JJB) se joue principalement au sol. Le but est de contrôler l'adversaire et de le faire abandonner par une clé ou un étranglement. La technique permet à un pratiquant plus léger de s'imposer.",
    "pratique": [
      "Gagner par abandon, sinon aux points (positions et contrôles).",
      "Combats avec kimono (gi) ou sans (no-gi).",
      "Ceintures : blanche, bleue, violette, marron, noire."
    ],
    "pourQui": "Pour les adolescents et adultes, quel que soit le gabarit.",
    "materiel": "Un kimono de JJB et une ceinture, un protège-dents conseillé.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "judo-jujitsu--naginata": {
    "accroche": "Un art martial japonais pratiqué avec une longue hallebarde en bois.",
    "principe": "La naginata se pratique avec une arme longue, terminée par une lame en bambou. Comme au kendo, on porte une armure et on cherche à toucher des zones précises. Il existe aussi des formes codifiées.",
    "pratique": [
      "Combats en armure sur des cibles précises (tête, poignets, flanc, tibias).",
      "Formes codifiées à deux.",
      "Étiquette japonaise traditionnelle."
    ],
    "pourQui": "Pour les adolescents et adultes curieux d'un art martial rare.",
    "materiel": "Keikogi, hakama, naginata d'entraînement, armure ensuite.",
    "format": "En duel",
    "lieu": "Dojo",
    "age": "Ados et adultes",
    "tags": [
      "Technique"
    ]
  },
  "taekwondo--body-taekwondo": {
    "accroche": "Un cours de fitness en musique, inspiré des coups de pied et de poing du taekwondo.",
    "principe": "Le body taekwondo enchaîne des mouvements de taekwondo dans le vide, en musique, sans aucun contact. C'est un entraînement cardio et tonique, accessible à tous.",
    "pratique": [
      "Échauffement, enchaînements chorégraphiés, retour au calme.",
      "Aucun contact avec un partenaire.",
      "Intensité adaptée à chacun."
    ],
    "pourQui": "Pour les adolescents et adultes qui veulent se dépenser sans combattre.",
    "materiel": "Une tenue de sport, pieds nus ou baskets légères.",
    "format": "En groupe",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "taekwondo--taekwondo-impact": {
    "accroche": "Frapper fort dans des cibles : la puissance du taekwondo, sans combat.",
    "principe": "Le taekwondo impact se concentre sur la frappe de cibles (pattes d'ours, boucliers, sacs). On travaille la vitesse, la puissance et la précision des coups de pied, en binôme.",
    "pratique": [
      "Un partenaire tient la cible, l'autre frappe.",
      "Enchaînements rapides et intenses.",
      "Aucun combat contre une personne."
    ],
    "pourQui": "Pour ceux qui veulent se défouler et travailler leur condition physique.",
    "materiel": "Tenue de sport ; cibles fournies par le club.",
    "format": "En binôme",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "taekwondo--taekwonkido": {
    "accroche": "Une méthode coréenne de défense personnelle, entre frappes, clés et projections.",
    "principe": "Le taekwonkido combine les techniques de frappe du taekwondo avec des clés, des projections et des dégagements. Il est orienté vers la self-défense et la maîtrise de soi.",
    "pratique": [
      "Enchaînements de défense face à différentes attaques.",
      "Clés articulaires et projections.",
      "Formes codifiées et passages de grades."
    ],
    "pourQui": "Pour les adolescents et adultes qui veulent apprendre à se défendre.",
    "materiel": "Un dobok et une ceinture.",
    "format": "En binôme",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Self-défense"
    ]
  },
  "taekwondo--hoshin-moosool": {
    "accroche": "Un art martial coréen de défense personnelle, centré sur les clés et les projections.",
    "principe": "Le hoshin moosool enseigne à neutraliser une attaque par des clés, des projections et des contrôles, plutôt que par des coups. Il insiste sur la souplesse et la précision des gestes.",
    "pratique": [
      "Dégagements et contrôles articulaires.",
      "Projections et chutes.",
      "Travail en binôme, sans compétition."
    ],
    "pourQui": "Pour les adolescents et adultes, sans prérequis.",
    "materiel": "Un dobok et une ceinture.",
    "format": "En binôme",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Self-défense"
    ]
  },
  "boxe-anglaise--boxe-anglaise": {
    "accroche": "Le noble art : uniquement les poings, beaucoup de jeu de jambes et de stratégie.",
    "principe": "La boxe anglaise se pratique avec les poings gantés, en visant le visage et le haut du corps. L'entraînement mêle corde à sauter, sac de frappe, technique et assauts. On peut la pratiquer en loisir, en éducatif ou en compétition.",
    "pratique": [
      "Boxe éducative pour les jeunes : on touche sans appuyer.",
      "Boxe amateur en rounds de 3 minutes.",
      "Boxe loisir et fitness boxing sans combat."
    ],
    "pourQui": "Dès 6 ans en boxe éducative, et à tout âge en loisir.",
    "materiel": "Gants, bandes, protège-dents ; casque pour les assauts.",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 7-8 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "lutte--lutte": {
    "accroche": "Lutte libre, gréco-romaine et féminine : les styles olympiques de la lutte.",
    "principe": "Deux lutteurs cherchent à amener l'autre au sol et à lui plaquer les épaules au tapis. En lutte libre, on peut saisir les jambes ; en gréco-romaine, seulement le haut du corps.",
    "pratique": [
      "Victoire par tombé (épaules au sol) ou aux points.",
      "Combat en deux périodes de 3 minutes chez les seniors.",
      "Catégories de poids pour des combats équilibrés."
    ],
    "pourQui": "Dès 5-6 ans en lutte éducative, filles et garçons.",
    "materiel": "Justaucorps de lutte et chaussures de lutte.",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 5 ans",
    "tags": [
      "Compétition",
      "Enfants"
    ]
  },
  "lutte--grappling": {
    "accroche": "Le combat de saisie sans kimono : clés, étranglements et contrôles, sans aucune frappe.",
    "principe": "Le grappling combine les techniques de lutte, de judo et de jiu-jitsu, sans vêtement à saisir. On gagne par abandon de l'adversaire ou aux points. Il existe aussi une version avec kimono (grappling gi).",
    "pratique": [
      "Aucune frappe autorisée.",
      "Victoire par soumission ou aux points.",
      "Combats debout et au sol."
    ],
    "pourQui": "Pour les adolescents et adultes, débutants ou venus d'autres sports de combat.",
    "materiel": "Short et tee-shirt moulant (rashguard), protège-dents.",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "lutte--sambo": {
    "accroche": "L'art martial russe qui mêle projections et clés de jambes.",
    "principe": "Le sambo sportif se pratique en veste, short et chaussures. Il associe les projections du judo et de la lutte aux clés de bras et de jambes. Il existe aussi un sambo combat, avec frappes.",
    "pratique": [
      "Victoire par projection parfaite, par abandon ou aux points.",
      "Clés de jambes autorisées, contrairement au judo.",
      "Combats en veste et short."
    ],
    "pourQui": "Pour les adolescents et adultes, judokas ou lutteurs.",
    "materiel": "Veste de sambo, short, chaussures spécifiques.",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "randonnee-pedestre--randonnee-pedestre": {
    "accroche": "Marcher en groupe sur les sentiers, à la journée ou à la demi-journée : le grand classique des clubs de rando.",
    "principe": "Le club propose un programme de sorties encadrées par des animateurs formés, classées par distance et dénivelé. Tu choisis celles qui correspondent à ton rythme. On découvre la région, on parle, on prend l'air.",
    "pratique": [
      "Sorties classées : facile, moyen, sportif.",
      "Itinéraires souvent sur les sentiers balisés GR et PR.",
      "Encadrement par des animateurs diplômés de la fédération."
    ],
    "pourQui": "Pour tous, des familles aux seniors.",
    "materiel": "Chaussures de randonnée, sac à dos, eau, veste imperméable.",
    "format": "En groupe",
    "lieu": "Sentiers",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Plein air",
      "Santé"
    ]
  },
  "randonnee-pedestre--raquette-a-neige": {
    "accroche": "Randonner l'hiver dans la neige, sans s'enfoncer, au calme des forêts enneigées.",
    "principe": "Les raquettes répartissent ton poids pour marcher sur la neige profonde. Les sorties en montagne sont encadrées, avec attention particulière à la météo et au risque d'avalanche.",
    "pratique": [
      "Sorties à la journée ou en séjour.",
      "Itinéraires choisis selon l'enneigement et les risques.",
      "Bâtons recommandés pour l'équilibre."
    ],
    "pourQui": "Pour tous ceux qui savent marcher : aucune technique particulière.",
    "materiel": "Raquettes, bâtons, chaussures chaudes et imperméables, vêtements en couches.",
    "format": "En groupe",
    "lieu": "Montagne enneigée",
    "age": "Enfants et adultes",
    "tags": [
      "Loisir",
      "Plein air"
    ]
  },
  "randonnee-pedestre--marche-nordique": {
    "accroche": "Une marche dynamique avec des bâtons qui font travailler tout le corps.",
    "principe": "En marche nordique, on pousse sur des bâtons spécifiques pour accélérer le pas. Les bras, les épaules et le dos travaillent autant que les jambes. Plus tonique que la marche classique, elle reste douce pour les articulations.",
    "pratique": [
      "Apprentissage de la technique de poussée des bâtons.",
      "Séances d'une à deux heures, à rythme soutenu.",
      "Échauffement et étirements en début et fin de séance."
    ],
    "pourQui": "Pour les adultes et seniors qui veulent une activité complète sans impact.",
    "materiel": "Bâtons de marche nordique (souvent prêtés au début), chaussures de trail ou de marche.",
    "format": "En groupe",
    "lieu": "Chemins et parcs",
    "age": "Adultes et seniors",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "randonnee-pedestre--longe-cote-marche-aquatique": {
    "accroche": "Marcher dans la mer, de l'eau jusqu'à la taille ou la poitrine : tonique et doux à la fois.",
    "principe": "Le longe-côte consiste à marcher dans l'eau de mer, parallèlement à la plage. L'eau résiste à chaque pas, ce qui renforce les muscles sans choc pour les articulations. Il se pratique toute l'année, en combinaison l'hiver.",
    "pratique": [
      "Marche en groupe, en ligne, face aux vagues.",
      "Profondeur adaptée au niveau de chacun.",
      "Certains utilisent une pagaie pour travailler le haut du corps."
    ],
    "pourQui": "Pour les adultes et seniors, y compris ceux qui ne nagent pas bien (on a pied).",
    "materiel": "Combinaison néoprène, chaussons aquatiques, gants l'hiver.",
    "format": "En groupe",
    "lieu": "Mer",
    "age": "Adultes et seniors",
    "tags": [
      "Santé",
      "Plein air"
    ]
  },
  "randonnee-pedestre--cyclotourisme": {
    "accroche": "Des balades à vélo organisées par les clubs de randonnée.",
    "principe": "Certains clubs de randonnée proposent aussi des sorties à vélo, sur route ou en VTT. L'esprit reste le même : découvrir, à son rythme, en groupe.",
    "pratique": [
      "Sorties par niveau de distance.",
      "Balades sur routes calmes et voies vertes.",
      "Encadrement par des animateurs du club."
    ],
    "pourQui": "Pour tous ceux qui savent faire du vélo.",
    "materiel": "Un vélo en bon état, un casque.",
    "format": "En groupe",
    "lieu": "Route et chemins",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Plein air"
    ]
  },
  "randonnee-pedestre--marche-d-endurance": {
    "accroche": "Marcher longtemps, sur de grandes distances : un défi d'endurance à son rythme.",
    "principe": "La marche d'endurance consiste à parcourir de longues distances en une journée ou plus. On s'entraîne progressivement pour participer à des événements comme les marches de nuit ou les randonnées au long cours.",
    "pratique": [
      "Sorties longues, en augmentant progressivement les distances.",
      "Gestion de l'allure, de l'alimentation et de l'hydratation.",
      "Participation à des événements de longue distance."
    ],
    "pourQui": "Pour les marcheurs réguliers qui veulent se lancer un défi.",
    "materiel": "Chaussures bien rodées, sac léger, frontale pour la nuit.",
    "format": "En groupe",
    "lieu": "Sentiers",
    "age": "Adultes",
    "tags": [
      "Loisir",
      "Dépassement"
    ]
  },
  "randonnee-pedestre--ski-de-fond": {
    "accroche": "Glisser sur les pistes nordiques, en forêt : la randonnée version hiver.",
    "principe": "Le ski de fond se pratique sur des pistes damées, en style classique (dans des traces) ou en skating. Les clubs de randonnée organisent des sorties découverte et des séjours.",
    "pratique": [
      "Style classique : on glisse dans les traces, comme en marchant.",
      "Skating : pas de patineur, plus sportif.",
      "Sorties à la journée ou en séjour."
    ],
    "pourQui": "Pour tous, du débutant au skieur confirmé.",
    "materiel": "Skis, chaussures et bâtons de fond, louables sur place.",
    "format": "En groupe",
    "lieu": "Pistes nordiques",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Plein air"
    ]
  },
  "randonnee-pedestre--ski-de-randonnee-ou-ski-alpinisme": {
    "accroche": "Monter en peaux de phoque, redescendre dans la poudreuse : la montagne à ski, loin des remontées.",
    "principe": "Avec des peaux collées sous les skis, on monte les pentes enneigées, puis on les retire pour descendre hors piste. La pratique demande une bonne technique de ski et une formation à la sécurité en montagne.",
    "pratique": [
      "Montée avec peaux et fixations talon libre.",
      "Descente en neige naturelle.",
      "Matériel de sécurité avalanche obligatoire : DVA, pelle, sonde."
    ],
    "pourQui": "Pour les skieurs à l'aise, avec un encadrement formé.",
    "materiel": "Skis et chaussures de randonnée, peaux, DVA, pelle et sonde.",
    "format": "En groupe",
    "lieu": "Montagne",
    "age": "Adultes",
    "tags": [
      "Plein air",
      "Dépassement"
    ]
  },
  "randonnee-pedestre--geocaching-caches-et-gps-ou-randocaching": {
    "accroche": "Une chasse au trésor grandeur nature, avec un GPS ou un smartphone.",
    "principe": "Le géocaching consiste à retrouver des boîtes cachées (caches) grâce à leurs coordonnées GPS. Le Randocaching® de la fédération l'associe à la randonnée pour rendre la marche ludique.",
    "pratique": [
      "Coordonnées et indices disponibles sur une application.",
      "On signe le carnet de la cache et on la remet en place.",
      "Parcours adaptés aux familles."
    ],
    "pourQui": "Pour les familles avec enfants et pour tous les curieux.",
    "materiel": "Un smartphone ou un GPS, de bonnes chaussures.",
    "format": "En famille ou en groupe",
    "lieu": "Nature et ville",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Enfants",
      "Découverte"
    ]
  },
  "randonnee-pedestre--alpinisme": {
    "accroche": "Les courses en haute montagne, sur neige, glace et rocher.",
    "principe": "Certains clubs de randonnée proposent des sorties d'alpinisme encadrées. On progresse en cordée, avec crampons et piolet, vers des sommets accessibles selon le niveau.",
    "pratique": [
      "Progression en cordée, encadrée.",
      "Technique de cramponnage et d'utilisation du piolet.",
      "Courses choisies selon la météo et le niveau."
    ],
    "pourQui": "Pour les randonneurs en bonne condition physique qui veulent aller plus haut.",
    "materiel": "Chaussures d'alpinisme, crampons, piolet, baudrier, casque.",
    "format": "En cordée",
    "lieu": "Haute montagne",
    "age": "Adultes",
    "tags": [
      "Plein air",
      "Formation"
    ]
  },
  "ski--ski-alpin": {
    "accroche": "Dévaler les pistes et enchaîner les virages, en loisir ou entre les portes de slalom.",
    "principe": "Le ski alpin se pratique sur les pistes balisées des stations. En club, on travaille la technique de virage, puis on découvre les courses : slalom, géant, super-G et descente, de plus en plus rapides.",
    "pratique": [
      "Slalom : portes rapprochées, virages courts.",
      "Géant : portes plus espacées, virages plus amples.",
      "Super-G et descente : vitesse maximale."
    ],
    "pourQui": "Dès 3-4 ans, et à tout âge pour le loisir.",
    "materiel": "Skis, chaussures, bâtons, casque, masque.",
    "format": "Individuel",
    "lieu": "Pistes",
    "age": "Dès 3-4 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "ski--snowboard": {
    "accroche": "Glisser sur une planche unique : en piste, en snowpark ou en boardercross.",
    "principe": "Les deux pieds sont fixés sur la même planche, en travers. On apprend à virer en passant d'une carre à l'autre, puis on choisit son terrain : pistes, poudreuse, snowpark ou parcours de boardercross.",
    "pratique": [
      "Freestyle : sauts et figures en snowpark.",
      "Boardercross : course à plusieurs sur un parcours de bosses et virages.",
      "Slalom parallèle : duel entre deux snowboarders."
    ],
    "pourQui": "Dès 6-7 ans environ, et très apprécié des ados et jeunes adultes.",
    "materiel": "Snowboard, boots, casque, gants, protège-poignets conseillés.",
    "format": "Individuel",
    "lieu": "Pistes et snowpark",
    "age": "Dès 6-7 ans",
    "tags": [
      "Loisir",
      "Compétition"
    ]
  },
  "ski--ski-de-fond": {
    "accroche": "Le ski nordique, sur pistes damées : un des sports d'endurance les plus complets.",
    "principe": "En ski de fond, on avance sur le plat et en montée grâce à la poussée des jambes et des bras. Deux techniques existent : le classique, dans des traces, et le skating, comme un patineur.",
    "pratique": [
      "Style classique : pas alternatif dans les traces.",
      "Skating : poussée latérale, plus rapide.",
      "Courses en contre-la-montre, en départ groupé ou en sprint."
    ],
    "pourQui": "Dès 5 ans en club, et à tout âge.",
    "materiel": "Skis de fond, chaussures et bâtons adaptés à la technique.",
    "format": "Individuel",
    "lieu": "Pistes nordiques",
    "age": "Dès 5 ans",
    "tags": [
      "Compétition",
      "Loisir",
      "Santé"
    ]
  },
  "ski--ski-de-randonnee": {
    "accroche": "Monter avec des peaux sous les skis, puis redescendre en neige naturelle.",
    "principe": "Le ski de randonnée allie effort en montée et plaisir de la descente. En compétition, le ski-alpinisme enchaîne montées, portages et descentes ; il est entré aux Jeux olympiques d'hiver en 2026.",
    "pratique": [
      "Montée en peaux de phoque, talon libre.",
      "Descente en neige naturelle, hors piste.",
      "Matériel de sécurité avalanche obligatoire."
    ],
    "pourQui": "Pour les bons skieurs, adolescents et adultes.",
    "materiel": "Skis de randonnée, peaux, chaussures, DVA, pelle, sonde.",
    "format": "Individuel ou en groupe",
    "lieu": "Montagne",
    "age": "Ados et adultes",
    "tags": [
      "Plein air",
      "Compétition"
    ]
  },
  "ski--biathlon": {
    "accroche": "Ski de fond et tir à la carabine : il faut aller vite, puis se calmer pour viser juste.",
    "principe": "Le biathlète enchaîne des boucles de ski de fond (en skating) et des séances de tir sur 5 cibles, couché ou debout. Chaque cible manquée coûte une boucle de pénalité ou du temps.",
    "pratique": [
      "Tirs couché et debout, sur 5 cibles.",
      "Pénalités en cas de cible manquée.",
      "Chez les jeunes, tir à la carabine à air comprimé ou laser."
    ],
    "pourQui": "Pour les fondeurs à partir de l'adolescence, avec un encadrement spécifique au tir.",
    "materiel": "Matériel de ski de fond ; la carabine est fournie par le club.",
    "format": "Individuel",
    "lieu": "Pistes nordiques",
    "age": "Dès 10 ans environ",
    "tags": [
      "Compétition"
    ]
  },
  "ski--rollerski": {
    "accroche": "Des skis à roulettes pour s'entraîner au ski de fond toute l'année.",
    "principe": "Le rollerski reproduit les gestes du ski de fond sur l'asphalte. C'est l'entraînement d'été des fondeurs, et une discipline de compétition à part entière.",
    "pratique": [
      "Techniques classique et skating, comme sur la neige.",
      "Pratique sur routes calmes et pistes dédiées.",
      "Casque et protections obligatoires."
    ],
    "pourQui": "Pour les fondeurs et les adultes qui veulent un sport d'endurance.",
    "materiel": "Rollerskis, bâtons à pointes carbure, casque, protections.",
    "format": "Individuel",
    "lieu": "Route",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "ski--ski-freestyle": {
    "accroche": "Sauts, figures et créativité : le ski version acrobatique.",
    "principe": "Le ski freestyle regroupe plusieurs épreuves : bosses, slopestyle (parcours de modules), big air, halfpipe, skicross. On apprend progressivement les sauts et les rotations, en toute sécurité.",
    "pratique": [
      "Bosses : descente rapide avec deux sauts.",
      "Slopestyle et big air : figures notées par des juges.",
      "Skicross : course à quatre sur un parcours de bosses."
    ],
    "pourQui": "Pour les skieurs déjà à l'aise, dès 8 ans environ.",
    "materiel": "Skis twin-tip, casque, protection dorsale conseillée.",
    "format": "Individuel",
    "lieu": "Snowpark",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "ski--telemark": {
    "accroche": "Une technique ancienne et élégante, talon libre et genou fléchi.",
    "principe": "En télémark, le talon n'est pas fixé. Les virages se font en fléchissant un genou vers l'avant, dans une position très caractéristique. C'est exigeant, mais très gracieux.",
    "pratique": [
      "Virages en génuflexion, alternant le pied avant.",
      "Pratique sur piste, hors piste ou en compétition.",
      "Courses avec saut et virage relevé."
    ],
    "pourQui": "Pour les skieurs qui veulent un nouveau défi technique.",
    "materiel": "Skis, chaussures et fixations de télémark.",
    "format": "Individuel",
    "lieu": "Pistes",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Technique"
    ]
  },
  "ski--randonnee-nordique": {
    "accroche": "Randonner sur des skis de fond hors des pistes damées.",
    "principe": "La randonnée nordique se pratique avec des skis de fond plus larges, sur des itinéraires enneigés en forêt ou sur les plateaux. C'est un mélange de balade et de glisse.",
    "pratique": [
      "Itinéraires hors traces, souvent en forêt.",
      "Sorties à la journée ou en itinérance.",
      "Lecture du terrain et de la météo."
    ],
    "pourQui": "Pour les randonneurs et skieurs de fond.",
    "materiel": "Skis nordiques à écailles ou à peaux, chaussures, bâtons.",
    "format": "En groupe",
    "lieu": "Neige hors pistes",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Plein air"
    ]
  },
  "ski--ski-sur-herbe": {
    "accroche": "Le ski alpin sans neige : on dévale des pentes d'herbe l'été.",
    "principe": "Le ski sur herbe utilise des skis courts équipés de chenilles ou de roulettes. On pratique les mêmes disciplines qu'en ski alpin (slalom, géant), sur des pentes herbeuses.",
    "pratique": [
      "Skis à chenilles, très rapides.",
      "Slalom et géant autour de portes.",
      "Pratique estivale."
    ],
    "pourQui": "Pour les skieurs qui veulent glisser l'été.",
    "materiel": "Skis sur herbe, chaussures de ski, casque et protections.",
    "format": "Individuel",
    "lieu": "Pentes herbeuses",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "ski--saut-a-ski": {
    "accroche": "S'élancer d'un tremplin et voler le plus loin possible.",
    "principe": "Le sauteur prend de la vitesse sur l'élan, décolle au bout du tremplin et cherche à voler le plus loin possible avant d'atterrir en position de télémark. On commence sur de petits tremplins.",
    "pratique": [
      "Note combinant distance et style.",
      "Tremplins de tailles croissantes.",
      "Atterrissage en position de télémark."
    ],
    "pourQui": "Pour les jeunes skieurs courageux, dans les rares clubs équipés de tremplins.",
    "materiel": "Skis et combinaison de saut, casque ; souvent fournis par le club.",
    "format": "Individuel",
    "lieu": "Tremplin",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "ski--combine-nordique": {
    "accroche": "Saut à ski puis course de ski de fond : un des sports les plus complets de l'hiver.",
    "principe": "Le combiné nordique enchaîne une épreuve de saut et une course de ski de fond. Le résultat du saut détermine l'ordre de départ de la course : le premier arrivé l'emporte.",
    "pratique": [
      "Saut à ski d'abord.",
      "Départ décalé en ski de fond selon le saut.",
      "Le premier à franchir la ligne gagne."
    ],
    "pourQui": "Pour les jeunes sauteurs et fondeurs.",
    "materiel": "Matériel de saut et de fond.",
    "format": "Individuel",
    "lieu": "Tremplin et pistes",
    "age": "Dès 10 ans",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "ski--ski-de-vitesse": {
    "accroche": "Descendre tout droit le plus vite possible : la discipline la plus rapide sur la neige.",
    "principe": "Le ski de vitesse se pratique sur une pente très raide, en ligne droite. Le skieur adopte une position aérodynamique et on mesure sa vitesse sur une zone chronométrée.",
    "pratique": [
      "Ligne droite, position très basse.",
      "Mesure de vitesse sur une zone dédiée.",
      "Équipement aérodynamique."
    ],
    "pourQui": "Pour les skieurs très expérimentés.",
    "materiel": "Skis longs, casque et combinaison aérodynamiques.",
    "format": "Individuel",
    "lieu": "Piste dédiée",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "ski--biathlon-running": {
    "accroche": "La version estivale du biathlon : course à pied et tir.",
    "principe": "Le biathlon running remplace le ski par la course à pied. On alterne boucles de course et séances de tir, souvent à la carabine laser ou à air comprimé.",
    "pratique": [
      "Boucles de course entre les tirs.",
      "Tirs couché et debout.",
      "Pénalités pour les cibles manquées."
    ],
    "pourQui": "Pour les coureurs et les biathlètes hors saison.",
    "materiel": "Chaussures de course ; carabine fournie.",
    "format": "Individuel",
    "lieu": "Extérieur",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "ski--hors-piste-freeride": {
    "accroche": "Skier en neige vierge, loin des pistes balisées, avec un encadrement et le bon matériel.",
    "principe": "Le freeride consiste à skier hors des pistes, en poudreuse ou en terrain varié. Les clubs forment à lire le terrain, évaluer le risque d'avalanche et utiliser le matériel de secours.",
    "pratique": [
      "Encadrement par des professionnels ou des cadres formés.",
      "Formation à la nivologie et au secours en avalanche.",
      "Compétitions de freeride notées par des juges."
    ],
    "pourQui": "Pour les skieurs confirmés.",
    "materiel": "Skis larges, DVA, pelle, sonde, sac airbag conseillé.",
    "format": "En groupe",
    "lieu": "Montagne",
    "age": "Ados et adultes",
    "tags": [
      "Plein air",
      "Formation"
    ]
  },
  "ski--ski-forme": {
    "accroche": "Skier pour le plaisir et la forme, sans compétition.",
    "principe": "Le ski forme propose des séances orientées condition physique et technique, pour progresser et se faire plaisir. Les sorties sont encadrées par des moniteurs du club.",
    "pratique": [
      "Sorties en petits groupes de niveau.",
      "Conseils techniques et préparation physique.",
      "Pas de compétition."
    ],
    "pourQui": "Pour les adultes qui veulent skier régulièrement en groupe.",
    "materiel": "Matériel de ski habituel.",
    "format": "En groupe",
    "lieu": "Pistes",
    "age": "Adultes",
    "tags": [
      "Loisir",
      "Santé"
    ]
  },
  "ski--ski-sante": {
    "accroche": "Le ski adapté aux personnes qui reprennent une activité ou ont une fragilité de santé.",
    "principe": "Le ski santé propose des séances adaptées, encadrées par des éducateurs formés, sur des pistes faciles ou en ski de fond. L'objectif est de bouger en sécurité et de retrouver le plaisir de la glisse.",
    "pratique": [
      "Intensité adaptée à chacun.",
      "Encadrement par des éducateurs formés au sport-santé.",
      "Pistes faciles et pauses régulières."
    ],
    "pourQui": "Pour les adultes et seniors, avec l'accord de leur médecin.",
    "materiel": "Matériel de ski, souvent loué sur place.",
    "format": "En groupe",
    "lieu": "Pistes",
    "age": "Adultes et seniors",
    "tags": [
      "Santé"
    ]
  },
  "sports-de-glace--patinage-artistique": {
    "accroche": "Sauts, pirouettes et chorégraphies en musique : la grâce et la puissance sur glace.",
    "principe": "Le patineur enchaîne sauts, pirouettes et pas en musique. Des juges notent la difficulté technique et la qualité artistique. On commence par l'école de glace, puis on passe des tests pour progresser.",
    "pratique": [
      "Programme court et programme libre en compétition.",
      "Sauts (axel, lutz, flip…) et pirouettes.",
      "Tests de niveau pour accéder aux compétitions."
    ],
    "pourQui": "Dès 4 ans à l'école de glace, et à tout âge en loisir.",
    "materiel": "Patins de patinage artistique, tenue souple, gants.",
    "format": "Individuel ou en couple",
    "lieu": "Patinoire",
    "age": "Dès 4 ans",
    "tags": [
      "Compétition",
      "Loisir",
      "Enfants"
    ]
  },
  "sports-de-glace--danse-sur-glace": {
    "accroche": "En couple, sur le rythme : la danse sur glace mise sur l'interprétation et les pas.",
    "principe": "La danse sur glace se pratique en couple. Elle insiste sur les pas, le rythme et l'expression, avec des portés spectaculaires mais sans grands sauts.",
    "pratique": [
      "Danse rythmique et danse libre en compétition.",
      "Pas et portés synchronisés.",
      "Musiques imposées ou au choix selon l'épreuve."
    ],
    "pourQui": "Pour les patineurs qui aiment la musique et la danse.",
    "materiel": "Patins de danse, tenue souple.",
    "format": "En couple",
    "lieu": "Patinoire",
    "age": "Enfants et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "sports-de-glace--ballet-sur-glace": {
    "accroche": "Des chorégraphies en groupe, avec costumes et mises en scène.",
    "principe": "Le ballet sur glace présente un spectacle collectif : une histoire racontée sur la glace, en musique. On travaille la synchronisation et l'interprétation.",
    "pratique": [
      "Chorégraphies de groupe.",
      "Costumes et mise en scène.",
      "Galas et compétitions de ballets."
    ],
    "pourQui": "Pour les patineurs de tous niveaux qui aiment le spectacle.",
    "materiel": "Patins, costumes pour les galas.",
    "format": "En groupe",
    "lieu": "Patinoire",
    "age": "Enfants et adultes",
    "tags": [
      "Spectacle",
      "Loisir"
    ]
  },
  "sports-de-glace--curling": {
    "accroche": "Faire glisser des pierres de granit vers une cible, en balayant devant elles : stratégique et convivial.",
    "principe": "Deux équipes de 4 lancent tour à tour des pierres vers le centre d'une cible (la maison). Les balayeurs frottent la glace devant la pierre pour l'aider à aller plus loin et plus droit. L'équipe la plus proche du centre marque.",
    "pratique": [
      "Chaque joueur lance 2 pierres par manche.",
      "Les points vont à l'équipe dont les pierres sont les plus proches du centre.",
      "Le capitaine (skip) dirige la stratégie."
    ],
    "pourQui": "Pour tous les âges, sans condition physique particulière. Le curling fauteuil est paralympique.",
    "materiel": "Chaussures à semelle glissante et antidérapante, balai. Pierres fournies.",
    "format": "4 contre 4",
    "lieu": "Piste de curling",
    "age": "Tout âge",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "sports-de-glace--patinage-synchronise": {
    "accroche": "Une équipe de patineurs qui évolue comme un seul corps.",
    "principe": "Le patinage synchronisé réunit de nombreux patineurs sur la glace, qui réalisent ensemble des formations : lignes, cercles, roues, intersections. La précision collective est essentielle.",
    "pratique": [
      "Formations en ligne, cercle, bloc, roue.",
      "Notation de la difficulté et de la synchronisation.",
      "Catégories par âge."
    ],
    "pourQui": "Pour les patineurs qui aiment l'esprit d'équipe.",
    "materiel": "Patins, tenues d'équipe pour les compétitions.",
    "format": "En équipe",
    "lieu": "Patinoire",
    "age": "Enfants et adultes",
    "tags": [
      "Compétition",
      "Spectacle"
    ]
  },
  "sports-de-glace--sports-extreme": {
    "accroche": "Les disciplines de glisse spectaculaires sur glace.",
    "principe": "Cette catégorie regroupe des pratiques de glisse acrobatique et de vitesse sur glace, souvent en parcours. Elles demandent une excellente maîtrise du patinage.",
    "pratique": [
      "Parcours avec virages et obstacles.",
      "Courses et démonstrations.",
      "Protections complètes."
    ],
    "pourQui": "Pour les patineurs confirmés en quête de sensations.",
    "materiel": "Patins de hockey, casque, protections.",
    "format": "Individuel",
    "lieu": "Pistes de glace",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Spectacle"
    ]
  },
  "sports-de-glace--short-track": {
    "accroche": "La course de vitesse en peloton sur une petite piste ovale : tactique et dépassements.",
    "principe": "En short-track, plusieurs patineurs partent ensemble sur une piste de 111 m tracée dans une patinoire. Il faut se placer, dépasser et éviter les chutes. Les courses vont du sprint aux distances plus longues.",
    "pratique": [
      "Courses à plusieurs, sur des distances de 500 à 1 500 m.",
      "Relais par équipe.",
      "Virages serrés, très penchés."
    ],
    "pourQui": "Pour les jeunes patineurs qui aiment la vitesse, dès 8 ans environ.",
    "materiel": "Patins à longue lame, casque, gants anti-coupure, protège-tibias.",
    "format": "Individuel et relais",
    "lieu": "Patinoire",
    "age": "Dès 8 ans",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "sports-de-glace--glace-inline": {
    "accroche": "Les pratiques de patinage en ligne liées aux sports de glace.",
    "principe": "Le patinage sur roues en ligne permet de travailler les mouvements du patinage hors de la glace, notamment l'été.",
    "pratique": [
      "Exercices de glisse et d'équilibre.",
      "Chorégraphies adaptées.",
      "Pratique hors saison."
    ],
    "pourQui": "Pour les patineurs et les débutants.",
    "materiel": "Rollers en ligne, casque, protections.",
    "format": "Individuel",
    "lieu": "Patinoire et salle",
    "age": "Enfants et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "sports-de-glace--ice-cross": {
    "accroche": "Descendre à quatre une piste de glace avec bosses et virages, en patins.",
    "principe": "L'ice cross, aussi appelé « crashed ice », se pratique sur une piste en pente avec bosses, virages et sauts. Quatre patineurs partent ensemble : les deux premiers se qualifient.",
    "pratique": [
      "Départs à quatre, élimination directe.",
      "Piste avec bosses, sauts et virages relevés.",
      "Équipement de hockey complet."
    ],
    "pourQui": "Pour les patineurs expérimentés, souvent issus du hockey.",
    "materiel": "Patins de hockey, casque, protections de hockey.",
    "format": "4 de front",
    "lieu": "Piste de glace",
    "age": "Adultes",
    "tags": [
      "Compétition"
    ]
  },
  "sports-de-glace--freestyle": {
    "accroche": "Figures libres et créatives sur patins.",
    "principe": "Le freestyle sur glace laisse place à l'improvisation : glissades, rotations, figures inventées. C'est une pratique libre et créative.",
    "pratique": [
      "Figures et enchaînements libres.",
      "Inspiration du patinage et du street.",
      "Démonstrations et rencontres."
    ],
    "pourQui": "Pour les patineurs à l'aise qui aiment créer.",
    "materiel": "Patins, casque conseillé.",
    "format": "Individuel",
    "lieu": "Patinoire",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "sports-de-glace--bobsleigh": {
    "accroche": "Descendre une piste de glace en équipage, à grande vitesse.",
    "principe": "Le bobsleigh est un engin caréné dans lequel monte un équipage. La poussée au départ est décisive, puis le pilote guide le bob dans les virages de la piste.",
    "pratique": [
      "Poussée explosive au départ.",
      "Pilotage dans les virages relevés.",
      "Bob à 2, à 4, et monobob."
    ],
    "pourQui": "Pour les adultes explosifs, souvent venus de l'athlétisme.",
    "materiel": "Casque, combinaison, chaussures à pointes ; le bob est fourni.",
    "format": "Équipage de 2 ou 4",
    "lieu": "Piste de glace",
    "age": "Adultes",
    "tags": [
      "Compétition",
      "Haut niveau"
    ]
  },
  "sports-de-glace--luge": {
    "accroche": "Descendre allongé sur le dos, pieds en avant, sur une piste de glace.",
    "principe": "Le lugeur est allongé sur le dos sur une petite luge et dirige avec les jambes et les épaules. Les meilleurs dépassent de très grandes vitesses.",
    "pratique": [
      "Départ assis, propulsion avec les mains.",
      "Pilotage par de petites pressions du corps.",
      "Épreuves en simple, double et relais."
    ],
    "pourQui": "Pour les jeunes et adultes, dans les très rares clubs équipés.",
    "materiel": "Casque, combinaison, gants à pointes.",
    "format": "Individuel ou double",
    "lieu": "Piste de glace",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "sports-de-glace--skeleton": {
    "accroche": "Descendre à plat ventre, tête en avant, sur une luge plate.",
    "principe": "Le skeleton se pratique tête la première, allongé sur le ventre. Après un sprint au départ, l'athlète se couche sur la luge et la dirige par de légers mouvements.",
    "pratique": [
      "Sprint de départ en poussant la luge.",
      "Descente à plat ventre, tête en avant.",
      "Pilotage par les épaules et les genoux."
    ],
    "pourQui": "Pour les athlètes courageux et explosifs.",
    "materiel": "Casque à mentonnière, combinaison, chaussures à pointes.",
    "format": "Individuel",
    "lieu": "Piste de glace",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "danse--modern-jazz": {
    "accroche": "Une danse énergique et expressive, entre technique classique et rythme jazz.",
    "principe": "Le modern jazz mêle la rigueur du classique (placement, souplesse) à l'énergie du jazz (isolations, rythme). Les cours se terminent souvent par une chorégraphie, présentée au gala de fin d'année.",
    "pratique": [
      "Échauffement, travail technique au milieu de la salle, diagonales.",
      "Sauts, tours et isolations du corps.",
      "Chorégraphies de groupe sur des musiques actuelles."
    ],
    "pourQui": "Dès 6-7 ans, et très prisé des adolescents et adultes.",
    "materiel": "Tenue près du corps, chaussons de jazz ou pieds nus.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Dès 6-7 ans",
    "tags": [
      "Loisir",
      "Spectacle",
      "Enfants"
    ]
  },
  "danse--jazz": {
    "accroche": "Rythme, swing et énergie : la danse jazz est née de la culture afro-américaine.",
    "principe": "La danse jazz joue avec le rythme de la musique, les isolations (bouger une partie du corps indépendamment) et les syncopes. Elle est dynamique et expressive.",
    "pratique": [
      "Isolations des épaules, du bassin, de la tête.",
      "Travail du rythme et de la musicalité.",
      "Chorégraphies présentées en spectacle."
    ],
    "pourQui": "Pour les enfants, ados et adultes qui aiment bouger en rythme.",
    "materiel": "Tenue souple, chaussons de jazz.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Dès 6-7 ans",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--danses-hip-hop": {
    "accroche": "Popping, locking, house, new style : les danses nées dans la rue, entre freestyle et chorégraphie.",
    "principe": "Les danses hip-hop regroupent plusieurs styles debout, chacun avec ses pas de base. On apprend les fondamentaux, puis on développe son style personnel en freestyle ou en chorégraphie de groupe.",
    "pratique": [
      "Apprentissage des pas de base de chaque style.",
      "Freestyle sur la musique, en cercle.",
      "Battles et chorégraphies de crew."
    ],
    "pourQui": "Dès 7-8 ans, très populaire chez les ados et jeunes adultes.",
    "materiel": "Baskets confortables et tenue ample.",
    "format": "Solo ou crew",
    "lieu": "Studio",
    "age": "Dès 7-8 ans",
    "tags": [
      "Loisir",
      "Compétition",
      "Spectacle"
    ]
  },
  "danse--ateliers-de-creation": {
    "accroche": "Créer ses propres chorégraphies, en groupe, guidé par un professeur.",
    "principe": "Les ateliers de création invitent à inventer le mouvement plutôt qu'à le reproduire. À partir d'un thème, d'une musique ou d'une image, le groupe construit une pièce chorégraphique.",
    "pratique": [
      "Improvisations guidées.",
      "Construction collective d'une chorégraphie.",
      "Présentation lors de spectacles."
    ],
    "pourQui": "Pour les danseurs de tous niveaux qui ont envie de créer.",
    "materiel": "Tenue souple, pieds nus ou chaussettes.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--contemporain": {
    "accroche": "Une danse libre et inventive, qui explore le poids, le sol et l'émotion.",
    "principe": "La danse contemporaine casse les codes des danses académiques. On joue avec le poids du corps, le sol, la respiration et l'espace. Chaque pièce raconte une émotion ou une idée.",
    "pratique": [
      "Travail au sol, chutes et relevés.",
      "Improvisation et composition.",
      "Chorégraphies expressives."
    ],
    "pourQui": "Dès 8 ans, et très apprécié des adultes.",
    "materiel": "Tenue souple, pieds nus.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Dès 8 ans",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--danses-latines": {
    "accroche": "Samba, cha-cha, rumba, paso doble et jive : les danses latines de compétition.",
    "principe": "Les danses latines se dansent en couple, avec beaucoup de dynamisme et d'expression. Elles font partie des danses sportives, avec des compétitions par niveau et par âge.",
    "pratique": [
      "Cinq danses : samba, cha-cha-cha, rumba, paso doble, jive.",
      "Pas de base, puis figures et chorégraphies.",
      "Compétitions notées par des juges."
    ],
    "pourQui": "Pour les enfants, ados et adultes, en couple.",
    "materiel": "Chaussures de danse latine, tenue souple.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Enfants et adultes",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "danse--classique": {
    "accroche": "La base de toutes les danses : placement, souplesse, rigueur et élégance.",
    "principe": "La danse classique s'appuie sur des positions et des pas codifiés, appris à la barre puis au milieu de la salle. Elle développe la posture, la souplesse et la précision. Le travail sur pointes vient plus tard, quand le corps est prêt.",
    "pratique": [
      "Exercices à la barre, puis au milieu.",
      "Sauts, tours et adages.",
      "Spectacles et examens de fin d'année."
    ],
    "pourQui": "Dès 4 ans en éveil, et à tout âge pour les adultes débutants.",
    "materiel": "Justaucorps, collant, demi-pointes.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Dès 4 ans",
    "tags": [
      "Loisir",
      "Spectacle",
      "Enfants"
    ]
  },
  "danse--danses-standards": {
    "accroche": "Valse, tango, quickstep, slow fox : l'élégance des danses de salon en couple fermé.",
    "principe": "Les danses standards se dansent en couple, dans une tenue fermée (les partenaires restent en contact). Le couple glisse autour de la piste avec fluidité et élégance.",
    "pratique": [
      "Cinq danses : valse anglaise, tango, valse viennoise, slow fox, quickstep.",
      "Déplacement autour de la piste.",
      "Compétitions par niveau."
    ],
    "pourQui": "Pour les couples de tous âges.",
    "materiel": "Chaussures de danse de salon, tenue soignée.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Enfants et adultes",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "danse--danses-de-salon": {
    "accroche": "Les danses de couple pour les soirées et les bals : valse, tango, paso, cha-cha…",
    "principe": "Les danses de salon rassemblent les grandes danses de couple. L'objectif est de savoir danser en soirée, avec plaisir et aisance, quelle que soit la musique.",
    "pratique": [
      "Pas de base de plusieurs danses.",
      "Guidage entre partenaires.",
      "Soirées dansantes organisées par le club."
    ],
    "pourQui": "Pour les adultes et seniors, seuls ou en couple.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Adultes et seniors",
    "tags": [
      "Loisir"
    ]
  },
  "danse--salsa": {
    "accroche": "La danse de couple cubaine et portoricaine, festive et rythmée.",
    "principe": "La salsa se danse en couple, sur des musiques latines entraînantes. Le guide propose des figures, la partenaire les suit. On apprend les pas de base, puis les tours et enchaînements.",
    "pratique": [
      "Pas de base et tours.",
      "Figures guidées entre partenaires.",
      "Soirées salsa pour pratiquer."
    ],
    "pourQui": "Pour les ados et adultes, avec ou sans partenaire.",
    "materiel": "Chaussures à semelle lisse, tenue confortable.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--bachata": {
    "accroche": "Une danse de couple venue de République dominicaine, douce et sensuelle.",
    "principe": "La bachata se danse en couple, sur un rythme régulier à quatre temps. Plus lente que la salsa, elle met l'accent sur la connexion entre partenaires et les mouvements de hanches.",
    "pratique": [
      "Pas de base sur quatre temps.",
      "Tours et figures guidées.",
      "Styles traditionnel et moderne."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--rock-n-roll": {
    "accroche": "Une danse de couple énergique sur des musiques rock.",
    "principe": "Le rock se danse en couple, avec des passes, des tours et beaucoup d'énergie. C'est une danse de soirée très populaire, facile à apprendre.",
    "pratique": [
      "Pas de base à 4 ou 6 temps.",
      "Passes et tours guidés.",
      "Soirées dansantes."
    ],
    "pourQui": "Pour tous, ados et adultes.",
    "materiel": "Chaussures confortables à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--country-line": {
    "accroche": "Danser en ligne, sans partenaire, sur des musiques country et pop.",
    "principe": "Les danseurs sont alignés et exécutent la même chorégraphie. Pas besoin de partenaire : chacun danse à sa place. C'est convivial et très bon pour la mémoire.",
    "pratique": [
      "Chorégraphies courtes répétées sur toute la musique.",
      "Pas de base : vine, shuffle, kick ball change.",
      "Bals et rencontres entre clubs."
    ],
    "pourQui": "Pour les adultes et seniors, seuls ou entre amis.",
    "materiel": "Chaussures confortables, bottes pour l'ambiance.",
    "format": "En ligne, sans partenaire",
    "lieu": "Studio",
    "age": "Adultes et seniors",
    "tags": [
      "Loisir",
      "Santé"
    ]
  },
  "danse--danses-ethniques": {
    "accroche": "Danses africaines, orientales, indiennes, polynésiennes : un voyage autour du monde en musique.",
    "principe": "Les danses ethniques font découvrir les traditions dansées de différentes cultures, souvent accompagnées de leur musique et de leur histoire.",
    "pratique": [
      "Pas et rythmes propres à chaque culture.",
      "Souvent accompagnées de percussions.",
      "Spectacles et costumes traditionnels."
    ],
    "pourQui": "Pour tous ceux qui aiment découvrir d'autres cultures.",
    "materiel": "Tenue souple, pieds nus selon le style.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Découverte"
    ]
  },
  "danse--zumba": {
    "accroche": "Un cours de fitness dansé sur des rythmes latinos : on se dépense sans s'en rendre compte.",
    "principe": "La Zumba enchaîne des chorégraphies simples sur des musiques latines et internationales. Le professeur montre, on suit. L'objectif est de bouger et de s'amuser.",
    "pratique": [
      "Chorégraphies faciles, répétées.",
      "Rythmes variés : salsa, reggaeton, cumbia.",
      "Cours d'environ une heure, très cardio."
    ],
    "pourQui": "Pour les ados et adultes, sans niveau requis.",
    "materiel": "Baskets et tenue de sport.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "danse--rock-saute": {
    "accroche": "Un rock rapide avec de petits sauts : très dynamique et joyeux.",
    "principe": "Le rock sauté se danse en couple sur des musiques rapides. Les pas sont rebondis, ce qui demande de l'énergie et du rythme.",
    "pratique": [
      "Pas de base rebondis.",
      "Passes et figures rapides.",
      "Compétitions et démonstrations."
    ],
    "pourQui": "Pour les ados et adultes énergiques.",
    "materiel": "Chaussures légères.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Compétition"
    ]
  },
  "danse--barre-au-sol-classique": {
    "accroche": "Les exercices de la danse classique, faits au sol, pour la souplesse et le placement.",
    "principe": "La barre au sol reprend les exercices de la barre classique, mais allongé ou assis. Sans le poids du corps à porter, on travaille l'alignement, la souplesse et le gainage en profondeur.",
    "pratique": [
      "Exercices allongé, assis ou à genoux.",
      "Travail des pieds, des hanches et du dos.",
      "Étirements et renforcement profond."
    ],
    "pourQui": "Pour les danseurs et pour tous ceux qui veulent une meilleure posture.",
    "materiel": "Tenue souple, tapis.",
    "format": "Individuel en groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "danse--barre-au-sol-contemporaine": {
    "accroche": "Un travail au sol inspiré de la danse contemporaine, pour la souplesse et la conscience du corps.",
    "principe": "La barre au sol contemporaine explore la respiration, le relâchement et les enroulements de la colonne. Elle complète bien la pratique de la danse ou se pratique seule.",
    "pratique": [
      "Exercices au sol, fluides et respirés.",
      "Enroulements, torsions, étirements.",
      "Relâchement et conscience du corps."
    ],
    "pourQui": "Pour les ados et adultes de tous niveaux.",
    "materiel": "Tenue souple, tapis.",
    "format": "Individuel en groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Santé",
      "Loisir"
    ]
  },
  "danse--west-coast-swing": {
    "accroche": "Une danse de couple swing, fluide, élastique et improvisée.",
    "principe": "Le West Coast Swing se danse sur une ligne : la partenaire va et vient le long de cette ligne, guidée par son partenaire. On peut le danser sur de nombreuses musiques actuelles.",
    "pratique": [
      "Pas de base sur une ligne (slot).",
      "Improvisation et musicalité.",
      "Soirées et compétitions."
    ],
    "pourQui": "Pour les ados et adultes, surtout les danseurs de couple.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Compétition"
    ]
  },
  "danse--pole-dance": {
    "accroche": "Des figures acrobatiques autour d'une barre verticale, entre force et grâce.",
    "principe": "La pole dance associe danse et acrobatie autour d'une barre. On apprend les rotations, les montées et les figures inversées, en développant force et souplesse.",
    "pratique": [
      "Échauffement et renforcement.",
      "Rotations, montées, figures.",
      "Chorégraphies en musique."
    ],
    "pourQui": "Pour les adultes, femmes et hommes, sans niveau requis.",
    "materiel": "Short et brassière (la peau doit adhérer à la barre).",
    "format": "Individuel en groupe",
    "lieu": "Studio",
    "age": "Adultes",
    "tags": [
      "Loisir",
      "Santé"
    ]
  },
  "danse--breaking": {
    "accroche": "La danse acrobatique au sol née dans le hip-hop, discipline olympique à Paris 2024.",
    "principe": "Le breaking (ou breakdance) mêle pas debout (toprock), jeu de jambes au sol (footwork), figures acrobatiques (power moves) et poses figées (freezes). Il se pratique en battles, en solo ou en équipe.",
    "pratique": [
      "Toprock, footwork, power moves et freezes.",
      "Battles en un contre un ou en crew.",
      "Juges qui notent technique, musicalité et créativité."
    ],
    "pourQui": "Dès 7-8 ans, filles et garçons.",
    "materiel": "Baskets, tenue ample, bonnet pour les rotations sur la tête.",
    "format": "Solo ou crew",
    "lieu": "Studio",
    "age": "Dès 7-8 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "danse--kizomba": {
    "accroche": "Une danse de couple angolaise, lente et très connectée.",
    "principe": "La kizomba se danse en couple serré, sur des musiques lentes. Le guide propose des déplacements fluides, la partenaire suit. La connexion entre les deux est au cœur de la danse.",
    "pratique": [
      "Marches et pas de base.",
      "Guidage subtil.",
      "Soirées dansantes."
    ],
    "pourQui": "Pour les adultes.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--cabaret": {
    "accroche": "La danse de spectacle avec costumes, plumes et mises en scène.",
    "principe": "La danse cabaret s'inspire des revues et music-halls : chorégraphies de groupe, jeux de jambes, accessoires et costumes. L'objectif est souvent un spectacle.",
    "pratique": [
      "Chorégraphies de revue.",
      "Travail avec accessoires.",
      "Spectacles en fin de saison."
    ],
    "pourQui": "Pour les ados et adultes qui aiment la scène.",
    "materiel": "Talons de danse ou chaussures de jazz, costumes.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Spectacle",
      "Loisir"
    ]
  },
  "danse--boogie-woogie": {
    "accroche": "Une danse swing rapide et joyeuse, en couple.",
    "principe": "Le boogie-woogie se danse sur des musiques rock'n'roll et swing. Il est rapide, ludique et laisse beaucoup de place à l'improvisation.",
    "pratique": [
      "Pas de base et jeux de jambes.",
      "Passes et tours.",
      "Compétitions et soirées."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Compétition"
    ]
  },
  "danse--lindy-hop": {
    "accroche": "La danse swing des années 30, festive et parfois acrobatique.",
    "principe": "Né à Harlem, le lindy hop se danse sur du jazz swing. Il mêle pas de base, improvisation et figures aériennes pour les plus expérimentés.",
    "pratique": [
      "Swing out et pas de base.",
      "Improvisation sur la musique.",
      "Soirées swing."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--disco": {
    "accroche": "La danse des années 70 : fun, rythmée et pleine de bonne humeur.",
    "principe": "La danse disco reprend les pas et les poses des pistes de danse des années 70. Elle se danse seul ou en groupe, souvent en chorégraphie.",
    "pratique": [
      "Pas typiques et poses.",
      "Chorégraphies de groupe.",
      "Soirées à thème."
    ],
    "pourQui": "Pour tous les âges.",
    "materiel": "Tenue confortable.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Tout âge",
    "tags": [
      "Loisir"
    ]
  },
  "danse--comedie-musicale": {
    "accroche": "Danser, chanter et jouer : tout ce qu'il faut pour monter sur scène.",
    "principe": "Les cours de comédie musicale associent danse, chant et théâtre autour d'airs connus. Le travail aboutit souvent à un spectacle.",
    "pratique": [
      "Chorégraphies inspirées de grandes comédies musicales.",
      "Chant et expression scénique.",
      "Spectacle de fin d'année."
    ],
    "pourQui": "Pour les enfants, ados et adultes qui aiment la scène.",
    "materiel": "Tenue souple, chaussures de jazz.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Dès 8 ans",
    "tags": [
      "Spectacle",
      "Loisir"
    ]
  },
  "danse--danses-aeriennes": {
    "accroche": "Danser en l'air, suspendu à un tissu, un cerceau ou un trapèze.",
    "principe": "Les danses aériennes empruntent aux arts du cirque. On apprend à monter, à s'enrouler et à réaliser des figures en suspension, en musique.",
    "pratique": [
      "Tissu, cerceau aérien, trapèze.",
      "Renforcement et souplesse.",
      "Figures et chorégraphies."
    ],
    "pourQui": "Pour les ados et adultes en bonne condition physique.",
    "materiel": "Tenue couvrante près du corps.",
    "format": "Individuel en groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--pole-sport": {
    "accroche": "La version sportive de la pole dance, avec figures notées en compétition.",
    "principe": "Le pole sport met l'accent sur les figures de force et de souplesse, jugées comme en gymnastique. Les athlètes présentent un enchaînement en musique.",
    "pratique": [
      "Figures imposées et libres.",
      "Notation de la difficulté et de l'exécution.",
      "Compétitions par catégorie."
    ],
    "pourQui": "Pour les pratiquants déjà à l'aise sur la barre.",
    "materiel": "Short et brassière.",
    "format": "Individuel",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  },
  "danse--tango-argentin": {
    "accroche": "Une danse de couple improvisée et intense, venue de Buenos Aires.",
    "principe": "Le tango argentin se danse en couple enlacé. Il n'y a pas de chorégraphie fixe : le guide improvise, la partenaire interprète. Écoute, connexion et musicalité sont essentielles.",
    "pratique": [
      "Marche, pivots, ochos.",
      "Improvisation guidée.",
      "Milongas (bals de tango)."
    ],
    "pourQui": "Pour les adultes.",
    "materiel": "Chaussures à semelle cuir.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--danses-latino-caraibes": {
    "accroche": "Salsa, bachata, merengue : les danses festives des Caraïbes.",
    "principe": "Ces cours font découvrir plusieurs danses latino-caraïbes, souvent en couple. On apprend les pas de base de chacune et on les pratique en soirée.",
    "pratique": [
      "Plusieurs danses dans la saison.",
      "Pas de base et tours.",
      "Soirées latines."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Chaussures à semelle lisse.",
    "format": "En couple ou solo",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--claquettes": {
    "accroche": "Danser en créant le rythme avec ses pieds, comme un musicien.",
    "principe": "Les claquettes utilisent des chaussures équipées de plaques métalliques. Le danseur produit des sons avec ses pieds : il est à la fois danseur et percussionniste.",
    "pratique": [
      "Frappes, shuffles, flaps.",
      "Travail du rythme et de l'oreille.",
      "Chorégraphies et improvisations."
    ],
    "pourQui": "Dès 7 ans environ et à tout âge.",
    "materiel": "Chaussures de claquettes.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Dès 7 ans",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--afro-jazz": {
    "accroche": "Un mélange de danses africaines et de jazz, énergique et terrien.",
    "principe": "L'afro-jazz associe l'ancrage au sol et les rythmes des danses africaines aux techniques du jazz. C'est une danse très physique et joyeuse.",
    "pratique": [
      "Travail ancré au sol.",
      "Polyrythmie du corps.",
      "Chorégraphies collectives."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Tenue souple, pieds nus.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir"
    ]
  },
  "danse--rock-acrobatique": {
    "accroche": "Le rock avec portés et acrobaties, très spectaculaire.",
    "principe": "Le rock acrobatique ajoute au rock des figures aériennes : sauts, portés, rotations. C'est une discipline sportive exigeante, en couple.",
    "pratique": [
      "Pas de rock rapides.",
      "Portés et acrobaties.",
      "Compétitions notées par des juges."
    ],
    "pourQui": "Pour les ados et adultes en bonne condition physique.",
    "materiel": "Chaussures légères, tenue ajustée.",
    "format": "En couple",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Compétition",
      "Spectacle"
    ]
  },
  "danse--flamenco": {
    "accroche": "La danse andalouse rythmée par les pieds, les mains et la guitare.",
    "principe": "Le flamenco associe frappes de pieds (zapateado), jeu de bras, de mains et expression intense. Il se danse sur des rythmes précis appelés palos.",
    "pratique": [
      "Zapateado : frappes de pieds rythmées.",
      "Bras, mains et port de tête.",
      "Chorégraphies sur différents palos."
    ],
    "pourQui": "Pour les ados et adultes.",
    "materiel": "Chaussures de flamenco à clous, jupe ample.",
    "format": "Solo ou groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Spectacle"
    ]
  },
  "danse--danses-traditionnelles": {
    "accroche": "Les danses folkloriques des régions françaises et d'ailleurs.",
    "principe": "Bourrées, rondes bretonnes, scottishs, mazurkas : les danses traditionnelles se dansent en groupe, en cercle ou en ligne, souvent sur de la musique jouée en direct.",
    "pratique": [
      "Danses en cercle, en ligne ou en couple.",
      "Pas simples, faciles à apprendre.",
      "Bals folk et festivals."
    ],
    "pourQui": "Pour tous les âges, en famille.",
    "materiel": "Chaussures confortables.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Tout âge",
    "tags": [
      "Loisir",
      "Patrimoine"
    ]
  },
  "danse--danse-historique": {
    "accroche": "Les danses des siècles passés (Renaissance, baroque…), en costumes.",
    "principe": "La danse historique fait revivre les danses de cour et de bal à partir de traités anciens. Elle se pratique souvent en costume, lors de spectacles et de reconstitutions.",
    "pratique": [
      "Pavanes, gaillardes, menuets.",
      "Étude des traités anciens.",
      "Bals et spectacles en costumes."
    ],
    "pourQui": "Pour les ados et adultes passionnés d'histoire.",
    "materiel": "Chaussures à semelle lisse, costumes pour les spectacles.",
    "format": "En groupe",
    "lieu": "Studio",
    "age": "Ados et adultes",
    "tags": [
      "Loisir",
      "Patrimoine"
    ]
  },
  "parachutisme--parachutisme": {
    "accroche": "Sauter d'un avion, voler en chute libre, puis piloter sa voile jusqu'au sol.",
    "principe": "Le parachutisme se découvre en tandem, attaché à un moniteur, puis s'apprend en solo grâce à la progression accompagnée en chute (PAC). Ensuite, on choisit sa discipline : vol relatif, freefly, précision d'atterrissage…",
    "pratique": [
      "Baptême en tandem pour découvrir.",
      "PAC : premiers sauts seul, accompagné en chute par des moniteurs.",
      "Brevets successifs selon le nombre de sauts et les compétences."
    ],
    "pourQui": "Pour les adolescents (avec autorisation parentale) et les adultes, avec un certificat médical.",
    "materiel": "Parachute, altimètre, casque et combinaison prêtés pendant la formation.",
    "format": "Solo ou en groupe",
    "lieu": "Ciel",
    "age": "Ados et adultes",
    "tags": [
      "Découverte",
      "Formation"
    ]
  },
  "parachutisme--ascensionnel": {
    "accroche": "S'élever sous un parachute tracté par un véhicule ou un bateau, puis redescendre en douceur.",
    "principe": "En parachutisme ascensionnel, un câble relie le pratiquant à un treuil ou un véhicule. Le parachute ouvert le fait monter, puis il est largué ou redescendu doucement. C'est une façon simple de découvrir la sensation de vol.",
    "pratique": [
      "Décollage tracté, parachute déjà ouvert.",
      "Montée progressive, puis descente sous voile.",
      "Pratique encadrée par des moniteurs."
    ],
    "pourQui": "Pour les adolescents et adultes qui veulent découvrir le vol en douceur.",
    "materiel": "Harnais, parachute et casque fournis.",
    "format": "Individuel",
    "lieu": "Plage ou terrain",
    "age": "Ados et adultes",
    "tags": [
      "Découverte",
      "Loisir"
    ]
  },
  "parachutisme--parapente": {
    "accroche": "Décoller d'une pente à pied et planer en utilisant les courants.",
    "principe": "Le parapente est une voile souple qui permet de décoller en courant dans une pente face au vent. En profitant des ascendances, on peut voler longtemps et loin. La formation se fait en école, par étapes.",
    "pratique": [
      "Pente école pour apprendre à gonfler la voile.",
      "Premiers grands vols guidés par radio.",
      "Lecture de la météo et des ascendances."
    ],
    "pourQui": "Pour les adolescents (avec autorisation parentale) et adultes.",
    "materiel": "Voile, sellette, casque et secours prêtés en école.",
    "format": "Individuel",
    "lieu": "Ciel et montagne",
    "age": "Ados et adultes",
    "tags": [
      "Plein air",
      "Loisir"
    ]
  },
  "parachutisme--soufflerie": {
    "accroche": "Simuler la chute libre dans un tube de vent vertical, sans avion.",
    "principe": "Dans une soufflerie, un flux d'air puissant permet de flotter comme en chute libre. C'est idéal pour découvrir les sensations et pour s'entraîner aux figures de vol relatif et de freefly.",
    "pratique": [
      "Sessions de quelques minutes, très intenses.",
      "Apprentissage de la position stable puis des figures.",
      "Compétitions de vol en soufflerie."
    ],
    "pourQui": "Accessible dès l'enfance dans de nombreuses souffleries, et à tout âge.",
    "materiel": "Combinaison, casque et lunettes fournis.",
    "format": "Individuel ou en équipe",
    "lieu": "Tunnel de vent",
    "age": "Enfants et adultes",
    "tags": [
      "Découverte",
      "Compétition"
    ]
  },
  "vol-en-planeur--remorquage": {
    "accroche": "Décoller derrière un avion remorqueur, jusqu'à l'altitude de largage.",
    "principe": "Le planeur est relié par un câble à un avion qui le tracte jusqu'à l'altitude voulue. Le pilote largue alors le câble et commence son vol à voile. Suivre l'avion remorqueur fait partie de la formation.",
    "pratique": [
      "Décollage à deux appareils reliés.",
      "Tenue de position derrière le remorqueur.",
      "Largage à l'altitude choisie."
    ],
    "pourQui": "Pour les élèves pilotes et les pilotes de planeur.",
    "materiel": "Le planeur et le parachute sont fournis par le club.",
    "format": "Solo ou à deux",
    "lieu": "Aérodrome",
    "age": "Dès 14 ans",
    "tags": [
      "Formation"
    ]
  },
  "vol-en-planeur--eplaneur": {
    "accroche": "Le planeur équipé d'un moteur électrique d'appoint.",
    "principe": "L'ePlaneur dispose d'un petit moteur électrique qui sert à décoller ou à se dépanner en vol, avant de couper le moteur pour planer. C'est une évolution récente du vol à voile, plus silencieuse.",
    "pratique": [
      "Moteur électrique pour décoller ou rentrer au terrain.",
      "Vol plané classique une fois le moteur coupé.",
      "Formation spécifique à l'utilisation du moteur."
    ],
    "pourQui": "Pour les pilotes de planeur.",
    "materiel": "Appareil fourni par le club.",
    "format": "Solo ou à deux",
    "lieu": "Aérodrome",
    "age": "Ados et adultes",
    "tags": [
      "Formation"
    ]
  },
  "vol-en-planeur--motoplaneur": {
    "accroche": "Un planeur avec moteur, capable de décoller seul.",
    "principe": "Le motoplaneur dispose d'un moteur qui lui permet de décoller sans remorqueur. En vol, on peut couper ou rentrer le moteur pour planer.",
    "pratique": [
      "Décollage autonome au moteur.",
      "Vol moteur coupé en planeur.",
      "Qualification spécifique."
    ],
    "pourQui": "Pour les pilotes de planeur qui veulent plus d'autonomie.",
    "materiel": "Appareil fourni par le club.",
    "format": "Solo ou à deux",
    "lieu": "Aérodrome",
    "age": "Ados et adultes",
    "tags": [
      "Formation"
    ]
  },
  "vol-en-planeur--treuil": {
    "accroche": "Un décollage rapide et spectaculaire, tiré par un câble enroulé au sol.",
    "principe": "Au treuil, un câble relié au planeur est enroulé rapidement par un moteur au sol. Le planeur monte très vite, en pente raide, puis largue le câble. C'est une méthode économique de décollage.",
    "pratique": [
      "Montée très rapide et raide.",
      "Largage du câble en haut de la montée.",
      "Formation spécifique au décollage au treuil."
    ],
    "pourQui": "Pour les élèves pilotes et pilotes de planeur.",
    "materiel": "Planeur et parachute fournis.",
    "format": "Solo ou à deux",
    "lieu": "Aérodrome",
    "age": "Dès 14 ans",
    "tags": [
      "Formation"
    ]
  },
  "vol-en-planeur--voltige": {
    "accroche": "Boucles, tonneaux, vols dos : les figures acrobatiques en planeur.",
    "principe": "La voltige en planeur enchaîne des figures acrobatiques, sans moteur, en gérant l'énergie de l'appareil. Elle demande une formation spécifique et un planeur adapté.",
    "pratique": [
      "Figures de base : boucle, tonneau, retournement.",
      "Programmes notés en compétition.",
      "Formation progressive avec un instructeur."
    ],
    "pourQui": "Pour les pilotes de planeur expérimentés.",
    "materiel": "Planeur de voltige et parachute fournis.",
    "format": "Solo",
    "lieu": "Ciel",
    "age": "Pilotes confirmés",
    "tags": [
      "Compétition",
      "Formation"
    ]
  },
  "billard--carambole": {
    "accroche": "Le billard français, sans poches : il faut toucher les deux autres billes avec la sienne.",
    "principe": "Au billard carambole, la table n'a pas de poches. Avec ta bille, tu dois toucher les deux autres billes pour marquer un point. Plusieurs modes de jeu existent, de la partie libre au trois-bandes.",
    "pratique": [
      "Partie libre : il suffit de toucher les deux billes.",
      "Cadre et bande : zones et règles plus exigeantes.",
      "Trois-bandes : ta bille doit toucher trois bandes avant la dernière bille."
    ],
    "pourQui": "Dès 8-10 ans, et à tout âge.",
    "materiel": "Queue de billard (prêtée au début).",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 8-10 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "billard--blackball": {
    "accroche": "Le billard anglais à billes de couleur : empoche les tiennes, puis la noire.",
    "principe": "Chaque joueur doit empocher ses 7 billes (rouges ou jaunes), puis la bille noire pour gagner. La table est plus petite que celle du billard américain.",
    "pratique": [
      "Deux groupes de billes de couleur.",
      "Empocher la noire en dernier pour gagner.",
      "Fautes sanctionnées par deux coups pour l'adversaire."
    ],
    "pourQui": "Pour tous, très accessible pour débuter.",
    "materiel": "Queue de billard (prêtée au début).",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 8-10 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "billard--americain": {
    "accroche": "Le billard à billes numérotées : 8-pool, 9-pool, 10-pool.",
    "principe": "Au billard américain, les billes sont numérotées. Au 8-pool, on empoche ses billes pleines ou rayées puis la 8. Au 9-pool, on doit toucher en premier la bille de plus petit numéro.",
    "pratique": [
      "8-pool : pleines contre rayées, puis la 8.",
      "9-pool et 10-pool : toujours toucher la plus petite bille d'abord.",
      "Casse d'ouverture puissante."
    ],
    "pourQui": "Pour tous, dès 8-10 ans.",
    "materiel": "Queue de billard (prêtée au début).",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Dès 8-10 ans",
    "tags": [
      "Compétition",
      "Loisir"
    ]
  },
  "billard--snooker": {
    "accroche": "Le billard britannique sur grande table, très stratégique.",
    "principe": "Le snooker se joue sur une grande table avec 15 billes rouges et 6 billes de couleur. On alterne une rouge, puis une couleur, chacune rapportant un nombre de points différent. Le jeu défensif (les « snookers ») est essentiel.",
    "pratique": [
      "Alterner une rouge et une couleur.",
      "Chaque couleur vaut de 2 à 7 points.",
      "Jeu de placement et de sécurité très tactique."
    ],
    "pourQui": "Pour les ados et adultes patients et précis.",
    "materiel": "Queue de snooker (prêtée au début).",
    "format": "En duel",
    "lieu": "Salle",
    "age": "Ados et adultes",
    "tags": [
      "Compétition"
    ]
  }
};
