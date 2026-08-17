// Source unique de vérité : src/lib/federations-map.ts
// Ce fichier ré-exporte les fédérations sous forme de fonction pour les pages
// qui itèrent dessus (ex: pages/Federations.tsx).
export { fetchFederationSources } from '@/lib/federations-map';
export type { FederationSource as Federation } from '@/lib/federations-map';
