export const JOURNAL_CATEGORIES = ['Tous', 'Nutrition', 'Entraînement', 'Bien-être', 'Équipement', 'Vie de club', 'Formations & aides'] as const;
export type JournalCategory = Exclude<typeof JOURNAL_CATEGORIES[number], 'Tous'>;
export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  date?: string;
  content?: string;
  guide?: boolean;
  further: { href: string; label: string };
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'choisir-club-sport', title: 'Comment choisir son club de sport ?',
    excerpt: 'Localisation, niveau, tarifs, ambiance : les critères à prendre en compte pour trouver le club idéal.',
    date: '12 juin 2026', category: 'Vie de club',
    content: "Choisir un club de sport dépend de nombreux critères : la localisation, le niveau proposé, les horaires, les tarifs et l'ambiance. Commencez par définir vos objectifs, puis comparez plusieurs clubs avant de vous inscrire. Athlace vous permet de filtrer par ville et par discipline pour affiner votre recherche.",
    further: { href: '/evenements/', label: 'Découvrir les événements' },
  },
  {
    id: 'licences-federations-2026', title: 'Licences fédérales 2026 : ce qui change',
    excerpt: "Tour d'horizon des évolutions tarifaires et des nouveautés dans les principales fédérations.",
    date: '5 juin 2026', category: 'Formations & aides',
    content: "Chaque année, les fédérations sportives ajustent leurs tarifs de licence et leurs offres. En 2026, plusieurs fédérations simplifient leurs démarches en ligne et proposent des licences familiales. Consultez notre guide des fédérations pour comparer les coûts et les avantages.",
    further: { href: '/federations/', label: 'Les fédérations agréées' },
  },
  {
    id: 'sport-en-entreprise', title: 'Le sport en entreprise : bienfaits et mise en place',
    excerpt: 'Pourquoi et comment accompagner les salariés vers une pratique sportive régulière.',
    date: '28 mai 2026', category: 'Bien-être',
    content: "La pratique sportive en entreprise améliore la santé, la cohésion d'équipe et la productivité. Découvrez comment mettre en place des activités adaptées à votre structure et trouver des clubs partenaires près de votre bureau.",
    further: { href: '/pour-les-clubs/', label: "Découvrir l'offre Athlace pour les clubs" },
  },
  {
    id: 'guide-licences-federations', title: 'Guide des licences fédérales',
    excerpt: 'Comparez les fédérations sportives (FFF, FFR, FFT, etc.) et leurs tarifs de licence.',
    category: 'Formations & aides', guide: true,
    further: { href: '/federations/', label: 'Les fédérations agréées' },
  },
  {
    id: 'comment-choisir-son-club', title: 'Comment choisir son club ?',
    excerpt: 'Les critères essentiels pour trouver le club qui correspond à votre niveau et à vos envies.',
    category: 'Vie de club', guide: true,
    further: { href: '/evenements/', label: 'Découvrir les événements' },
  },
  {
    id: 'fiches-sport-par-sport', title: 'Fiches sport par sport',
    excerpt: 'Tout savoir sur chaque discipline : règles, équipement, clubs près de chez vous.',
    category: 'Équipement', guide: true,
    further: { href: '/sports/football/', label: 'Découvrir la fiche Football' },
  },
  {
    id: 'dossier-decouvrir', title: 'Dossier : Découvrir un sport', category: 'Entraînement',
    excerpt: 'De la pratique loisir à la compétition, découvrez les spécificités des sports.',
    content: "En France, il existe des milliers de disciplines sportives. De la pratique loisir à la compétition, chaque sport a ses spécificités, son équipement et ses fédérations. Ce dossier vous aide à y voir plus clair.",
    further: { href: '/sports/football/', label: 'Découvrir la fiche Football' },
  },
  {
    id: 'dossier-choisir-club', title: 'Dossier : Choisir son club', category: 'Vie de club',
    excerpt: 'Localisation, tarifs, niveau, encadrement et infrastructures : les critères à comparer.',
    content: "Le choix d'un club ne doit rien laisser au hasard. Localisation, tarifs, niveau, encadrement, infrastructures : prenez le temps de comparer et de visiter avant de vous décider.",
    further: { href: '/evenements/', label: 'Découvrir les événements' },
  },
];

export const getJournalArticle = (id?: string) => JOURNAL_ARTICLES.find((article) => article.id === id);
export const filterJournalArticles = (category: typeof JOURNAL_CATEGORIES[number]) =>
  category === 'Tous' ? JOURNAL_ARTICLES : JOURNAL_ARTICLES.filter((article) => article.category === category);